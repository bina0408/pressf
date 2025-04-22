"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProfessorById, fetchFeedbacks } from "@/api/api";
import { FeedbackType } from "@/types/types"; // Ensure FeedbackType is imported
import Profile from "./Profile";
import Feedback from "./Feedback";
import styles from "./Professor.module.css";

interface ProfessorType {
  id: string;
  name: string;
  email: string;
  image?: string;
  rating: number;
  info: string;
  courses: CourseType[];
  history?: string; // Add history property
  createdAt: string; // Add createdAt property
  updatedAt: string; // Add updatedAt property
}

interface CourseType {
  id: string;
  name: string;
}
// Remove the local FeedbackType definition and use the imported one


export default function Professor() {
  const params = useParams();
  const id = params.id as string;
  const [professor, setProfessor] = useState<ProfessorType | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [professorData, feedbacksData] = await Promise.all([
          fetchProfessorById(id),
          fetchFeedbacks(id),
        ]);
        setProfessor(professorData);
        setFeedbacks(feedbacksData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load professor data");
        setLoading(false);
        console.error("Error fetching professor:", err);
      }
    };

    loadData();
  }, [id]);

  const filteredFeedbacks = courseFilter.length
    ? feedbacks.filter(({ courses }) =>
        courses.some(({ id }) => id === courseFilter))
    : feedbacks;

  if (loading) {
    return <div className={styles.loading}>Loading professor data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!professor) {
    return <div className={styles.error}>Professor not found</div>;
  }

  return (
    <div className={styles.professorContainer}>
      <Profile
        {...professor}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
      />

      {filteredFeedbacks.length > 0 && (
        <section className={styles.feedbacksSection}>
          <h2>Student Feedback</h2>
          <div className={styles.feedbackStats}>
            <span>
              Average Rating: <strong>{professor.rating.toFixed(1)}</strong>
            </span>
            <span>
              Total Reviews: <strong>{feedbacks.length}</strong>
            </span>
            {courseFilter && (
              <span>
                Filtered Reviews: <strong>{filteredFeedbacks.length}</strong>
              </span>
            )}
          </div>

          <ul className={styles.feedbackList}>
            {filteredFeedbacks.map((feedback) => (
              <li key={feedback.id} className={styles.feedbackItem}>
                <Feedback
                  {...feedback}
                  courseFilter={courseFilter}
                  setCourseFilter={setCourseFilter}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {filteredFeedbacks.length === 0 && (
        <div className={styles.noFeedback}>
          {courseFilter
            ? "No feedback available for the selected course"
            : "No feedback available for this professor yet"}
        </div>
      )}
    </div>
  );
}
