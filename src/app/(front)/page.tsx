import Hero from "@/components/hero";

// http://localhost:3000/
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-heading font-semibold text-4xl tracking-[-0.04em] sm:text-5xl md:text-7xl/[1.1] text-foreground">
            welcome WHA
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-xl md:text-2xl/normal">
            ระบบตรวจสอบพลังงานไฟฟ้า WattVision
          </p>
        </div>
      </div>
    </div>
  );
}