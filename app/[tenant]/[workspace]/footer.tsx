"use client";

import { Box } from "@axelor/ui";

// ----- CORE IMPORTS ----- //
import { i18n } from "@/lib/i18n";

export default function Footer() {
  return (
    <Box p={2} textAlign="center">
      Copyright (c) {new Date().getFullYear()} Axelor.{" "}
      {i18n.get("All Rights Reserved")}.
    </Box>
  );
}
