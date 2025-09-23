import { engine } from "express-handlebars";

export default engine({
  layoutsDir: process.cwd() + "/src/views/layouts",
  defaultLayout: "main",
  partialsDir: process.cwd() + "/src/views/partials",
});
