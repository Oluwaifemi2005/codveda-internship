
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

export const renderTasks = (tasks) => {
  taskList.innerHTML = "";

  taskCount.textContent = `${tasks.length} Tasks`;

  if (tasks.length === 0) {
    emptyMessage.textContent = "No tasks available. Create your first task!";
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description;

    const status = document.createElement("span");
    status.textContent = task.completed ? "Completed" : "Pending";
    status.className = task.completed ? "completed" : "pending";

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.dataset.id = task.id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = task.id;

    const toggleButton = document.createElement("button");

    toggleButton.textContent = task.completed
    ? "Mark as Pending"
    : "Mark as Completed";

    toggleButton.className = "toggle-button";
    toggleButton.dataset.id = task.id;

    actions.append(toggleButton, editButton, deleteButton);

    taskCard.append(title, description, status, actions);

    taskList.appendChild(taskCard);
  });
};
