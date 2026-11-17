
import Header from "../components/layout/Header";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import useTasks from "../hooks/useTask";
function Home() {
  const { tasks, loading, error, addTask, deleteTask, updateTask, toggleTask, operationError,} = useTasks();

  return (
    <>
      <Header />

      <main className="container">
        <TaskForm onAddTask={addTask } />

        {loading && <p>Loading tasks...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <TaskList tasks={tasks} onDeleteTask={deleteTask} onUpdateTask={updateTask} onToggleTask={toggleTask} />
        )}
        {operationError && (
          <p className="error-message">{operationError}</p>
        )}
      </main>
    </>
  );
}

export default Home;
