import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Box, ClickAwayListener, List, ListItem, Popper } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";
import { usePathname } from "next/navigation";

export function Account({ baseURL = "" }: { baseURL?: string }) {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const pathname = usePathname();
  const encodedPathname = encodeURIComponent(pathname);

  const toggle = () => setOpen((o) => !o);
  const closePopper = () => setOpen(false);

  const { data: session } = useSession();

  const loggedin = !!session;

  const handleLogout = () => {
    closePopper();
    if (window.confirm("Do you want to logout ?")) {
      signOut({
        callbackUrl: `/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
          baseURL
        )}`,
      });
    }
  };

  return (
    <>
      <Box d="inline-block" {...({ ref: setTargetEl } as any)} onClick={toggle}>
        <MaterialIcon icon="account_circle" className="pointer" />
      </Box>
      <Popper open={open} target={targetEl} offset={[0, 4]}>
        <ClickAwayListener onClickAway={toggle}>
          <Box p={2} style={{ width: 320 }}>
            <List p={0}>
              {loggedin ? (
                <>
                  <Link href={`${baseURL || ""}/account`}>
                    <ListItem
                      border={false}
                      className="pointer"
                      onClick={closePopper}
                    >
                      My Account
                    </ListItem>
                  </Link>
                  <ListItem
                    d="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    border={false}
                    onClick={handleLogout}
                    className="pointer"
                  >
                    <Box>Logout</Box>
                    <MaterialIcon icon="logout" />
                  </ListItem>
                </>
              ) : (
                <>
                  <Link
                    href={`/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
                      baseURL
                    )}`}
                  >
                    <ListItem
                      border={false}
                      className="pointer"
                      onClick={closePopper}
                    >
                      Log In
                    </ListItem>
                  </Link>
                </>
              )}
            </List>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
}

export default Account;
