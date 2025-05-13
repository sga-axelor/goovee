import {Skeleton} from '../skeleton';

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

export function TableSkeleton({
  columnCount = 5,
  rowCount = 10,
}: TableSkeletonProps) {
  const columns = Array.from({length: columnCount});
  const rows = Array.from({length: rowCount});

  return (
    <div className="container p-4 mx-auto space-y-6 flex flex-col">
      <Skeleton className="h-8 w-44 bg-white rounded-full" />
      <div className="flex flex-col gap-4">
        <div className="border rounded-md bg-white overflow-hidden">
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-medium text-muted-foreground border-b">
                  {columns.map((header, idx) => (
                    <th key={idx} className="p-3">
                      <Skeleton className="h-6 w-32" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((_, rowIdx) => (
                  <tr key={rowIdx} className="border-b">
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="p-3">
                        <Skeleton className="h-6 w-28" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/** Pagination */}
        <div className="flex justify-center items-center mt-4">
          <div className="bg-white rounded-full flex items-center justify-center gap-2 px-4 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableSkeleton;
