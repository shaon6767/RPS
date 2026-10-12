import express from "express";
import { handleItems } from "../lib/payload.js";

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(express.json());

app.get("/simple", (req, res) => {
  res.json({ message: "hi" });
});

app.patch("/api/items/:id", (req, res) => {
  const { status, data } = handleItems({
    id: req.params.id,
    filter: req.query.filter,
    body: req.body,
  });
  res.status(status).json(data);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`[express] pid ${process.pid} listening on ${PORT}`);
});