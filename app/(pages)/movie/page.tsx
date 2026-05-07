/* eslint-disable prettier/prettier */
import MovieBrowseClient from '@/components/containers/movie/browse-client';
import CarousalMovie from '@/components/carousal/movie';

// Server component — can use async carousel safely
export default function MoviesPage() {
  return (
    <div className="space-y-0">
      <CarousalMovie />
      <MovieBrowseClient />
    </div>
  );
}
