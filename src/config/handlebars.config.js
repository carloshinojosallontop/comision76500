import { engine } from "express-handlebars";

export default engine({
  layoutsDir: process.cwd() + "/src/views/layouts",
  defaultLayout: "main",
  partialsDir: process.cwd() + "/src/views/partials",
  helpers: {
    eq: (a, b) => a === b,
    currency: (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? "$" + n.toFixed(2) : "$0.00";
    },
  },
});
