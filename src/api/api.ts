import { CourseType, ProfessorType, FeedbackType, Session } from "@/types/types";

const API_BASE_URL = "http://localhost:8080/api"; // Update with your Spring Boot server URL

export const fetchProfessors = async (): Promise<ProfessorType[]> => {
  const response = await fetch(`${API_BASE_URL}/professors`);
  if (!response.ok) throw new Error("Failed to fetch professors");
  return response.json();
};

export const fetchProfessorById = async (
  id: string
): Promise<ProfessorType> => {
  const response = await fetch(`${API_BASE_URL}/professors/${id}`);
  if (!response.ok) throw new Error("Failed to fetch professor");
  return response.json();
};

export const fetchFeedbacks = async (
  professorId: string
): Promise<FeedbackType[]> => {
  const response = await fetch(
    `${API_BASE_URL}/professors/${professorId}/feedbacks`
  );
  if (!response.ok) throw new Error("Failed to fetch feedbacks");
  return response.json();
};

export const fetchCourses = async (): Promise<CourseType[]> => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
};

export const loginWithGoogle = async () => {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  window.location.href = "/";
};

export const getCurrentUser = async (): Promise<Session | null> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    credentials: "include",
  });
  if (!response.ok) return null;
  return response.json();
};
