import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  const showSuccess = (message) => showToast(message, "success");
  const showError = (message) => showToast(message, "error");
  const showWarning = (message) => showToast(message, "warning");
  const showInfo = (message) => showToast(message, "info");

  const hideToast = () => setToast(null);

  return { toast, showToast, showSuccess, showError, showWarning, showInfo, hideToast };
}

