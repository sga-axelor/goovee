"use client";

import React, { useState } from "react";
import { Box } from "@axelor/ui";
import { Alert } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

type Variant = "success" | "error" | "warning" | "primary";

type ToastProps = {
  show: boolean;
  variant: Variant;
  heading: string;
  description?: string;
};

type IconType = "check_circle" | "error" | "warning" | "info";

export const Toast = ({
  show,
  heading,
  description = "",
  variant = "error",
}: ToastProps) => {
  const [visible, setVisible] = useState<boolean>(show);

  const handleClose = () => {
    setVisible(false);
  };

  const alertType: Record<
    Variant,
    {
      styles: { backgroundColor: string; color: string; borderColor: string };
      icon: IconType;
    }
  > = {
    success: {
      styles: {
        backgroundColor: "#D0EED8",
        color: "#328D54",
        borderColor: "#4FC179",
      },
      icon: "check_circle",
    },
    error: {
      styles: {
        backgroundColor: "#FBC6C4",
        color: "#B2150D",
        borderColor: "#F14E46",
      },
      icon: "error",
    },
    warning: {
      styles: {
        backgroundColor: "#FFE6BF",
        color: "#BF7300",
        borderColor: "#FFA114",
      },
      icon: "warning",
    },
    primary: {
      styles: {
        backgroundColor: "#F6F1FF",
        color: "#340077",
        borderColor: "#5603AD",
      },
      icon: "info",
    },
  };
  if (!visible) {
    return null;
  }
  return (
    <Alert style={{ border: "1px solid", ...alertType[variant].styles }}>
      <Box d="flex" alignItems="flex-start" g={2}>
        <Box d="flex">
          <MaterialIcon icon={alertType[variant].icon} />
        </Box>
        <Box d="flex" flex={1} flexDirection={"column"}>
          <Box flex={1} style={{ fontWeight: 500 }}>
            {heading}
          </Box>
          <Box flex={1}>{description}</Box>
        </Box>
        <Box d="flex">
          <MaterialIcon
            className="pointer"
            icon="close"
            onClick={handleClose}
          />
        </Box>
      </Box>
    </Alert>
  );
};

export default Toast;
