import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container p-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>

      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  )
}
