import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      await onAddTask({
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
    } catch (error) {
      // Error is displayed by the parent.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Create a New Task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding Task..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;