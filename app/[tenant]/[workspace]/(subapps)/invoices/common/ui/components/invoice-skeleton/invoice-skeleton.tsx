import {Container} from '@/ui/components/container';
import {Separator} from '@/ui/components/separator';
import {Skeleton} from '@/ui/components/skeleton';

export function InvoiceSkeleton() {
  return (
    <Container title="">
      <div className="grid grid-col-4 gap-4">
        <span className="col-span-4">
          <Skeleton className="h-8 w-44 bg-white rounded-full" />
        </span>
        <div className="flex flex-col gap-4 col-span-4 bg-white p-4">
          <Skeleton className="h-8 w-44  rounded-full" />
          <Separator />
          <Skeleton className="h-4 w-32  rounded-full" />
          <Skeleton className="h-4 w-32  rounded-full" />
        </div>
        <div className="col-span-3 flex flex-col gap-4 p-4 bg-white">
          <Skeleton className="h-8 w-44  rounded-full" />
          <Skeleton className="h-8 w-44  rounded-full" />
          <Skeleton className="h-96 w-full"></Skeleton>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 bg-white p-4 h-fit">
            <Skeleton className="h-6 w-44  rounded-full" />
            <Separator />
            <Skeleton className="h-4 w-32  rounded-full" />
            <Skeleton className="h-4 w-32  rounded-full" />
            <Skeleton className="h-4 w-32  rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </Container>
  );
}
