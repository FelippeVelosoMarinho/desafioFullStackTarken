import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastr: React.FC = () => {
    return <ToastContainer />;
};

// Funções auxiliares para exibir notificações
// eslint-disable-next-line react-refresh/only-export-components
export const notifySuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
};

// eslint-disable-next-line react-refresh/only-export-components
export const notifyError = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
};

export default Toastr;