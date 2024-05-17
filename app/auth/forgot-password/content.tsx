"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Button, TextField } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

export default function Content() {
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box
      px={{ base: 5, md: 5 }}
      py={{ base: 4 }}
      style={{ width: 500 }}
      mx="auto"
    >
      <Box as="h2" mb={3}>
        <b>{i18n.get("Forgot Password")} ?</b>
      </Box>
      <Box
        as="form"
        bg="white"
        rounded={2}
        p={3}
        d="grid"
        gridTemplateColumns="1fr"
        gap="1rem"
        onSubmit={handleSubmit}
      >
        <TextField
          label={i18n.get("Email")}
          type="email"
          name="email"
          placeholder="Enter email"
        />
        <Button type="submit" variant="primary" rounded="pill">
          {i18n.get("Submit")}
        </Button>
        <Box>
          <Box as="p" mb={0} d="inline-block" me={2}>
            {i18n.get("Remember password")} ?
          </Box>
          <Link href={`/auth/login?${searchQuery}`}>
            <Box d="inline-block" color="secondary">
              {i18n.get("Sign In")}
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
