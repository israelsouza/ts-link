import express from "express";
import path from "path";
import shortRoute from "./routes/shortRoutes";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/short", shortRoute);

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server listen in port http://localhost:${PORT}`);
});
