/* eslint-disable prettier/prettier */
import TVBrowseClient from '@/components/containers/tv/browse-client';
import CarousalTV from '@/components/carousal/tv';

// Server component — can use async carousel safely
export default function TVPage() {
  return (
    <div className="space-y-0">
      <CarousalTV />
      <TVBrowseClient />
    </div>
  );
}
