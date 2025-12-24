import PenaltiesClient from "../PenaltiesClient";

export default function Page({ params }: { params: { slug: string } }) {
  return <PenaltiesClient slug={params.slug} />;
}
