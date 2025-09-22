import { engine } from "express-handlebars";

export const hbsEngine = engine({
  defaultLayout: "main",
  helpers: {
    eq: (a, b) => a === b,
    year: () => new Date().getFullYear(),
    multiply: (a, b) => (Number(a) || 0) * (Number(b) || 0),
    uppercase: (str) => String(str).toUpperCase(),
    money: (n) =>
      new Intl.NumberFormat("es-PA", { style: "currency", currency: "USD" }).format(n ?? 0),
  },
});
