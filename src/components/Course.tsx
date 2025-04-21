import { CourseType } from "@/types/types";
import styles from "@/styles/Course.module.css";

interface CourseProps extends CourseType {
  selected?: boolean;
  onClick?: () => void;
}
export default function Course({ name, selected, onClick }: CourseProps) {
  return (
    <button
      type="button"
      className={[styles.course, selected ? styles.selected : ``].join(` `)}
      onClick={onClick}
      disabled={!onClick}
    >
      <p>{name}</p>
      <svg width="16" height="16" viewBox="0 0 20 21" fill="none">
        <path
          d="M18 2.5L2 18.5M18 18.5L2 2.5"
          stroke="var(--background)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
