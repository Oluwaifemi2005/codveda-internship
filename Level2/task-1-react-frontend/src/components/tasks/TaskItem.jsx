
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

function TaskItem({
  task,
  onDeleteTask,
  onUpdateTask,
  onToggleTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleSave = async (taskData) => {
    await onUpdateTask(task.id, taskData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="task-item">
        <EditTaskForm
          task={task}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    );
  }


  const handleDelete = async () => {
  try {
    setIsDeleting(true);
    await onDeleteTask(task.id);
  } catch (error) {
    // Error is displayed by the parent.
  } finally {
    setIsDeleting(false);
  }
};

const handleToggle = async () => {
  try {
    setIsToggling(true);
    await onToggleTask(task);
  } catch (error) {
    // Error is displayed by the parent.
  } finally {
    setIsToggling(false);
  }
};

  return (
    <article className="task-item">
      <div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>

      <span>
        {task.completed ? "Completed" : "Pending"}
      </span>

      <div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling || isDeleting || isEditing}
        >
          {isToggling
            ? "Updating..."
            : task.completed
              ? "Mark Pending"
              : "Complete"}
        </button>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isDeleting || isToggling}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
