// src/pages/ProductsPage.jsx
import ProductFilter from "../components/ProductFilter";
import ProductToolbar from "../components/ProductToolbar";
import ProductAddModal from "../components/ProductAddModal";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductEditModal from "../components/ProductEditModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import api from "../services/api";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]); // toàn bộ sản phẩm từ API
  const [displayedProducts, setDisplayedProducts] = useState([]); // sản phẩm hiển thị cho trang hiện tại
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get("type");

  const [sort, setSort] = useState("nameAsc"); // thêm state sort

  const [editProduct, setEditProduct] = useState(null);
  const handleEdit = (product) => setEditProduct(product);
  const handleCloseEdit = () => setEditProduct(null);

  // lấy toàn bộ sản phẩm (theo danh mục nếu có)
// lấy toàn bộ sản phẩm, sau đó lọc theo categoryType ở frontend
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllProducts(); // getAllProducts đã xử lý response.data
        const productList = Array.isArray(response) ? response : [];
        
        // ✅ Lọc theo categoryType ở frontend
        if (categoryType) {
          const filtered = productList.filter(
            (p) => p.category?.name === categoryType
          );
          setAllProducts(filtered);
        } else {
          setAllProducts(productList);
        }
        
        setPage(1);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    }
    fetchData();
  }, [categoryType]);

  // Hàm lọc + sắp xếp → trả về mảng đã sắp xếp (toàn phần, chưa cắt phân trang)
  const applyFiltersAndSort = useCallback(() => {
    let result = [...allProducts];

    // Lọc danh mục (dạng name string)
    if (filters.category) {
      result = result.filter((p) => {
        // tùy cấu trúc product: cố gắng đọc nhiều trường khả dĩ
        return (
          p.categoryName === filters.category ||
          p.category?.name === filters.category ||
          p.categoryName?.toString() === filters.category
        );
      });
    }

    // Lọc nhà cung cấp
    if (filters.supplier) {
      result = result.filter(
        (p) =>
          p.supplierName === filters.supplier ||
          p.supplier?.name === filters.supplier
      );
    }

    // Lọc giá
    if (filters.minPrice) {
      result = result.filter((p) => Number(p.originalPrice) >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => Number(p.originalPrice) <= Number(filters.maxPrice));
    }

    // Lọc khuyến mãi (nếu có trường promotionName)
    if (filters.promotion) {
      result = result.filter(
        (p) =>
          p.promotionName === filters.promotion ||
          (p.promotions && p.promotions.some((pr) => pr.name === filters.promotion))
      );
    }

    // SẮP XẾP
    switch (sort) {
      case "idAsc":
        result.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;
      case "idDesc":
        result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case "nameAsc":
        result.sort((a, b) =>
          (a.productName || a.name || "").toString().localeCompare((b.productName || b.name || "").toString())
        );
        break;
      case "nameDesc":
        result.sort((a, b) =>
          (b.productName || b.name || "").toString().localeCompare((a.productName || a.name || "").toString())
        );
        break;
      case "priceAsc":
        result.sort((a, b) => (Number(a.originalPrice) || 0) - (Number(b.originalPrice) || 0));
        break;
      case "priceDesc":
        result.sort((a, b) => (Number(b.originalPrice) || 0) - (Number(a.originalPrice) || 0));
        break;
      case "rateAsc":
        result.sort((a, b) => (Number(a.averageRating) || 0) - (Number(b.averageRating) || 0));
        break;
      case "rateDesc":
        result.sort((a, b) => (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0));
        break;
      default:
        result.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;
    }
    return result;
  }, [allProducts, filters, sort]);

  // Khi allProducts / filters / sort thay đổi -> cập nhật displayedProducts theo page
  useEffect(() => {
    const result = applyFiltersAndSort();
    setPage(1); // reset về đầu khi thay đổi bộ lọc hoặc sort (nếu muốn)
    const startIndex = (1 - 1) * pageSize;
    setDisplayedProducts(result.slice(startIndex, startIndex + pageSize));
    
  }, [allProducts, filters, sort, applyFiltersAndSort, pageSize]);

  // khi page thay đổi -> lấy slice mới
  useEffect(() => {
    const result = applyFiltersAndSort();
    const startIndex = (page - 1) * pageSize;
    setDisplayedProducts(result.slice(startIndex, startIndex + pageSize));
  }, [page, applyFiltersAndSort, pageSize]);

  // Tìm kiếm (tìm ở frontend)
  const handleSearch = (query) => {
    if (!query || query.trim() === "") {
      // Trả về trang 1 của danh sách lọc+sắp xếp
      const result = applyFiltersAndSort();
      setPage(1);
      setDisplayedProducts(result.slice(0, pageSize));
      return;
    }

    const searchTerm = query.trim();
    const firstChar = searchTerm.charAt(0);
    
    // Kiểm tra ký tự đầu tiên có phải số không
    const isNumeric = /^\d/.test(firstChar);
    
    // Lọc sản phẩm theo điều kiện
    let filtered = allProducts.filter((p) => {
      if (isNumeric) {
        // Tìm theo mã (ID)
        return p.id?.toString().includes(searchTerm);
      } else {
        // Tìm theo tên (không phân biệt hoa thường)
        return (p.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

    // Áp dụng sắp xếp lên kết quả tìm kiếm
    switch (sort) {
      case "idAsc":
        filtered.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;
      case "idDesc":
        filtered.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        break;
      case "nameAsc":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "nameDesc":
        filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "priceAsc":
        filtered.sort((a, b) => (Number(a.originalPrice) || 0) - (Number(b.originalPrice) || 0));
        break;
      case "priceDesc":
        filtered.sort((a, b) => (Number(b.originalPrice) || 0) - (Number(a.originalPrice) || 0));
        break;
      case "rateAsc":
        filtered.sort((a, b) => (Number(a.averageRating) || 0) - (Number(b.averageRating) || 0));
        break;
      case "rateDesc":
        filtered.sort((a, b) => (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0));
        break;
      default:
        filtered.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        break;
    }

    setPage(1);
    setDisplayedProducts(filtered.slice(0, pageSize));
  };

  const handleAdd = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSortChange = (value) => {
    setSort(value);
  };

  // ✂️ Checkbox chọn / xóa / confirm
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSelect = (productId, checked) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };
  const handleDelete = () => {
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Backend deleteProduct hiện tại throw UnsupportedOperationException
      // Nên sẽ luôn báo lỗi 500. Xử lý lỗi tốt hơn ở đây.
      await Promise.all(
        selectedProducts.map((id) => api.delete(`/api/admin/products/${id}`))
      );
      alert("Đã xóa thành công!");
      setShowDeleteModal(false);
      setSelectedProducts([]);
      // Reload danh sách sản phẩm
      const response = await getAllProducts();
      const productList = Array.isArray(response) ? response : [];
      
      // Lọc theo categoryType nếu có
      if (categoryType) {
        const filtered = productList.filter(
          (p) => p.category?.name === categoryType
        );
        setAllProducts(filtered);
      } else {
        setAllProducts(productList);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      // Backend hiện tại chưa implement deleteProduct, luôn trả về 500
      if (error.response?.status === 500) {
        alert("Chức năng xóa sản phẩm hiện chưa được hỗ trợ ở backend. Vui lòng liên hệ quản trị viên.");
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Không thể xóa sản phẩm";
        alert(`Không thể xóa sản phẩm: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="flex gap-6 lg:gap-8">
      <div className="hidden lg:block lg:w-72 xl:w-80">
        <div className="h-full rounded-3xl border border-slate-800 bg-slate-950/70 shadow-[0_18px_45px_rgba(15,23,42,0.85)] px-4 py-5 overflow-y-auto backdrop-blur-2xl">
          <ProductFilter onFilterChange={setFilters} initialCategory={categoryType} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <ProductToolbar
          onAddProduct={handleAdd}
          onDeleteProduct={handleDelete}
          onSearchProduct={handleSearch}
          onSortChange={handleSortChange}
        />

        <h2 className="text-xl md:text-2xl font-semibold mb-4 bg-linear-to-r from-sky-300 via-emerald-300 to-violet-300 bg-clip-text text-transparent">
          {categoryType ? `Danh mục: ${categoryType}` : "Tất cả sản phẩm"}
        </h2>

        <ProductList
          products={displayedProducts}
          onEdit={handleEdit}
          onSelect={handleSelect}
        />

        {editProduct && (
          <ProductEditModal
            product={editProduct}
            onClose={handleCloseEdit}
            onSuccess={async () => {
              // Reload danh sách sản phẩm sau khi sửa
              try {
                const response = await getAllProducts();
                const productList = Array.isArray(response) ? response : [];
                
                if (categoryType) {
                  const filtered = productList.filter(
                    (p) => p.category?.name === categoryType
                  );
                  setAllProducts(filtered);
                } else {
                  setAllProducts(productList);
                }
              } catch (error) {
                console.error("Lỗi khi reload sản phẩm:", error);
              }
            }}
          />
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            selectedCount={selectedProducts.length}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        <Pagination
          currentPage={page}
          totalPages={Math.ceil(applyFiltersAndSort().length / pageSize)}
          onPageChange={setPage}
        />

        {showModal && (
          <ProductAddModal
            onClose={handleCloseModal}
            onSuccess={async () => {
              // Reload danh sách sản phẩm sau khi thêm
              try {
                const response = await getAllProducts();
                const productList = Array.isArray(response) ? response : [];
                
                if (categoryType) {
                  const filtered = productList.filter(
                    (p) => p.category?.name === categoryType
                  );
                  setAllProducts(filtered);
                } else {
                  setAllProducts(productList);
                }
              } catch (error) {
                console.error("Lỗi khi reload sản phẩm:", error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}