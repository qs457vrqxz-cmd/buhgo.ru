export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="bg-primary h-10" />
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="hidden lg:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-16 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-12 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-6 w-full bg-muted animate-pulse rounded" />
              <div className="h-6 w-4/5 bg-muted animate-pulse rounded" />
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-muted animate-pulse rounded" />
                <div className="h-12 w-40 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-80 w-full bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-48 bg-muted animate-pulse rounded mx-auto mb-4" />
            <div className="h-5 w-96 bg-muted animate-pulse rounded mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border">
                <div className="h-14 w-14 bg-muted animate-pulse rounded-xl mb-4" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-full bg-muted animate-pulse rounded mb-4" />
                <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
