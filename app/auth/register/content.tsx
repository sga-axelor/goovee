"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, TextField, Divider } from "@axelor/ui";
import { BootstrapIcon } from "@axelor/ui/icons/bootstrap-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import { register } from "./actions";

export default function Content() {
  const [values, setValues] = useState({
    firstName: "",
    name: "",
    email: "",
    birthdate: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((show) => !show);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { password, confirmPassword } = values;

    setError("");

    if (password !== confirmPassword) {
      setError(i18n.get("Password and confirm password mismatch"));
      return;
    }

    setSubmitting(true);
    try {
      await register(values);
      router.push(
        `/auth/login?${searchQuery}&success=${encodeURIComponent(
          "Registered Successfully"
        )}`
      );
    } catch (err) {
      setError("Error registering, try again.");
    }
    setSubmitting(false);
  };

  return (
    <Box
      px={{ base: 5, md: 5 }}
      py={{ base: 4 }}
      style={{ width: 500 }}
      mx="auto"
    >
      <Box as="h2" mb={3}>
        <b>{i18n.get("Sign Up")}</b>
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
          label={i18n.get("First Name")}
          name="firstName"
          value={values.firstName}
          disabled={submitting}
          onChange={handleChange}
          placeholder="Enter first name"
        />
        <TextField
          label={i18n.get("Last Name")}
          name="name"
          value={values.name}
          disabled={submitting}
          onChange={handleChange}
          placeholder="Enter last name"
          required
        />
        <TextField
          label={i18n.get("Email")}
          name="email"
          value={values.email}
          disabled={submitting}
          onChange={handleChange}
          type="email"
          placeholder="Enter email"
          required
        />
        {false && (
          <>
            <TextField
              label={i18n.get("Phone")}
              name="phone"
              value={values.phone}
              disabled={submitting}
              onChange={handleChange}
              type="number"
              placeholder="Enter phone"
            />
            <TextField
              label={i18n.get("Birthdate")}
              name="birthdate"
              value={values.birthdate}
              disabled={submitting}
              onChange={handleChange}
              type="date"
              placeholder="Enter birthdate"
            />
          </>
        )}
        <TextField
          label={i18n.get("Password")}
          name="password"
          value={values.password}
          disabled={submitting}
          onChange={handleChange}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          icons={[
            {
              icon: showPassword ? "visibility_off" : "visibility",
              onClick: toggleShowPassword,
            },
          ]}
          required
        />
        <TextField
          label={i18n.get("Confirm Password")}
          name="confirmPassword"
          value={values.confirmPassword}
          disabled={submitting}
          onChange={handleChange}
          placeholder="Password"
          type={showConfirmPassword ? "text" : "password"}
          icons={[
            {
              icon: showConfirmPassword ? "visibility_off" : "visibility",
              onClick: toggleShowConfirmPassword,
            },
          ]}
          required
        />
        <Button type="submit" variant="primary" rounded="pill">
          {i18n.get("Sign Up")}
        </Button>
        <Box>
          <Box as="p" mb={0} d="inline-block" me={2}>
            {i18n.get("Already have an account")} ?
          </Box>
          <Link href={`/auth/login?${searchQuery}`}>
            <Box d="inline-block" color="secondary">
              {i18n.get("Sign In")}
            </Box>
          </Link>
        </Box>
        {error && <Box color="danger">{error}</Box>}
      </Box>
      <Box mt={3} alignItems="center" gap="1rem" d="none">
        <Box flexGrow={1}>
          <Divider />
        </Box>
        <Box as="h2" mb={0}>
          <b>{i18n.get("Or")}</b>
        </Box>
        <Box flexGrow={1}>
          <Divider />
        </Box>
      </Box>
      <Box mt={3} d="none">
        <Button outline variant="primary" rounded="pill" w={100}>
          <Box d="flex" alignItems="center" justifyContent="center" gap="1rem">
            <BootstrapIcon icon="google" />
            <Box>{i18n.get("Create an with Google")}</Box>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
