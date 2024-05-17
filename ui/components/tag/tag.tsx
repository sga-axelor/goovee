import React from "react";
import { Badge } from "@axelor/ui";

type variant =
  | "success"
  | "error"
  | "warning"
  | "primary"
  | "secondary"
  | "default";
type TagProps = {
  children: React.ReactNode;
  variant: variant;
};

export const Tag = ({ children, variant = "default", ...props }: TagProps) => {
  const type = {
    success: {
      backgroundColor: "#D0EED8",
      color: "#4FC179",
    },
    error: {
      backgroundColor: "#FBC6C4",
      color: "#F14E46",
    },
    warning: {
      backgroundColor: "#FFE6BF",
      color: "#FFA114",
    },
    primary: {
      backgroundColor: "#D0E3FF",
      color: "#2D60C4",
    },
    secondary: {
      backgroundColor: "#F6F1FF",
      color: "#5603AD",
    },
    default: {
      backgroundColor: "#adb5bd",
      color: "#495057",
    },
  };
  return (
    <>
      <Badge
        {...props}
        rounded={"pill"}
        px={3}
        py={2}
        style={{ ...type[variant] }}
      >
        {children}
      </Badge>
    </>
  );
};

export default Tag;
