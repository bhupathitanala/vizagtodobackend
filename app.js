// app.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import tasks from "./models/tasks.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (runs on every request — OK for serverless)
mongoose.connect('mongodb+srv://ratnabhupathitanala:Aditya123@cluster0.eahgacc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

// POST: Add Task
app.post('/api/addtask', async (req, res) => {
  const { task, status, deadline } = req.body;

  try {
    const newTask = new tasks({ task, status, deadline });
    await newTask.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save task", error: err });
  }
});

// GET: All Tasks
app.get('/api/getTask', async (req, res) => {
  try {
    const tas = await tasks.find();
    if (!tas.length) return res.status(404).json({ message: "No task Found." });
    res.status(200).json({ tas });
  } catch {
    res.status(500).json({ message: "Error fetching tasks." });
  }
});

// DELETE: Task by ID
app.delete('/api/deletetask/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const deleted = await tasks.findByIdAndDelete(_id);
    if (!deleted) return res.status(400).json({ message: "Unable to delete." });
    res.status(200).json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task." });
  }
});

// GET: Task data by ID
app.get('/api/get_task_data/:id', async (req, res) => {
  try {
    const task = await tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "No task Found." });
    res.status(200).json({ task_data: task });
  } catch {
    res.status(500).json({ message: "Error fetching task." });
  }
});

// PUT: Update task by ID
app.put('/api/edit_task/:id', async (req, res) => {
  const { task, status, deadline } = req.body;

  try {
    const updated = await tasks.findByIdAndUpdate(req.params.id, {
      task,
      status,
      deadline,
    }, { new: true });

    if (!updated) return res.status(400).json({ message: "Unable to update the task." });
    res.status(200).json({ tsk: updated });
  } catch {
    res.status(500).json({ message: "Error updating task." });
  }
});

export default app;
