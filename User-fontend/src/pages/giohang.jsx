import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage({ userId }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCart([]);
      setError("Bạn cần đăng nhập để xem giỏ hàng.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Không thể tải giỏ hàng.");
      }
      const data = await res.json();
      const payload = data?.data ?? data;
      const items = payload?.items ?? [];
      setCart(items);
      setSelected((prev) => {
        const stillValid = prev.filter((id) =>
          items.some((item) => item.cartDetailId === id)
        );
        if (stillValid.length > 0) return stillValid;
        return items.map((item) => item.cartDetailId);
      });
      setError("");
    } catch (err) {
      console.error("Fetch cart error:", err);
      setError(err.message || "Không thể tải giỏ hàng.");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    setSelected((prev) =>
      prev.filter((id) => cart.some((item) => item.cartDetailId === id))
    );
  }, [cart]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const totalPrice = cart
      .filter((item) => selected.includes(item.cartDetailId))
      .reduce((sum, i) => sum + i.price * i.quantity, 0);
    setTotal(totalPrice);
  }, [selected, cart]);

  const updateQuantity = async (id, change) => {
    const item = cart.find((x) => x.cartDetailId === id);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/cart/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQty }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Cập nhật số lượng thất bại.");
      }

      await fetchCart();
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"))
      return;

    try {
      const res = await fetch(`/api/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Xóa sản phẩm thất bại.");
      }

      await fetchCart();
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <i className="fa-solid fa-cart-shopping text-red-500"></i>
          GIỎ HÀNG
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
          <p className="text-red-700 font-semibold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </p>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      )}

      {!userId ? (
        <div className="text-center mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <i className="fa-solid fa-circle-exclamation text-yellow-500 text-5xl mb-4"></i>
          <p className="text-gray-700 text-lg font-semibold">Vui lòng đăng nhập để xem giỏ hàng.</p>
        </div>
      ) : cart.length === 0 && !loading ? (
        <div className="text-center mt-10 bg-gray-50 border border-gray-200 rounded-xl p-12">
          <i className="fa-solid fa-cart-shopping text-gray-400 text-6xl mb-4"></i>
          <p className="text-gray-600 text-xl font-semibold">Giỏ hàng của bạn đang trống 😢</p>
        </div>
      ) : (
        cart.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <th className="p-4"></th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Đơn giá</th>
                  <th className="p-4 text-center">Số lượng</th>
                  <th className="p-4 text-right">Thành tiền</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.cartDetailId}
                    className="border-b border-gray-200 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.cartDetailId)}
                        onChange={() => toggleSelect(item.cartDetailId)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        <div>
                          <p className="font-bold text-gray-800">
                            {item.product?.name || "Sản phẩm"}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            <span className="bg-blue-100 px-2 py-1 rounded">{item.color?.name}</span> / <span className="bg-purple-100 px-2 py-1 rounded">{item.size?.name}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-gray-700">{item.price?.toLocaleString("vi-VN")}₫</span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartDetailId, -1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartDetailId, 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors font-bold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-bold text-red-600 text-lg">{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteItem(item.cartDetailId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 font-semibold"
                      >
                        <i className="fa-solid fa-trash mr-1"></i>Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Tổng tiền ({selected.length} sản phẩm):</span>
                <span className="text-3xl font-extrabold">{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <button
                onClick={() => {
                  if (selected.length === 0) return;
                  navigate("/donhang", {
                    state: { cartDetailIds: selected },
                  });
                }}
                className="w-full bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={selected.length === 0}
              >
                <i className="fa-solid fa-credit-card mr-2"></i>Mua ngay
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}
