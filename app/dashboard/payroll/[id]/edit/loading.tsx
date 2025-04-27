import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditPayrollLoading() {
  return (
    <div className="container p-8">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/payroll" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Payroll</h1>
          <p className="text-sm text-gray-500">Update payroll information and employee details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Payroll Details</h2>

            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div>
                <Skeleton className="mb-2 h-5 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Skeleton className="mb-2 h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Skeleton className="mb-2 h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex items-end">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="mb-2 h-5 w-20" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">Employees</h2>
              <Skeleton className="h-9 w-32" />
            </div>

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div>
                      <Skeleton className="mb-2 h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="mb-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Skeleton className="mb-2 h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="mb-2 h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="text-right">
                      <Skeleton className="mb-1 h-4 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Payroll Summary</h2>

            <div className="space-y-4">
              <div>
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>

              <div>
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div>
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-36" />
              </div>

              <div>
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-48" />
              </div>

              <div className="pt-4">
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>

              <div className="border-t pt-4">
                <Skeleton className="mb-1 h-4 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-[#DCE1EC] p-6">
            <h2 className="mb-4 text-lg font-medium">Actions</h2>

            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
