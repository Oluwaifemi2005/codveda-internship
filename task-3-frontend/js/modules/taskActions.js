
import API from "../api/taskApi.js";

export const handleTaskActions = (onTasksChanged) => {
  const taskList = document.getElementById("task-list");

  const editFormSection = document.getElementById("edit-form-section");
  const editForm = document.getElementById("edit-task-form");
  const editTitle = document.getElementById("edit-title");
  const editDescription = document.getElementById("edit-description");
  const cancelEditButton = document.getElementById("cancel-edit");

  let currentTaskId = null;
  let currentTaskCompleted = false;

  // Handle Edit and Delete buttons
  taskList.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest(".delete-button");
    const editButton = event.target.closest(".edit-button");
    const toggleButton = event.target.closest(".toggle-button");

    
    // Toggle task status
    if (toggleButton) {
      const taskId = toggleButton.dataset.id;

      try {
        const response = await API.get(`/${taskId}`);
        const task = response.data.data;

        const updatedTask = {
          title: task.title,
          description: task.description,
          completed: !task.completed
        };

        const updateResponse = await API.put(`/${taskId}`, updatedTask);

        alert(updateResponse.data.message);

        onTasksChanged();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update task status.");
      }

      return;
    }


    // Edit task
    if (editButton) {
      currentTaskId = editButton.dataset.id;

      try {
        const response = await API.get(`/${currentTaskId}`);
        const task = response.data.data;

        currentTaskCompleted = task.completed;

        editTitle.value = task.title;
        editDescription.value = task.description;

        editFormSection.hidden = false;

        editFormSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load task.");
      }

      return;
    }

    // Delete task
    if (deleteButton) {
      const taskId = deleteButton.dataset.id;

      const confirmed = confirm("Are you sure you want to delete this task?");

      if (!confirmed) return;

      try {
        const response = await API.delete(`/${taskId}`);

        alert(response.data.message);

        onTasksChanged();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete task.");
      }
    }
  });

  // Save edited task
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedTask = {
      title: editTitle.value.trim(),
      description: editDescription.value.trim(),
      completed: currentTaskCompleted
    };

    if (!updatedTask.title || !updatedTask.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await API.put(`/${currentTaskId}`, updatedTask);

      alert(response.data.message);

      editForm.reset();
      editFormSection.hidden = true;
      currentTaskId = null;

      onTasksChanged();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update task.");
    }
  });

  // Cancel editing
  cancelEditButton.addEventListener("click", () => {
    editForm.reset();
    editFormSection.hidden = true;
    currentTaskId = null;
  });
};
