import cpeak, { parseJSON } from "cpeak";
import { handleItems } from "../lib/payload.js";

const PORT = Number(process.env.PORT) || 3000;
const server = cpeak();

server.beforeEach(parseJSON());

server.route("get", "/simple", (req, res) => {
  return res.json({ message: "hi" });
});

server.route("patch", "/api/items/:id", (req, res) => {
  const { status, data } = handleItems({
    id: req.params.id,
    filter: req.query.filter,
    body: req.body,
  });
  return res.status(status).json(data);
});

server.handleErr((error, req, res) => {
  if (error && error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: "Something went wrong." });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[cpeak] pid ${process.pid} listening on ${PORT}`);
});