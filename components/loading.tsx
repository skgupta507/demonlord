/* eslint-disable prettier/prettier */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 border-2 border-[hsl(350_100%_58%/0.2)] rounded-full" />
          <div className="absolute inset-0 border-2 border-t-[hsl(350_100%_58%)] rounded-full animate-spin" />
          <div className="absolute inset-2 border border-[hsl(185_100%_48%/0.3)] rounded-full" />
          <div className="absolute inset-2 border-t-[hsl(185_100%_48%)] border border-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
        </div>
        <span
          className="text-[0.6rem] tracking-[0.3em] text-muted-foreground animate-pulse uppercase"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          LOADING...
        </span>
      </div>
    </div>
  );
}
