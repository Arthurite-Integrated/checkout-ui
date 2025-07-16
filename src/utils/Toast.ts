import { toast } from "react-toastify"

const ErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    theme: 'dark',
    hideProgressBar: false,
    progressClassName: "custom-toast-progress",
  });
};

const Toast = (message: string, error?: boolean) => {
  error ? ErrorToast(message) : toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    theme: 'dark',
    hideProgressBar: false,
    progressClassName: "custom-toast-progress",
  });
};

const InfoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    theme: 'dark',
    hideProgressBar: false,
    progressClassName: "custom-toast-progress",
  });
};

export { ErrorToast, Toast, InfoToast };