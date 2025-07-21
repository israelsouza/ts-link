import express from "express";
import path from "path";
import shortRoute from "./routes/shortRoutes";
import ShortURL from "./controller/shortController";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/short", shortRoute);
app.get("/:code", ShortURL.getLink);

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server listen in port http://localhost:${PORT}`);
});

export default app;