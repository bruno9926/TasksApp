import { useState, useEffect } from "react";
import type TaskType from "../types/Tasks";
import TasksAPIInterface from "../interfaces/TasksAPIInterface";

const env = import.meta.env;

const useFetchTasks = (
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>,
    tasksAPiInterface: TasksAPIInterface
) => {
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        if (!env.VITE_API_URL) {
            console.error("API URL is not defined!");
            setFetching(false);
            return;
        }

        try {
            setFetching(true);
            const retrievedTasks: TaskType[] = await tasksAPiInterface.getAll();
            setTasks(retrievedTasks)
        } catch(error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    }

    return { fetchTasks, fetching };
};

export default useFetchTasks;
