"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@ui/components/button";
import { Separator } from "@ui/components/separator";
// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import { TextField } from "@ui/components/TextField";
import { Toast } from "@/ui/components";
// ---- LOCAL IMPORTS ---- //
import { register } from "./actions";
import DatePicker from "@/ui/components/calender/calender";
interface UserValues {
  firstName: string;
  name: string;
  email: string;
  birthdate: any;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Content() {
  const [values, setValues] = useState<UserValues>({
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
    <div className="mx-auto p-4 sm:p-6 max-w-[1185px] w-full">
      <h5 className="mb-3 font-medium text-primary">{i18n.get("Sign Up")}</h5>
      <form
        className="bg-background rounded-lg py-4 px-6 sm:px-4 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}
      >
        <div>
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
              <label className="text-base font-medium text-primary mb-1">{i18n.get("Birthdate")}</label>
              <DatePicker value={values.birthdate}
                onChange={(date: Date) => {
                  setValues({
                    ...values,
                    "birthdate": date
                  });
                }}

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
          <Button type="submit" className="rounded-full w-full">
            {i18n.get("Sign Up")}
          </Button>
        </div>
        <div>
          <p className="text-primary inline-flex text-lg mr-2 mb-0">
            {i18n.get("Already have an account")} ?
          </p>
          <Link
            href={`/auth/login?${searchQuery}`}
            className="text-main_purple inline-flex text-decoration-underline text-lg"
          >
            {i18n.get("Log In")}
          </Link>
        </div>
        {/* {error && <div className="text-[#B2150D]">{error}</div>} */}
        {error && <Toast variant="error" show={true} heading={error} />}
      </form>
      <div className="flex items-center gap-4 mt-4">
        <div className="grow">
          <Separator />
        </div>
        <h5 className="mb-0 font-medium text-primary">{i18n.get("Or")}</h5>
        <div className="grow">
          <Separator />
        </div>
      </div>
      <div className="mt-4 hidden">
        <Button
          type="button"
          variant="outline"
          className="flex items-center justify-center gap-4 rounded-full w-full !border-primary !bg-background"
        >
          <FaGoogle className="text-xl" />
          <span className="text-primary font-medium">
            {i18n.get("Create an account with Google")}
          </span>
        </Button>
      </div>
    </div>
  );
}