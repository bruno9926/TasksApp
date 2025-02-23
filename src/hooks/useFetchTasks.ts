import { useState, useEffect } from "react";
import type TaskType from "../types/Tasks";

const env = import.meta.env;

const useFetchTasks = (setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>) => {
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        if (!env.VITE_API_URL) {
            console.error("API URL is not defined!");
            setFetching(false);
            return;
        }

        setFetching(true);
        fetch(env.VITE_API_URL)
            .then((res) => {
                if (!res.ok) throw new Error("Error fetching tasks");
                return res.json();
            })
            .then((json) => {
                setTasks(json)
            })
            .catch((err) => console.error(err))
            .finally(() => setFetching(false));
    };

    return { fetchTasks, fetching };
};

export default useFetchTasks;
