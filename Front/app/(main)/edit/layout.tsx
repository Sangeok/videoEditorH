import EditorFooter from "@/widgets/Edit/editor-footer/ui/EditorFooter";
import EditorHeader from "@/widgets/Edit/editor-header/ui/EditorHeader";
import EditorSideBar from "@/widgets/Edit/editor-mainSidebar/ui/EditorMainSideBar";
import EditorRightSidebar from "@/widgets/Edit/editor-rightSidebar/ui/EditorRightSidebar";
import EditorSubSideBar from "@/widgets/Edit/editor-subSidebar/ui/EditorSubSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <EditorHeader />

      <div className="flex h-2/3 w-full">
        {/* Sidebar */}
        <aside className="flex">
          <EditorSideBar />
          <EditorSubSideBar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/30">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Click to upload
            </h3>
            <p className="text-gray-400 text-sm">Or drag and drop files here</p>
          </div>
        </main>
        <aside>
          <EditorRightSidebar />
        </aside>
      </div>

      {/* Timeline Footer */}
      <EditorFooter />
      {/* <footer className="bg-black border-t border-white/20 p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-400">Delete</span>

            <button className="p-2 hover:bg-gray-800 rounded text-gray-400 ml-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-400">Split</span>

            <button className="p-2 hover:bg-gray-800 rounded text-gray-400 ml-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-400">Clone</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded bg-gray-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono">00:00</span>
              <span className="text-gray-400">/</span>
              <span className="font-mono text-gray-400">00:01</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-800 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>
              <input
                type="range"
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                defaultValue="50"
              />
              <button className="p-2 hover:bg-gray-800 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center text-xs text-gray-400 mb-2">
            <div className="w-1 h-4 bg-white absolute left-0 top-0"></div>
            <span className="ml-4">5s</span>
            <span className="ml-16">10s</span>
            <span className="ml-16">15s</span>
            <span className="ml-16">20s</span>
          </div>
          <div className="h-16 bg-gray-800 rounded border border-gray-700"></div>
        </div>
      </footer> */}
    </div>
  );
}
