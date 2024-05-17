"use client";

import React, { useState } from "react";
import { Box, Button, TextField } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

export default function Content() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((show) => !show);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box px={{ base: 3, md: 5 }} py={{ base: 2, md: 3 }}>
      <Box as="h2" mb={3}>
        <b>{i18n.get("Change password")}</b>
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
          label={i18n.get("New Password")}
          name="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          icons={[
            {
              icon: showPassword ? "visibility_off" : "visibility",
              onClick: toggleShowPassword,
            },
          ]}
        />
        <TextField
          label={i18n.get("Confirm Password")}
          name="confirmPassword"
          placeholder="Password"
          type={showConfirmPassword ? "text" : "password"}
          icons={[
            {
              icon: showConfirmPassword ? "visibility_off" : "visibility",
              onClick: toggleShowConfirmPassword,
            },
          ]}
        />
        <Button type="submit" variant="primary" rounded="pill">
          {i18n.get("Submit")}
        </Button>
      </Box>
    </Box>
  );
}
