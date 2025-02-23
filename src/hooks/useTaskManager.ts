import { useState } from 'react';
import type TaskType from '../types/Tasks';
import TasksAPIInterface from '../interfaces/TasksAPIInterface';


const useTaskManager = (
    toggleCallback: (task: TaskType) => void,
    tasksAPiInterface: TasksAPIInterface
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
            const resultTasks: TaskType[] = await tasksAPiInterface.post(sampleTask);
            setTasks(resultTasks);
        } catch(err) {
            console.error(err);
        }
    }

    const deleteTask = (id: string) => () => {
        setTasks(tasks.filter(task => task.id !== id));
    }

    const updateTask = (id: string) => (task: TaskType) => {
        setTasks(prevTasks =>
            prevTasks.map(taskInList => taskInList.id === id ?
                { ...taskInList, ...task } : taskInList
            )
        );
    }

    const handleToggleTask = (id: string) => () => {
        setTasks(prevTasks => {
            let taskIndex = prevTasks.findIndex(task => task.id === id);
            if (taskIndex === -1) {
                return prevTasks;
            }
    
            // We create a copy of the tasks without mutating it directly
            const updatedTasks = [...prevTasks];
            const updatedTask = { ...updatedTasks[taskIndex], completed: !updatedTasks[taskIndex].completed };
    
            // We always put the task at last position
            updatedTasks.splice(taskIndex, 1);
            updatedTasks.push(updatedTask);
    
            toggleCallback(updatedTask);
            return updatedTasks;
        });
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