import { notFound } from "next/navigation";

export default async function ViewPaste({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();
  const data = await res.json();

  return (
    <main className="p-8">
      <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
        {data.content}
      </pre>
    </main>
  );
}
