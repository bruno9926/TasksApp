import { useState } from 'react';
import type TaskType from '../types/Tasks';
import TasksAPIInterface from '../interfaces/TasksAPIInterface';


const useTaskManager = (
    API: TasksAPIInterface,
    toggleCallback: (task: TaskType) => void
) => {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    const addNewTask = async () => {
        const sampleTask: TaskType = {
            id: '', // id is assigned in the backend, we put an empty id to satisfy the type, fix this later
            title: "Sample Task",
            description: "What are you planning?",
            completed: false
        }

        try {
            const resultTasks: TaskType[] = await API.post(sampleTask);
            setTasks(resultTasks);
        } catch(err) {
            console.error(err);
        }
    }

    const deleteTask = (id: string) => () => {
        setTasks(tasks.filter(task => task.id !== id));
    }

    const updateTask = (id: string) => async (task: TaskType) => {
        let updatedTasks = await API.update({...task, id});
        setTasks(updatedTasks);
    }

    const handleToggleTask = (id: string) => async () => {
        let taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) throw Error("Task not found");
        let task: TaskType = tasks[taskIndex];

        const taskToUpdate: TaskType = {...task, completed: !task.completed};
        toggleCallback(taskToUpdate);

        await updateTask(id)(taskToUpdate);
    }

    return {
        tasks,
        setTasks,
        addNewTask,
        deleteTask,
        updateTask,
        handleToggleTask
    }
}

export default useTaskManager;