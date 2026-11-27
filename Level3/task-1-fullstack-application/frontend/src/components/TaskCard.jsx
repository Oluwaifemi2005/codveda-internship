import { Check, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description || 'No description provided.'}</p>

        <span className={`task-status ${task.completed ? 'done' : 'pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="task-actions">
        <button
          title="Toggle completion"
          onClick={() => onToggle(task)}
        >
          <Check size={17} />
        </button>

        <button title="Edit task" onClick={() => onEdit(task)}>
          <Pencil size={17} />
        </button>

        <button title="Delete task" onClick={() => onDelete(task._id)}>
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;