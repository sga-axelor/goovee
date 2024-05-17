"use client";

import React from "react";
import { Box, Button, Divider } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import styles from "./styles.module.scss";

export const History = () => {
  return (
    <>
      <Box
        d="flex"
        flexDirection="column"
        gap="1rem"
        bg="white"
        p={4}
        rounded={3}
      >
        <Box as="h2">{i18n.get("History")}</Box>
        <Divider />
        <Box>
          <Box>
            <Box
              d="flex"
              justifyContent="space-between"
              p={3}
              borderStart
              borderColor="black"
            >
              <Box fontWeight="bold">{i18n.get("History action")}</Box>
              <Box className={styles["history-date"]}>23/11/2023</Box>
            </Box>
            <Box>
              <Button
                variant="dark"
                outline
                d="flex"
                alignItems="center"
                justifyContent="center"
                mx={4}
                gap="10"
                rounded="pill"
                fontWeight="normal"
              >
                <MaterialIcon icon="download" />
                {i18n.get("Open/download file")}
              </Button>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Box>
            <Box
              d="flex"
              justifyContent="space-between"
              p={3}
              borderStart
              borderColor="black"
            >
              <Box fontWeight="bold">{i18n.get("History action")}</Box>
              <Box className={styles["history-date"]}>23/11/2023</Box>
            </Box>
            <Box>
              <Button
                variant="dark"
                d="flex"
                alignItems="center"
                justifyContent="center"
                mx={4}
                gap="10"
                rounded="pill"
                fontWeight="normal"
              >
                {i18n.get("Give a response")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default History;
