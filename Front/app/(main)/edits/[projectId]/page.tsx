// import EditPage from "@/src/page/EditPage/ui/EditPage";

import EditPage from "@/src/page/editPage/ui/EditPage";

interface EditPageProps {
  params: Promise<{ projectId: string }>;
}

export default function Edits({ params }: EditPageProps) {
  return (
    <div>
      <EditPage params={params} />
    </div>
  );
}
