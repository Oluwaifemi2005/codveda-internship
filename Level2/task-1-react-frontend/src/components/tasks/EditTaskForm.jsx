
import { useState } from "react";

function EditTaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        title: title.trim(),
        description: description.trim(),
        completed: task.completed,
      });
    } catch (error) {
      // Error is displayed by the parent.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        disabled={isSaving}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        disabled={isSaving}
      />

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
      >
        Cancel
      </button>
    </form>
  );
}

export default EditTaskForm;
