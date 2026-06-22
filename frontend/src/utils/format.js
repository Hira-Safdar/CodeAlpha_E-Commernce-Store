export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
