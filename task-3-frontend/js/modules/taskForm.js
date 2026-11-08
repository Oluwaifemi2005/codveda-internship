
import API from "../api/taskApi.js";

export const handleTaskForm = (onTaskCreated) => {
  const taskForm = document.getElementById("task-form");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskData = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim()
    };

    if (!taskData.title || !taskData.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await API.post("/", taskData);

      alert(response.data.message);

      taskForm.reset();

      onTaskCreated();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create task. Please try again."
      );
    }
  });
};
