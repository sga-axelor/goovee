import React from "react";
import { Box, Collapse, Image, TableCell, TableRow } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

// ---- LOCAL IMPORTS ---- //
import styles from "./styles.module.scss";

export const ProductCard = (props: any) => {
  const { product } = props;
  const [show, setShow] = React.useState(false);
  return (
    <>
      <TableRow key={product.id}>
        <TableCell py={3} px={4}>
          <Box as="div" d="flex">
            <Box d="flex" alignItems="center">
              <Image src="" alt="product" className={styles["product-image"]} />
            </Box>
            <Box d="flex" alignItems="center">
              {product.productName}
            </Box>
          </Box>
        </TableCell>
        <TableCell py={3} px={4}>
          {product.qty}
        </TableCell>
        <TableCell py={3} px={4}>
          {product.inTaxTotal}
        </TableCell>
        <TableCell>
          <MaterialIcon
            icon={show ? "arrow_drop_up" : "arrow_drop_down"}
            onClick={() => setShow(!show)}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} borderBottom={show}>
          <Collapse in={show}>
            <Box>
              <Box d="flex" justifyContent="space-between" px={3}>
                <Box fontWeight="bold">{i18n.get("Unit")}</Box>
                <Box>{product?.unit?.name}</Box>
              </Box>
              <Box d="flex" justifyContent="space-between" px={3}>
                <Box fontWeight="bold">{i18n.get("Unit power WT")}</Box>
                <Box>{product?.price}</Box>
              </Box>
              <Box d="flex" justifyContent="space-between" px={3}>
                <Box fontWeight="bold">{i18n.get("Total WT")}</Box>
                <Box>{product?.price}</Box>
              </Box>
              <Box d="flex" justifyContent="space-between" px={3}>
                <Box fontWeight="bold">{i18n.get("Tax")}</Box>
                <Box>{product?.taxLine?.value} %</Box>
              </Box>
              <Box d="flex" justifyContent="space-between" px={3}>
                <Box fontWeight="bold">{i18n.get("Discount")}</Box>
                <Box>{product?.discountAmount}%</Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
