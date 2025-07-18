import EditorFooter from "@/src/widgets/Edit/ui/editor-footer/ui/EditorFooter";
import EditorHeader from "@/src/widgets/Edit/ui/editor-header/ui/EditorHeader";
import EditorSideBar from "@/src/features/Edit/ui/editor-mainSidebar/ui/EditorMainSideBar";
import EditorRightSidebar from "@/src/features/Edit/ui/editor-rightSidebar/ui/EditorRightSidebar";
import EditorSubSideBar from "@/src/features/Edit/ui/editor-subSidebar/ui/EditorSubSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="h-15 shrink-0">
        <EditorHeader />
      </div>

      <div className="flex flex-1 min-h-0 w-full">
        {/* Sidebar */}
        <aside className="flex">
          <EditorSideBar />
          <EditorSubSideBar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex justify-center items-center min-w-0">
          {children}
        </main>

        <aside className="shrink-0">
          <EditorRightSidebar />
        </aside>
      </div>

      <div className="h-65 shrink-0">
        <EditorFooter />
      </div>
    </div>
  );
}
