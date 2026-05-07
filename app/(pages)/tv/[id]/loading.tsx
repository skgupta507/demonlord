/* eslint-disable prettier/prettier */
export default function Loading() {
  return (
    <div className="space-y-0">
      <div className="h-[35dvh] md:h-[55dvh] w-full bg-[hsl(var(--muted))] animate-pulse" />
      <div className="mx-auto max-w-5xl px-6 -mt-32 space-y-4 pb-10">
        <div className="flex gap-6">
          <div className="w-36 md:w-48 aspect-[2/3] bg-[hsl(var(--muted))] animate-pulse" />
          <div className="flex-1 pt-24 space-y-3">
            <div className="h-3 w-32 bg-[hsl(var(--muted))] animate-pulse" />
            <div className="h-8 w-64 bg-[hsl(var(--muted))] animate-pulse" />
            <div className="h-3 w-full max-w-lg bg-[hsl(var(--muted))] animate-pulse" />
            <div className="h-3 w-full max-w-md bg-[hsl(var(--muted))] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
