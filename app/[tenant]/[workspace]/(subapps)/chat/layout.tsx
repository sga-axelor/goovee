import React from "react";

export default async function Layout({
  params,
  children,
}: {
  params: {
    tenant: string;
    workspace: string;
  };
  children: React.ReactNode;
}) {
  //await login("r.paux@kp1.fr", "R.paux@kp1.fr");

  return <>{children}</>;
}
