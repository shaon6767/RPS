import Fastify from "fastify";
import { makeItems } from "../makeItems.js";

const app = Fastify();

// Simple route: returns a tiny JSON
app.get("/simple", (request, reply) => {
  reply.send({ message: "hi" });
});

// Heavy route: returns a big JSON (about 32 KB)
app.patch("/items/:id", (request, reply) => {
  const id = Number(request.params.id);
  if (isNaN(id)) {
    return reply.code(400).send({ error: "id must be a number" });
  }
  reply.send({ id: id, filter: request.query.filter, items: makeItems() });
});

app.listen({ port: 3002, host: "127.0.0.1" }, (err) => {
  if (err) throw err; // for example: the port is already in use
  console.log("fastify is running on port 3002");
});