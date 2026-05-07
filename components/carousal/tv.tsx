/* eslint-disable prettier/prettier */
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { tmdb } from '@/lib/tmdb';
import CarousalCard from '@/components/carousal/card';

export default async function CarousalTV() {
  let items: any[] = [];
  try {
    const data = await tmdb.tv.popular('en-US');
    items = data?.results || [];
  } catch {
    return null;
  }
  if (!items.length) return null;
  return (
    <Carousel className="mb-10">
      <CarouselContent className="mx-auto flex w-full">
        {items.slice(0, 8).map((item: any) => (
          <CarouselItem key={item.id} className="basis-full">
            <CarousalCard show={item} type="tv" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
