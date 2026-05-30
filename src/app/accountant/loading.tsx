import { Skeleton } from "@/components/ui/skeleton";

export default function AccountantLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="bg-primary h-10" />
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
