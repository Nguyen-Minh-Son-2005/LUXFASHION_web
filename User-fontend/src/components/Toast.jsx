import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Tự động ẩn sau 4 giây

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-500",
          text: "text-green-700",
          icon: "fa-circle-check",
          iconColor: "text-green-500",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-500",
          text: "text-red-700",
          icon: "fa-circle-exclamation",
          iconColor: "text-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-500",
          text: "text-yellow-700",
          icon: "fa-triangle-exclamation",
          iconColor: "text-yellow-500",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-500",
          text: "text-blue-700",
          icon: "fa-circle-info",
          iconColor: "text-blue-500",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div 
      className="fixed top-4 right-4 z-50"
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div
        className={`${styles.bg} border-l-4 ${styles.text} px-6 py-4 rounded-lg shadow-xl max-w-md flex items-center gap-3 min-w-[300px]`}
      >
        <i className={`fa-solid ${styles.icon} ${styles.iconColor} text-2xl`}></i>
        <p className="flex-1 font-semibold">{toast.message}</p>
        <button
          onClick={onClose}
          className={`${styles.text} hover:opacity-70 transition-opacity font-bold text-xl leading-none`}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

