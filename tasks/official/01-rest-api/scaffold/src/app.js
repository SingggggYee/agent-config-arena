import express from "express";

const app = express();
app.use(express.json());

// In-memory store
const users = new Map();
let nextId = 1;

// Seed data
users.set(1, { id: 1, name: "Alice", email: "alice@example.com", age: 30 });
users.set(2, { id: 2, name: "Bob", email: "bob@example.com", age: 25 });
nextId = 3;

app.get("/users", (req, res) => {
  res.json([...users.values()]);
});

app.get("/users/:id", (req, res) => {
  const user = users.get(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const exists = [...users.values()].some((u) => u.email === email);
  if (exists) return res.status(400).json({ error: "Email already exists" });
  const user = { id: nextId++, name, email, age: age || null };
  users.set(user.id, user);
  res.status(201).json(user);
});

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!users.has(id)) return res.status(404).json({ error: "User not found" });
  users.delete(id);
  res.status(204).send();
});

// Export for testing
export { app, users, nextId };
export default app;
