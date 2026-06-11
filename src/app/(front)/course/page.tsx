import FeaturesCourse from "@/components/features-course";
import { fetchCourses } from "@/services/course-services";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "หลักสูตรทั้งหมด",
  description: "รายการหลักสูตรทั้งหมด",
};

// http://localhost:3000/course
export default async function CoursePage() {
  await connection();

  const courses = await fetchCourses();

  return (
    <main>
      <FeaturesCourse courses={courses} />
    </main>
  );
}
