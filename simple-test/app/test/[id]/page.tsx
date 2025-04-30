export default async function DynamicTestPage({ params }: { params: { id: string } }) {
  return <div>Dynamic test page for ID: {params.id}</div>;
}