"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ReactToastify.module.css";

export default function ToastProvider() {
  return (
    <ToastContainer 
      position="top-right" 
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className={styles.customToastContainer}
      toastClassName={styles.customToast}
      style={{ zIndex: 2147483647 }}
      toastStyle={{
        zIndex: 2147483647,
      }}
    />
  );
}
