import React, { Fragment } from "react";
import { Box } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

export type BreadcrumbsProps = {
  breadcrumbs: [];
  onClick: (option: any) => void;
};

export const Breadcrumbs = ({ breadcrumbs, onClick }: BreadcrumbsProps) => {
  return (
    <>
      <Box mb={4}>
        {breadcrumbs?.length > 1 ? (
          <Box d="flex" gap="1rem" alignItems="center">
            {breadcrumbs.map((crumb: any, i: number) => {
              const islast = breadcrumbs.length - 1 === i;
              return (
                <Fragment key={i}>
                  <Box
                    d="flex"
                    alignItems="center"
                    {...(islast ? {} : { className: "pointer" })}
                  >
                    <Box
                      {...(islast
                        ? {
                            color: "primary",
                            fontWeight: "bold",
                          }
                        : {
                            color: "secondary",
                            onClick: () => onClick(crumb),
                          })}
                    >
                      {crumb.name}
                    </Box>
                    {!islast && (
                      <Box d="flex">
                        <MaterialIcon icon="chevron_right" />
                      </Box>
                    )}
                  </Box>
                </Fragment>
              );
            })}
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Breadcrumbs;
