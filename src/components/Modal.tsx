import styles from "@/styles/Modal.module.css";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  width?: string;
  height?: string;
}

export default function Modal({
  title,
  children,
  onClose,
  width = "600px",
  height = "auto",
}: ModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.modal}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.content} style={{ width, height }}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
