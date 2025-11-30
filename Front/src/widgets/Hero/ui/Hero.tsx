import Button from "@/shared/ui/atoms/Button/ui/Button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden">
      <div className="flex flex-col gap-6 items-center text-center max-w-4xl px-4 z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 animate-fade-up-1">
          VideoEditorH
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-up-2">
          VideoEditorH is a web-based video editing platform that enables anyone to create high-quality videos easily
          through an intuitive interface and powerful editing features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mt-4 animate-fade-up-3">
          <Link href="/projects">
            <Button className="h-12 px-8 text-base font-medium text-black hover:bg-zinc-200 transition-all rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
