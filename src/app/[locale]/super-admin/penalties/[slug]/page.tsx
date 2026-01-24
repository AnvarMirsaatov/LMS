import PenaltiesClient from "../PenaltiesClient";

// export default function Page({ params }: { params: { slug: string } }) {
type PageProps = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: PageProps) {
  const { slug } = params;
  return <PenaltiesClient slug={params.slug} />;
}
