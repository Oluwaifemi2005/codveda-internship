
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onDeleteTask,
  onUpdateTask,
  onToggleTask,
}) {
  return (
    <section className="task-list">
      <h2>Your Tasks ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No tasks available. Create your first task!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            onToggleTask={onToggleTask}
          />
        ))
      )}
    </section>
  );
}

export default TaskList;
