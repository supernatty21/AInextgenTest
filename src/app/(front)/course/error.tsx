"use client";

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-medium tracking-[-0.02em]">
        เกิดข้อผิดพลาด
      </h2>
      <p className="mt-2 text-muted-foreground">
        ไม่สามารถโหลดหลักสูตรได้ในขณะนี้
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}
