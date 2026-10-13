// Makes a big list of fake items, so the response is about 30 KB like a real API.
export function makeItems() {
  const items = [];
  for (let i = 1; i <= 100; i++) {
    items.push({
      id: i,
      name: "item-" + i,
      description:
        "Dummy text to make the response bigger, like a real API response. Dummy text to make the response bigger, like a real API response. Dummy text to make the response bigger.",
      tags: ["alpha", "beta", "gamma", "delta"],
      price: i * 1.37,
      inStock: i % 2 === 0,
      createdAt: "2025-01-01T00:00:00.000Z",
    });
  }
  return items;
}
