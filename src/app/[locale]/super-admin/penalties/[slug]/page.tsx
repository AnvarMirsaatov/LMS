
import PenaltiesClient from "../PenaltiesClient";

interface Props {
  params: {
    slug: string;
  };
}

export default function Page({ params }: Props) {
  return <PenaltiesClient slug={params.slug} />;
}
