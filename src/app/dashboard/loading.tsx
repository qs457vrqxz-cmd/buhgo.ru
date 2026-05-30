import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Skeleton className="h-10 w-96 mb-6" />

        {/* Content */}
        <div className="bg-white rounded-xl border p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
