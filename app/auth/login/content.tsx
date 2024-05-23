"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Box, Input, Button, InputLabel, Divider } from "@axelor/ui";
import { BootstrapIcon } from "@axelor/ui/icons/bootstrap-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import { TextField } from "@/components/ui/TextField";

export default function Content({ canRegister }: { canRegister?: boolean }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const toggleShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const callbackurl = searchParams.get("callbackurl");

  const redirection = callbackurl ? decodeURIComponent(callbackurl) : "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setError(false);

    const { email, password } = values;

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (login?.ok) {
      router.replace(redirection);
    } else {
      setError(true);
    }

    setSubmitting(false);
  };

  const loginWithGoogle = async () => {
    await signIn("google", {
      callbackUrl: redirection,
    });
  };

  return (
    <Box
      px={{ base: 5, md: 5 }}
      py={{ base: 4 }}
      style={{ width: 500 }}
      mx="auto"
    >
      <Box as="h2" mb={3}>
        <b>{i18n.get("Log in")}</b>
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
          placeholder={i18n.get("Enter email")}
          disabled={submitting}
          value={values.email}
          onChange={handleChange}
        />
        <TextField
          label={i18n.get("Password")}
          placeholder={i18n.get("Password")}
          name="password"
          type={showPassword ? "text" : "password"}
          icons={[
            {
              icon: showPassword ? "visibility_off" : "visibility",
              onClick: toggleShowPassword,
            },
          ]}
          disabled={submitting}
          value={values.password}
          onChange={handleChange}
        />
        <Box d="flex" alignItems="center">
          <Input type="checkbox" me={2} disabled={submitting} />
          <InputLabel mb={0}>{i18n.get("Remember Me")}</InputLabel>
          <Box flexGrow={1} />
          <Link
            href={`/auth/forgot-password?${searchQuery}`}
            aria-disabled={submitting}
          >
            <Box color="secondary" d="inline-block">
              {i18n.get("Forgot Password ?")}
            </Box>
          </Link>
        </Box>
        <Button
          type="submit"
          variant="primary"
          rounded="pill"
          disabled={submitting}
        >
          {i18n.get("Log In")}
        </Button>
        {canRegister && (
          <Box>
            <Box as="p" mb={0} d="inline-block" me={2}>
              {i18n.get("Don't have an account yet ?")}
            </Box>
            <Link
              href={`/auth/register?${searchQuery}`}
              aria-disabled={submitting}
            >
              <Box d="inline-block" color="secondary">
                {i18n.get("Sign Up")}
              </Box>
            </Link>
          </Box>
        )}
        {error && (
          <Box color="danger">
            {i18n.get(
              "Invalid credentials. Try email from partners. For e.g info@apollo.fr"
            )}
          </Box>
        )}
        {searchParams.get("success") && (
          <Box color="success">{searchParams.get("success")}</Box>
        )}
      </Box>
      <Box d="flex" mt={3} alignItems="center" gap="1rem">
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
      <Box mt={3}>
        <Button
          type="button"
          outline
          variant="primary"
          rounded="pill"
          w={100}
          onClick={loginWithGoogle}
        >
          <Box d="flex" alignItems="center" justifyContent="center" gap="1rem">
            <BootstrapIcon icon="google" />
            <Box>{i18n.get("Log In with Google")}</Box>
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
