import Edit from "@/src/page/Edit/ui/Edit";

interface EditPageProps {
  params: Promise<{ projectId: string }>;
}

export default function Edits({ params }: EditPageProps) {
  return (
    <div>
      <Edit params={params} />
    </div>
  );
}
