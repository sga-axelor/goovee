"use client";
import { Box } from "@axelor/ui";

interface Props {
  children?: React.ReactNode;
  title: string;
}
export function Container(props: Props) {
  return (
    <Box
      d="flex"
      flexDirection="column"
      gap="1.5rem"
      px={{ base: 3, md: 5 }}
      py={{ base: 2, md: 3 }}
    >
      <Box as="h2">
        <b>{props.title}</b>
      </Box>
      {props.children}
    </Box>
  );
}

export default Container;
