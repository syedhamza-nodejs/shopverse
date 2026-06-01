export const formatPKR = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const discountPct = (price, compareAt) =>
  compareAt && compareAt > price
    ? Math.round(((compareAt - price) / compareAt) * 100)
    : 0;
