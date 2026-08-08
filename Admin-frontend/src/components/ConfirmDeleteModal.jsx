export default function ConfirmDeleteModal({ selectedCount, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-950/90 rounded-2xl p-6 w-full max-w-sm shadow-[0_24px_80px_rgba(15,23,42,1)] border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-50 mb-3">
          Xác nhận xóa sản phẩm
        </h2>
        <p className="text-slate-300 mb-5 text-sm">
          {selectedCount === 1
            ? "Bạn có chắc muốn xóa sản phẩm này không?"
            : `Bạn có chắc muốn xóa ${selectedCount} sản phẩm này không?`}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-sm font-semibold"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}