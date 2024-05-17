"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Box } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";
import { useWorkspace } from "@/app/[tenant]/[workspace]/workspace-context";
import { SUBAPP_PAGE } from "@/constants";

export default function Content({ subapps }: { subapps: any }) {
  const { workspaceURI } = useWorkspace();
  const { data: session } = useSession();

  return (
    <>
      <Box as="h2" mb={3}>
        <b>
          {i18n.get("My Account")} {session ? `- ${session?.user?.name}` : ""}{" "}
          {session?.user && (
            <Box as="span" fontWeight="normal" color="secondary" fontSize={5}>
              ({session?.user?.email})
            </Box>
          )}
        </b>
      </Box>
      <Box d="flex" flexDirection="column" gap="1rem">
        {subapps
          .filter((app: any) => app.installed && app.showInMySpace)
          .sort(
            (app1: any, app2: any) =>
              app1.orderForMySpaceMenu - app2.orderForMySpaceMenu
          )
          .reverse()
          .map(({ code, name, icon, color, background }: any) => {
            const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || "";
            return (
              <Link key={code} href={`${workspaceURI}/${code}${page}`}>
                <Box p={3} rounded border bg="white">
                  <Box d="flex" alignItems="center" gap="0.5rem">
                    <Box
                      p={2}
                      d="flex"
                      rounded
                      style={{
                        background,
                        color,
                      }}
                    >
                      {icon && (
                        <MaterialIcon icon={icon as any} fontSize="1.5rem" />
                      )}
                    </Box>
                    <Box as="p" mb={0}>
                      <b>{i18n.get(name)}</b>
                    </Box>
                  </Box>
                </Box>
              </Link>
            );
          })}
      </Box>
    </>
  );
}
