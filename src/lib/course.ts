"use server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CourseType } from "@/types/types";

const API_BASE_URL = process.env.API_BASE_URL;

export const getCourses = async (): Promise<
  Array<CourseType> | { message: string }
> => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  } catch (error) {
    console.log(error);
    return { message: `error getting courses` };
  }
};

export const createCourse = async (
  formData: FormData
): Promise<CourseType | { message: string }> => {
  const session = await getServerSession(authOptions);
  if (!session) return { message: `Unauthorized` };
  if (session.user.email != process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    return { message: `Only admin can create courses` };
  const name = formData.get("name");
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user}`,
      },
      body: JSON.stringify({
        name,
      }),
    });
    if (!response.ok) throw new Error("Failed to create course");
    revalidatePath(`/`);
    return await response.json();
  } catch (error) {
    console.log(error);
    return { message: `error creating course` };
  }
};
