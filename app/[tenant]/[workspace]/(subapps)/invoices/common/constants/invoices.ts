// ---- CORE IMPORTS ---- //
import { i18n } from "@/lib/i18n";

const HEADING = i18n.get(
  "You have unpaid invoices arriving soon to their limit date."
);

const ITEMS = [
  {
    id: "1",
    title: i18n.get("Unpaid invoices"),
    href: "unpaid",
  },
  {
    id: "2",
    title: i18n.get("Archived invoices"),
    href: "archived",
  },
];

const UNPAID_INVOICE_COLUMNS = [
  { key: "invoiceId", label: i18n.get("Invoice number") },
  { key: "amountRemaining", label: i18n.get("Status") },
  { key: "dueDate", label: i18n.get("Due date") },
  { key: "exTaxTotal", label: i18n.get("Total WT") },
  { key: "inTaxTotal", label: i18n.get("Total ATI") },
  { key: "", label: "" },
];

const ARCHIVED_INVOICE_COLUMNS = [
  { key: "invoiceId", label: i18n.get("Invoice number") },
  { key: "amountRemaining", label: i18n.get("Status") },
  { key: "dueDate", label: i18n.get("Paid on") },
  { key: "exTaxTotal", label: i18n.get("Total WT") },
  { key: "inTaxTotal", label: i18n.get("Total ATI") },
];

const INVOICE_COLUMNS = [
  i18n.get("Description"),
  i18n.get("Rate"),
  i18n.get("Qty"),
  i18n.get("Amount"),
];
const INVOICE_TYPE = {
  UNPAID: i18n.get("Unpaid"),
  PAID: i18n.get("Paid"),
};

const INVOICE_STATUS = {
  VENTILATED: 3,
  UNPAID: 0,
};

export {
  HEADING,
  ITEMS,
  UNPAID_INVOICE_COLUMNS,
  ARCHIVED_INVOICE_COLUMNS,
  INVOICE_COLUMNS,
  INVOICE_TYPE,
  INVOICE_STATUS,
};
