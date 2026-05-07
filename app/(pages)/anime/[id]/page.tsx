/* eslint-disable prettier/prettier */
import { anilist } from '@/lib/anilist';
import DetailsContainer from '@/components/containers/anime/details';
import { notFound } from 'next/navigation';

export default async function AnimeInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await anilist.getById(Number(id));
    if (!data) return notFound();
    return <DetailsContainer data={data} />;
  } catch {
    return notFound();
  }
}
