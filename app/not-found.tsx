"use client";

import Link from "next/link";
import { Box, Button } from "@axelor/ui";

export default function NotFound() {
  return (
    <Box
      style={{ height: "100vh" }}
      d="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <h2>404 | Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">
          <Button variant="primary" rounded="pill">
            Return Home
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
