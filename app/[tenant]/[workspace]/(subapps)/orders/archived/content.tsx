"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Box } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { Container, NavView, Pagination } from "@/ui/components";
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import {
  ORDERS_COLUMNS,
  ITEMS,
} from "@/subapps/orders/common/constants/orders";
import { OrdersTable, Card } from "@/subapps/orders/common/ui/components";

type ContentProps = {
  orders: [];
  pageInfo?: any;
};

const Content = ({ orders, pageInfo }: ContentProps) => {
  const { page, pages } = pageInfo || {};

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (e: any) => {
    router.push(`${e.href}`);
  };

  const handleClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  const updateSearchParams = (
    values: Array<{
      key: string;
      value?: string | number;
    }>
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    values.forEach(({ key, value = "" }: any) => {
      value = value && String(value)?.trim();
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const handlePreviousPage = () => {
    const { page, hasPrev } = pageInfo;
    if (!hasPrev) return;
    updateSearchParams([{ key: "page", value: Math.max(Number(page) - 1, 1) }]);
  };

  const handleNextPage = () => {
    const { page, hasNext } = pageInfo;
    if (!hasNext) return;
    updateSearchParams([{ key: "page", value: Number(page) + 1 }]);
  };

  const handlePage = (page: string | number) => {
    updateSearchParams([{ key: "page", value: page }]);
  };

  return (
    <>
      <Container title={i18n.get("Orders")}>
        <NavView items={ITEMS} activeTab="2" onTabChange={handleTabChange}>
          <Box d={{ base: "none", md: "block" }}>
            <OrdersTable
              columns={ORDERS_COLUMNS}
              orders={orders}
              handleRowClick={handleClick}
            />
          </Box>
          <Box d={{ base: "block", md: "none" }}>
            <Card orders={orders} handleRowClick={handleClick} />
          </Box>
          <Box
            mt={4}
            mb={3}
            d="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Pagination
              page={page}
              pages={pages}
              disablePrev={!pageInfo?.hasPrev}
              disableNext={!pageInfo?.hasNext}
              onPrev={handlePreviousPage}
              onNext={handleNextPage}
              onPage={handlePage}
            />
          </Box>
        </NavView>
      </Container>
    </>
  );
};

export default Content;
