import { CardsCarousel } from "@/components/carousel/carousel";

export default function Page({ params }: { params: { slug: string } }) {
  const carousel = CardsCarousel({ title: params.slug });
  return <>{carousel}</>;
}
