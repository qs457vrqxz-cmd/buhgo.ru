import { Skeleton } from "@/components/ui/skeleton";

export default function ContactsLoading() {
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

      {/* Hero skeleton */}
      <div className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Contact Info + Form skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-6 w-48 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-xl border">
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-5 w-64 mb-6" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
