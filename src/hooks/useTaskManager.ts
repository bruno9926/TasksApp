import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type TaskType from '../types/Tasks';


const useTaskManager = (
    toggleCallback: (task: TaskType) => void
) => {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    const addNewTask = () => {
        let newId = uuid();

        const sampleTask: TaskType = {
            id: newId,
            title: "Sample Task",
            description: "What are you planning?",
            completed: false
        }
        setTasks(prevTasks => [...prevTasks, sampleTask])
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