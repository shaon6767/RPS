import express from "express";
import { makeItems } from "../makeItems.js";

const app = express();

// Simple route: returns a tiny JSON
app.get("/simple", (req, res) => {
  res.json({ message: "hi" });
});

// Heavy route: returns a big JSON (about 32 KB)
app.patch("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }
  res.json({ id: id, filter: req.query.filter, items: makeItems() });
});

app.listen(3001, "127.0.0.1", (err) => {
  if (err) throw err; // for example: the port is already in use
  console.log("express is running on port 3001");
});