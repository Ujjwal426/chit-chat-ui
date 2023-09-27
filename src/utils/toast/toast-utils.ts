import { toast } from 'react-toastify';

export default class ToastUtils {
  static showSuccessToast = (msg: string) => {
    toast.success(msg, {
      position: 'top-center',
      hideProgressBar: true,
      toastId: msg,
    });
  };

  static showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: 'top-center',
      hideProgressBar: true,
      toastId: msg,
    });
  };
  static showInfoToast = (msg: string) => {
    toast.info(msg, {
      position: 'top-center',
      hideProgressBar: true,
      toastId: msg,
    });
  };
}
