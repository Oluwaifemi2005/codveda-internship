
import API from "./api/taskApi.js";
import { renderTasks } from "./modules/taskRenderer.js";
import { handleTaskForm } from "./modules/taskForm.js";
import { handleTaskActions } from "./modules/taskActions.js";

const loadTasks = async () => {
  try {
    const response = await API.get("/");

    renderTasks(response.data.data);
  } catch (error) {
    console.error("Failed to retrieve tasks:", error.message);
  }
};

handleTaskForm(loadTasks);
handleTaskActions(loadTasks);

loadTasks();

loadTasks();
