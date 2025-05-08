import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      {/* Header skeleton */}
      <header className="border-b border-gray-200 bg-white p-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col p-4">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>

        {/* Payment card skeleton */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Merchant info */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <Skeleton className="h-10 w-full" />
          </div>

          {/* Total amount */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </main>
    </div>
  )
}
