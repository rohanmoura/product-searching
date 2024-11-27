import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-48 w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-4 w-1/3" />
      </CardFooter>
    </Card>
  )
}

