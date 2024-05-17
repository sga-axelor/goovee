import { i18n } from "@/lib/i18n";

export const QUOTATIONS_COLUMNS = [
  { key: "saleOrderSeq", label: i18n.get("Quotation number") },
  { key: "statusSelect", label: i18n.get("Status") },
  { key: "createdOn", label: i18n.get("Created on") },
  { key: "action", label: "" },
];

export const HEADING = i18n.get("You have quotations awaiting for reponse.");

export const QUOTATION_STATUS = {
  DRAFT_QUOTATION: 1,
  FINALISED_QUOTATION: 2,
  CANCELED_QUOTATION: 5,
};

export const QUOTATION_TYPE = {
  DRAFT: i18n.get("Draft quotation"),
  FINALISED: i18n.get("Finalized quotation"),
  CANCELED: i18n.get("Cancelled"),
  UNKNOWN: i18n.get("Unknown"),
};

export const PRODUCT_COLUMNS = [
  { key: "productName", label: i18n.get("Product number") },
  { key: "qty", label: i18n.get("Quantity") },
  { key: "unit", label: i18n.get("Unit") },
  { key: "price", label: i18n.get("Unit Price Wt") },
  { key: "exTaxTotal", label: i18n.get("Totoal Wt") },
  { key: "tax", label: i18n.get("Tax") },
  { key: "discountAmount", label: i18n.get("Discount") },
  { key: "inTaxTotal", label: i18n.get("Total ATI") },
];
//
export const PRODUCT_CARD_COLUMNS = [
  { key: "productName", label: i18n.get("Product number") },
  { key: "qty", label: i18n.get("Quantity") },
  { key: "inTaxTotal", label: i18n.get("Total ATI") },
  { key: "dropdown", label: "" },
];

export const SECONDS = i18n.get("a few seconds");
export const MINUTES = i18n.get("minutes");
export const HOURS = i18n.get("hours");
export const DAYS = i18n.get("days");
