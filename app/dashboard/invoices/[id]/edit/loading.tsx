import { Skeleton } from "@/components/ui/skeleton"

export default function EditInvoiceLoading() {
  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-10 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-1">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-1">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
            <Skeleton className="mt-4 h-8 w-24" />
            <div className="mt-4 flex justify-end border-t pt-4">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="rounded-lg border bg-[#FAF7F2] p-6">
          <div className="mb-6 rounded-lg bg-white p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="mt-4 h-40 w-full" />
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="mt-6 flex justify-end space-x-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
