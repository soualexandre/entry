import { toast, ToastOptions, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TOAST_TYPES: Record<string, TypeOptions> = {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning",
};

const defaultToastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
};

export const showToast = (message: string, type: TypeOptions = TOAST_TYPES.INFO) => {
    toast(message, { ...defaultToastOptions, type });
};
