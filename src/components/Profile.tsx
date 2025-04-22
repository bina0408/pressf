"use client";

import styles from "@/styles/Profile.module.css";
import Course from "./Course";
import ProfileImage from "./ProfileImage";

interface CourseType {
  id: string;
  name: string;
}

interface ProfessorProfileProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  courses: CourseType[];
  rating: number;
  info: string;
  courseFilter: string;
  setCourseFilter: (course: string) => void;
}

export default function Profile({
  image,
  name,
  email,
  courses,
  rating,
  info,
  courseFilter,
  setCourseFilter,
}: ProfessorProfileProps) {
  return (
    <div className={styles.profile}>
      <div className={styles.profileHeader}>
        <div className={styles.imageContainer}>
          <ProfileImage image={image} name={name} fill />
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{name}</h1>
          <a href={`mailto:${email}`} className={styles.email}>
            {email}
          </a>
          <div className={styles.ratingContainer}>
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            <span className={styles.ratingLabel}>Average Rating</span>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Courses</h2>
        <div className={styles.coursesBox}>
          {courses.map((course) => (
            <Course
              key={course.id}
              id={course.id}
              name={course.name}
              selected={courseFilter === course.id}
              onClick={() =>
                setCourseFilter(course.id === courseFilter ? "" : course.id)
              }
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <p className={styles.infoText}>{info || "No information available"}</p>
      </section>
    </div>
  );
}
