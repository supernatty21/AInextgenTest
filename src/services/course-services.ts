import type { CourseItem } from "@/components/features-course";

type CourseApiResponse = {
  data: CourseItem[];
};

export async function fetchCourses(): Promise<CourseItem[]> {
  try {
    const response = await fetch("https://api.codingthailand.com/api/course", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const result: CourseApiResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}
