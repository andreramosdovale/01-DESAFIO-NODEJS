import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              id: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "title and description is required" })
          );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "title and description is required" })
          );
      }

      const [selectedTask] = database.select("tasks", { id: id });

      if (!selectedTask) {
        return res.writeHead(404).end();
      }

      const task = database.update("tasks", id, {
        title,
        description,
        completed_at: selectedTask.completed_at,
        created_at: selectedTask.created_at,
        updated_at: Date.now(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!selectedTask) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const [selectedTask] = database.select("tasks", { id: id });

      if (!selectedTask) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, {
        title: selectedTask.title,
        description: selectedTask.description,
        created_at: selectedTask.created_at,
        completed_at: Date.now(),
        updated_at: Date.now(),
      });

      return res.writeHead(204).end();
    },
  },
];
