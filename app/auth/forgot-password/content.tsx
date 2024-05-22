"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TextField } from "@axelor/ui";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import { Toast } from "@/ui/components";
export default function Content() {
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto p-6 md:p-4 w-[1185px]"
    >
      <h5 className="mb-3 font-medium text-primary">
        {i18n.get("Forgot Password")} ?
      </h5>
      <form
        className="bg-background rounded-lg py-4 px-6 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}
      >
        <TextField
          label={i18n.get("Email")}
          type="email"
          name="email"
          placeholder="Enter email"
        />
        <Button type="submit"
          className="rounded-full">
          {i18n.get("Submit")}
        </Button>
        <div className="flex items-center">
        <Label className="mr-2 mb-0 text-primary inline-flex">{i18n.get("Remember password")} ?</Label>
          <Link href={`/auth/login?${searchQuery}`} className="text-main_purple flex text-decoration-underline">
            {i18n.get("Log In")}
          </Link>
        </div>
        <Toast variant="error" show={true} heading={i18n.get("Your email has not been recognised.")} description={i18n.get("The description line of a sticky alert. Helpful component that is designed to be placed near to alert context.")} />
        <Toast variant="success" show={true} heading={i18n.get("A link has been sent in your mailbox successfully.")} description={i18n.get("Sometimesit can take up to 5 minutes to receive the email. If you don’t receive anything please try again.")} />
      </form>
    </div>
  );
}
