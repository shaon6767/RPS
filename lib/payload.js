// Shared logic: every framework runs EXACTLY this code, so the benchmark is fair.

export function buildItems(count = 100) {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      name: `item-${i}`,
      description:
        "This is dummy text used to make the response bigger, like a real API response. ".repeat(2),
      tags: ["alpha", "beta", "gamma", "delta"],
      price: Number((i * 1.37).toFixed(2)),
      inStock: i % 2 === 0,
      createdAt: new Date(1700000000000 + i * 86400000).toISOString(),
    });
  }
  return items;
}

// Returns { status, data } so each framework only has to send it.
export function handleItems({ id, filter, body }) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return { status: 400, data: { error: "id must be a number" } };
  }
  return {
    status: 200,
    data: {
      id: numericId,
      filter: filter ?? null,
      received: body ?? null,
      items: buildItems(100),
    },
  };
}