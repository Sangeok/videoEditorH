import EditorFooter from "@/Features/Edit/ui/editor-footer/ui/EditorFooter";
import EditorHeader from "@/Features/Edit/ui/editor-header/ui/EditorHeader";
import EditorSideBar from "@/Features/Edit/ui/editor-mainSidebar/ui/EditorMainSideBar";
import EditorRightSidebar from "@/Features/Edit/ui/editor-rightSidebar/ui/EditorRightSidebar";
import EditorSubSideBar from "@/Features/Edit/ui/editor-subSidebar/ui/EditorSubSideBar";

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
    </div>
  );
}
