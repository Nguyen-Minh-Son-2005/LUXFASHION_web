import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

// Lấy dữ liệu cached từ localStorage (nếu có)
const getCachedUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? parsed ?? null;
  } catch {
    return null;
  }
};

export default function ThongTinKhachHang() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Gọi API lấy profile với cookie
  const fetchProfile = async (options = { silent: false }) => {
    const { silent } = options;
    if (!silent) {
      setLoading(true);
      setWarning("");
      setError("");
    } else {
      setRefreshing(true);
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include", // 🔥 bắt buộc gửi cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Bạn cần đăng nhập để xem thông tin khách hàng.");
        }
        const errText = await res.text();
        throw new Error(errText || "Không thể lấy thông tin khách hàng.");
      }

      const data = await res.json();
      const payload = data?.data ?? data;

      // ✅ Sửa: Backend có thể trả về `phone` hoặc `phoneNumber`, cần normalize
      const normalizedPayload = {
        ...payload,
        phone: payload.phone || payload.phoneNumber || "",
      };

      setProfile(normalizedPayload);
      setFormData({
        fullName: normalizedPayload.fullName || "",
        username: normalizedPayload.username || "",
        email: normalizedPayload.email || "",
        phone: normalizedPayload.phone || "",
        address: normalizedPayload.address || "",
      });
      setWarning("");
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
      const cached = getCachedUser();
      if (cached) {
        // ✅ Sửa: Normalize phone field từ cache
        const normalizedCached = {
          ...cached,
          phone: cached.phone || cached.phoneNumber || "",
        };
        setProfile(normalizedCached);
        setFormData({
          fullName: normalizedCached.fullName || "",
          username: normalizedCached.username || "",
          email: normalizedCached.email || "",
          phone: normalizedCached.phone || "",
          address: normalizedCached.address || "",
        });
        setWarning(
          "Không lấy được dữ liệu mới từ máy chủ. Đang hiển thị thông tin đã lưu."
        );
      } else {
        setProfile(null);
        setError(err.message || "Không thể lấy thông tin khách hàng.");
      }
    } finally {
      if (!silent) setLoading(false);
      else setRefreshing(false);
    }
  };

  // Thay đổi dữ liệu form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu thông tin profile
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      // ✅ Sửa: Backend yêu cầu field `phoneNumber` chứ không phải `phone`
      const requestPayload = {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phone, // Map `phone` thành `phoneNumber`
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 gửi cookie
        body: JSON.stringify(requestPayload),
      });

      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ message: "Lỗi cập nhật thông tin" }));
        throw new Error(errData.message || "Không thể cập nhật thông tin");
      }

      const data = await res.json();
      const payload = data?.data ?? data;

      // ✅ Sửa: Backend trả về `phoneNumber`, cần map về `phone` để hiển thị
      const normalizedPayload = {
        ...payload,
        phone: payload.phoneNumber || payload.phone || "",
      };

      setProfile(normalizedPayload);
      setFormData({
        fullName: normalizedPayload.fullName || "",
        username: normalizedPayload.username || "",
        email: normalizedPayload.email || "",
        phone: normalizedPayload.phone || "",
        address: normalizedPayload.address || "",
      });
      localStorage.setItem("user", JSON.stringify({ data: normalizedPayload }));
      setIsEditing(false);
      showSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setError(err.message || "Không thể cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setFormData({
      fullName: profile.fullName || "",
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setIsEditing(false);
    setError("");
  };

  useEffect(() => {
    fetchProfile({ silent: false });
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg text-center">
          <i className="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <i className="fa-solid fa-user-slash text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-600 text-lg font-semibold">Không có thông tin khách hàng.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-2xl mx-auto mt-8 px-4 pb-10">
      <div className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Thông tin khách hàng
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          </div>
          <button
            onClick={() => fetchProfile({ silent: true })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-300 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={refreshing || isEditing}
          >
            {refreshing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full"></span>
                Đang cập nhật...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrows-rotate"></i>
                Làm mới
              </>
            )}
          </button>
        </div>

        {warning && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 px-5 py-4 rounded-lg flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
            <span className="font-semibold">{warning}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <InputField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
          <InputField
            label="Tên đăng nhập"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            isEditing={isEditing}
            disabled={true}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
          <InputField
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            isEditing={isEditing}
          />
          <InputField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            isEditing={isEditing}
            multiline={true}
          />
        </div>

        <div className="mt-8 flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <i className="fa-solid fa-pen-to-square mr-2"></i>Sửa thông tin
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
                disabled={saving}
              >
                <i className="fa-solid fa-xmark mr-2"></i>Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk mr-2"></i>Lưu
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  isEditing,
  disabled,
  type = "text",
  multiline = false,
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
        {name === 'fullName' && <i className="fa-solid fa-user text-indigo-500"></i>}
        {name === 'username' && <i className="fa-solid fa-at text-indigo-500"></i>}
        {name === 'email' && <i className="fa-solid fa-envelope text-indigo-500"></i>}
        {name === 'phone' && <i className="fa-solid fa-phone text-indigo-500"></i>}
        {name === 'address' && <i className="fa-solid fa-location-dot text-indigo-500"></i>}
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={!isEditing || disabled}
          rows={3}
          className={`text-base px-4 py-3 border-2 rounded-xl transition-all ${
            isEditing && !disabled
              ? "border-indigo-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              : "border-gray-300 bg-gray-50 text-gray-700"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          placeholder={isEditing ? `Nhập ${label.toLowerCase()}` : "Chưa cập nhật"}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          disabled={!isEditing || disabled}
          className={`text-base px-4 py-3 border-2 rounded-xl transition-all ${
            isEditing && !disabled
              ? "border-indigo-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              : "border-gray-300 bg-gray-50 text-gray-700"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          placeholder={isEditing ? `Nhập ${label.toLowerCase()}` : "Chưa cập nhật"}
        />
      )}
    </div>
  );
}
