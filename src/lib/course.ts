"use server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "./db";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const getCourses = async () => {
  await connectToDatabase();
  try {
    const courses = await Course.find();
    return {
      courses: courses.map(({ _id, name }) => ({
        id: _id.toString(),
        name,
      })),
    };
  } catch (error) {
    console.log(error);
    return { message: `error getting courses` };
  }
};

export const createCourse = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session) return { message: `Unauthorized` };
  if (session.user.email != process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    return { message: `Only admin can create courses` };
  await connectToDatabase();
  const name = formData.get("name");
  try {
    const newCourse = await Course.create({ name });
    newCourse.save();
    revalidatePath(`/`);
    return { id: newCourse._id.toString(), name };
  } catch (error) {
    console.log(error);
    return { message: `error creating course` };
  }
};
