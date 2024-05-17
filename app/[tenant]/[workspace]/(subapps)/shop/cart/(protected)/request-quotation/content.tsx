"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { useCart } from "@/app/[tenant]/[workspace]/cart-context";
import { useWorkspace } from "@/app/[tenant]/[workspace]/workspace-context";
import { i18n } from "@/lib/i18n";
import type { PortalWorkspace } from "@/types";

// ---- LOCAL IMPORTS ---- //
import { requestQuotation } from "@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart";

export default function Content({ workspace }: { workspace: PortalWorkspace }) {
  const { clearCart, cart } = useCart();
  const router = useRouter();
  const { workspaceURI } = useWorkspace();

  useEffect(() => {
    const request = async () => {
      const $cart = await requestQuotation({ cart, workspace });

      if (!$cart) {
        alert("Error creating quotation. Try again.");
        router.replace(`${workspaceURI}/shop/cart`);
      } else {
        clearCart();
      }
    };

    request();
  }, []);

  return (
    <Box p={5} shadow bg="white" rounded={2}>
      <Box as="h4" color="success">
        {i18n.get("Quotation Requested")}
      </Box>
      <Link href={`${workspaceURI}/shop`}>
        <Button mt={3} rounded="pill" variant="primary">
          {i18n.get("Continue Shopping")}
        </Button>
      </Link>
    </Box>
  );
}
