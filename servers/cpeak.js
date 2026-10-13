import cpeak from "cpeak";
import { makeItems } from "../makeItems.js";

const server = cpeak();

// Simple route: returns a tiny JSON
server.route("get", "/simple", (req, res) => {
  return res.json({ message: "hi" });
});

// Heavy route: returns a big JSON (about 32 KB)
server.route("patch", "/items/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }
  return res.json({ id: id, filter: req.query.filter, items: makeItems() });
});

server.listen(3000, "127.0.0.1", () => {
  console.log("cpeak is running on port 3000");
});