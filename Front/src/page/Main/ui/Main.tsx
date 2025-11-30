import Hero from "@/widgets/Hero/ui/Hero";
import { Layers, Wand2, Timer } from "lucide-react";
import Image from "next/image";

export default function Main() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      <main className="flex flex-col gap-8">
        <Hero />

        <section className="relative px-6 -mt-20 md:-mt-32 z-20 pb-32">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 overflow-hidden aspect-video group">
              {/* Fake UI Header */}
              <div className="h-10 border-b border-white/5 bg-zinc-900 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
              </div>
              {/* Placeholder for Editor UI */}
              <div className="absolute inset-0 top-10 flex items-center justify-center bg-zinc-950/80">
                <Image
                  src="/videoEditorH.png"
                  alt="Editor Preview"
                  width={1000}
                  height={1000}
                  className="w-full h-full"
                />
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/20 transition-colors rounded-xl pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 3. Features (Bento Grid) */}
        <section className="py-24 px-6 border-t border-white/5 bg-zinc-950">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Experience professional-level editing features without complex installations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 auto-rows-[300px]">
              <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Multi-track Timeline</h3>
                  <p className="text-zinc-400">Video, audio, text can be freely arranged and layered.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Intuitive UI</h3>
                  <p className="text-zinc-400">Modern user interface based on dark theme</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <Timer className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Preview</h3>
                  <p className="text-zinc-400">View editing changes in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
          <p>© 2025 VideoEditorH. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
