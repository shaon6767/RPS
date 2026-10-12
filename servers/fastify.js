import Fastify from "fastify";
import { handleItems } from "../lib/payload.js";

const PORT = Number(process.env.PORT) || 3002;
const app = Fastify();

app.get("/simple", async () => ({ message: "hi" }));

app.patch("/api/items/:id", async (request, reply) => {
  const { status, data } = handleItems({
    id: request.params.id,
    filter: request.query.filter,
    body: request.body,
  });
  return reply.code(status).send(data);
});

await app.listen({ port: PORT, host: "127.0.0.1" });
console.log(`[fastify] pid ${process.pid} listening on ${PORT}`);