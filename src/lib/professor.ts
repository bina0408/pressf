"use server";
import { revalidatePath } from "next/cache";
import { FeedbackType, ProfessorType } from "@/types/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { put } from "@vercel/blob";

const API_BASE_URL = process.env.API_BASE_URL;

export const getProfessors = async (): Promise<Array<ProfessorType>> => {
  const response = await fetch(`${API_BASE_URL}/professors`);
  if (!response.ok) throw new Error("Failed to fetch professors");
  return response.json();
};

export const getProfessor = async (
  id: string
): Promise<{ professor: ProfessorType; feedbacks: Array<FeedbackType> }> => {
  const response = await fetch(`${API_BASE_URL}/professors/${id}`);
  if (!response.ok) throw new Error("Failed to fetch professor");
  return response.json();
};

export const rateProfessor = async (
  formData: FormData
): Promise<{ message: string }> => {
  const session = await getServerSession(authOptions);
  if (!session) return { message: `Unauthorized` };
  const rate = Number(formData.get("rate"));
  const text = formData.get("text");
  const author = session.user.id;
  const professor = formData.get("professor");
  const courses = formData.getAll("courses");
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.token}`,
    },
    body: JSON.stringify({
      rate,
      text: text?.toString().length ? text : undefined,
      courses,
      author,
      professor,
    }),
  });
  if (!response.ok) throw new Error("Failed to create feedback");
  return { message: `feedback created` };
};

export const createProfessor = async (
  formData: FormData
): Promise<ProfessorType | { message: string }> => {
  const session = await getServerSession(authOptions);
  if (!session) return { message: `Unauthorized` };
  if (session.user.email != process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    return { message: `Only admin can create courses` };
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("image") as File;
  const info = formData.get("info") as string;
  const courses = formData.getAll("courses");
  const blob = imageFile
    ? await put(`/pfp/${email.split(`@`)[0]}`, imageFile, {
        access: "public",
      })
    : undefined;
  try {
    const response = await fetch(`${API_BASE_URL}/professors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user}`,
      },
      body: JSON.stringify({
        name,
        email,
        info,
        courses,
        image: blob?.url,
      }),
    });
    if (!response.ok) throw new Error("Failed to create professor");
    revalidatePath(`/`);
    return response.json();
  } catch (error) {
    console.log(error);
    return { message: `error creating user` };
  }
};
