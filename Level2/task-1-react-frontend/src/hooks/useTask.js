
import { useEffect, useState } from "react";
import API from "../services/taskApi";


const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || "Server error occurred.";
  }

  if (error.request) {
    return "Unable to connect to the server. Please try again.";
  }

  return error.message || "Something went wrong.";
};


function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [operationError, setOperationError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchTasks = async () => {
      try {
        const response = await API.get("/", {
          signal: controller.signal,
        });

        setTasks(response.data.data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error.response?.data?.message ||
            "Failed to load tasks."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      controller.abort();
    };
  }, []);


const addTask = async (taskData) => {
  try {
    setOperationError("");

    const response = await API.post("/", taskData);
    const newTask = response.data.data;

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);

    return newTask;
  } catch (error) {
    const message = getErrorMessage(error);
    setOperationError(message);
    throw error;
  }
};


const deleteTask = async (taskId) => {
  try {
    setOperationError("");

    await API.delete(`/${taskId}`);

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId)
    );
  } catch (error) {
    const message = getErrorMessage(error);
    setOperationError(message);
    throw error;
  }
};



const updateTask = async (taskId, taskData) => {
  try {
    setOperationError("");

    const response = await API.put(`/${taskId}`, taskData);
    const updatedTask = response.data.data;

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? updatedTask : task
      )
    );

    return updatedTask;
  } catch (error) {
    const message = getErrorMessage(error);
    setOperationError(message);
    throw error;
  }
};

const toggleTask = async (task) => {
  try {
    setOperationError("");

    const response = await API.put(`/${task.id}`, {
      ...task,
      completed: !task.completed,
    });

    const updatedTask = response.data.data;

    setTasks((previousTasks) =>
      previousTasks.map((previousTask) =>
        previousTask.id === task.id
          ? updatedTask
          : previousTask
      )
    );

    return updatedTask;
  } catch (error) {
    const message = getErrorMessage(error);
    setOperationError(message);
    throw error;
  }
};




  return { tasks, loading, error, operationError, addTask, deleteTask, updateTask, toggleTask,   };
}

export default useTasks;
