import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="bg-primary h-10" />
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="hidden lg:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Login form skeleton */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-xl border p-6">
          <div className="text-center mb-6">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="mt-6 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
