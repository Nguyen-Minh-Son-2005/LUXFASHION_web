import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dssplq from "../components/dssp-lq";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function ProductDetail({ userId }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const formatVND = (value) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        throw new Error("Không thể tải chi tiết sản phẩm");
      }
      const data = await res.json();
      const productPayload = data?.data ?? data;
      if (productPayload && productPayload.id) {
        setProduct(productPayload);
      } else {
        setError("Không tìm thấy sản phẩm");
      }
    } catch (err) {
      console.error("Fetch product error:", err);
      setError(err.message || "Lỗi khi tải dữ liệu sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMyReview = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/reviews/my-review?productId=${id}`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setUserReview(data);
        setRatingValue(data.rating ?? 0);
      }
    } catch (err) {
      console.error("Fetch my review error:", err);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    fetchMyReview();
  }, [fetchMyReview]);

  const sizes = [
    { id: 1, name: "S" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
    { id: 4, name: "XL" },
  ];

  useEffect(() => {
    setSelectedSizeId("");
    setQuantity(1);
    setRatingValue(0);
    setUserReview(null);
    fetchMyReview();
  }, [product?.id, fetchMyReview]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Đang tải...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="text-center mt-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <i className="fa-solid fa-circle-exclamation text-red-500 text-4xl mb-3"></i>
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    </div>
  );
  if (!product) return null;

  const unitSalePrice = product.salePrice ?? product.originalPrice ?? 0;
  const unitOriginalPrice = product.originalPrice ?? unitSalePrice;
  const totalSalePrice = unitSalePrice * quantity;
  const totalOriginalPrice = unitOriginalPrice * quantity;

  const apiUrl = product.category?.id
    ? `/api/products?categoryId=${product.category.id}`
    : `/api/products`;

  const handleSubmitReview = async () => {
    if (!userId) {
      showWarning("Bạn cần đăng nhập để đánh giá sản phẩm!");
      return;
    }
    if (ratingValue < 1 || ratingValue > 5) {
      showWarning("Vui lòng chọn số sao từ 1-5 trước khi gửi.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: Number(product.id),
          rating: Number(ratingValue),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Gửi đánh giá thất bại");
      }

      const saved = await res.json();
      setUserReview(saved);
      showSuccess("Đã gửi đánh giá của bạn!");
      fetchProduct(); // cập nhật lại điểm trung bình
    } catch (err) {
      console.error("Submit review error:", err);
      showError(err.message || "Không gửi được đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    // Kiểm tra user đã đăng nhập chưa
    if (!userId) {
      showError("Bạn cần đăng nhập trước khi thêm vào giỏ hàng!");
      return;
    }

    if (!selectedSizeId) {
      showWarning("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }

    const matchingVariant =
      product?.variants?.find(
        (variant) => variant.size?.id === Number(selectedSizeId)
      ) ?? null;

    if (!matchingVariant) {
      showError("Size bạn chọn hiện không khả dụng cho sản phẩm này!");
      return;
    }

    if (
      typeof matchingVariant.quantity === "number" &&
      quantity > matchingVariant.quantity
    ) {
      showError("Số lượng vượt quá tồn kho hiện có!");
      return;
    }

    const payload = {
      variantId: Number(matchingVariant.id),
      quantity: Number(quantity),
    };

    console.log("📦 Payload gửi đi:", payload);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        let errorMessage = "Thêm vào giỏ hàng thất bại!";
        try {
          const err = await res.json();
          console.error("❌ Server error response:", err);
          errorMessage = err.message || err.error || JSON.stringify(err);
        } catch {
          const textError = await res.text();
          console.error("❌ Server error (text):", textError);
          errorMessage = `Server error: ${res.status} - ${textError}`;
        }
        showError(errorMessage);
        return;
      }

      const result = await res.json();
      console.log("✅ Success response:", result);
      showSuccess("Thêm sản phẩm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("💥 Add to cart error:", err);
      showError("Lỗi kết nối server, vui lòng thử lại!");
    }
  };

  const handleBuyNow = async () => {
    // Kiểm tra user đã đăng nhập chưa
    if (!userId) {
      showError("Bạn cần đăng nhập trước khi mua hàng!");
      return;
    }

    if (!selectedSizeId) {
      showWarning("Vui lòng chọn size trước khi mua hàng!");
      return;
    }

    const matchingVariant =
      product?.variants?.find(
        (variant) => variant.size?.id === Number(selectedSizeId)
      ) ?? null;

    if (!matchingVariant) {
      showError("Size bạn chọn hiện không khả dụng cho sản phẩm này!");
      return;
    }

    if (
      typeof matchingVariant.quantity === "number" &&
      quantity > matchingVariant.quantity
    ) {
      showError("Số lượng vượt quá tồn kho hiện có!");
      return;
    }

    const payload = {
      variantId: Number(matchingVariant.id),
      quantity: Number(quantity),
    };

    try {
      // Thêm vào giỏ hàng trước
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "Thêm vào giỏ hàng thất bại!";
        try {
          const err = await res.json();
          errorMessage = err.message || err.error || JSON.stringify(err);
        } catch {
          const textError = await res.text();
          errorMessage = `Server error: ${res.status} - ${textError}`;
        }
        showError(errorMessage);
        return;
      }

      // Lấy giỏ hàng để tìm cartDetailId vừa thêm
      const cartRes = await fetch("/api/cart", { credentials: "include" });
      if (!cartRes.ok) {
        showError("Không thể lấy thông tin giỏ hàng!");
        return;
      }

      const cartData = await cartRes.json();
      const cartPayload = cartData?.data ?? cartData;
      const cartItems = cartPayload?.items ?? [];

      // Tìm item vừa thêm (dựa trên variantId và quantity)
      const newItem = cartItems.find(
        (item) =>
          item.variantId === Number(matchingVariant.id) &&
          item.quantity === Number(quantity)
      );

      if (!newItem) {
        // Nếu không tìm thấy, lấy item cuối cùng (có thể là item vừa thêm)
        const lastItem = cartItems[cartItems.length - 1];
        if (lastItem) {
          // Chuyển đến trang đơn hàng với cartDetailId
          navigate("/donhang", {
            state: { cartDetailIds: [lastItem.cartDetailId] },
          });
        } else {
          showError("Không tìm thấy sản phẩm trong giỏ hàng!");
        }
        return;
      }

      // Chuyển đến trang đơn hàng với cartDetailId
      navigate("/donhang", {
        state: { cartDetailIds: [newItem.cartDetailId] },
      });
    } catch (err) {
      console.error("💥 Buy now error:", err);
      showError("Lỗi kết nối server, vui lòng thử lại!");
    }
  };

  return (
    <>
      <Toast toast={toast} onClose={hideToast} />
      <div className="max-w-6xl mx-auto mt-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
        {/* Ảnh sản phẩm */}
        <div>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                Mã SP: {product.id}
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-700 font-medium">
                {product.category?.name}
              </span>
              <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm text-yellow-700 font-medium flex items-center gap-1">
                <i className="fa-solid fa-star text-yellow-500"></i>
                {Number(product.averageRating).toFixed(1) ?? 0}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <p className="font-semibold text-gray-700">
              Thương hiệu: <span className="text-indigo-600 text-lg">{product.supplier?.name}</span>
            </p>
          </div>

          {/* Giá sản phẩm */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-4xl font-extrabold text-red-600">{formatVND(totalSalePrice)}</span>
              {product.originalPrice && product.salePrice && product.originalPrice > product.salePrice && (
                <>
                  <span className="text-gray-400 line-through text-xl">{formatVND(totalOriginalPrice)}</span>
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    -{product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Chọn size và số lượng */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="size" className="font-bold text-gray-700 text-lg min-w-[80px]">
                  Size:
                </label>
                <select
                  id="size"
                  value={selectedSizeId}
                  onChange={(e) => setSelectedSizeId(Number(e.target.value))}
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white font-medium"
                >
                  <option value="">Chọn size</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-bold text-gray-700 text-lg min-w-[120px]">Số lượng:</span>
                <div className="inline-flex border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300 font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
              onClick={handleBuyNow}
            >
              <i className="fa-solid fa-bolt mr-2"></i>Mua ngay
            </button>
            <button 
              className="flex-1 border-2 border-indigo-500 text-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95" 
              onClick={handleAddToCart}
            >
              <i className="fa-solid fa-cart-shopping mr-2"></i>Thêm vào giỏ hàng
            </button>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-info-circle text-indigo-600"></i>
              Mô tả sản phẩm
            </h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Đánh giá sản phẩm */}
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-star text-yellow-400"></i>
                Đánh giá sản phẩm
              </h3>
              <p className="text-sm text-gray-500">Chọn số sao (1-5) và để lại nhận xét</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-500 text-lg font-semibold">
              <i className="fa-solid fa-star"></i>
              {Number(product.averageRating ?? 0).toFixed(1)}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingValue(star)}
                className={`text-2xl transition-transform duration-150 ${
                  ratingValue >= star ? "text-yellow-400" : "text-gray-300"
                } hover:scale-110`}
              >
                <i className="fa-solid fa-star"></i>
              </button>
            ))}
            <span className="text-sm text-gray-600">
              Bạn đã chọn {ratingValue || "?"}/5 sao
            </span>
          </div>

          {userReview && (
            <p className="text-sm text-green-600">
              Bạn đã đánh giá {userReview.rating}/5 sao.
            </p>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="pt-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Các sản phẩm liên quan</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto"></div>
        </div>
        <Dssplq apiUrl={apiUrl} />
      </div>
    </>
  );
}