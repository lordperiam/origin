// @ts-ignore - Bypassing PageProps constraint issue with Next.js 15.3.1
export default function Page({ params }: any) {
  const id = params?.id;
  return <div>Simple test page for ID: {id}</div>;
}