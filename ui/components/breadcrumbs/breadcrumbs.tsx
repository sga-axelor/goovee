import React from "react";
import { 
  Breadcrumb,   
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/components/breadcrumb";
import { ChevronRight } from "lucide-react";

export type BreadcrumbsProps = {
  breadcrumbs: { name: string; onClick?: () => void }[];
  onClick: (option: any) => void;
};

export const Breadcrumbs = ({ breadcrumbs, onClick }: BreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, i) => {
          const isLast = breadcrumbs.length - 1 === i;

          return (
            <React.Fragment key={i}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    onClick={() => onClick(crumb)}
                    className="text-secondary cursor-pointer"
                  >
                    <span>{crumb.name}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
