import { v4 as uuid } from 'uuid';
import { useState } from 'react';
// types
import type TaskType from '../types/Tasks';

const useTasks = (initialTasks: TaskType[]) => {
    const [completedTasks, setCompletedTasks] = useState<TaskType[]>(initialTasks.filter(task => task.completed));
    const [uncompletedTasks, setUncompletedTasks] = useState<TaskType[]>(initialTasks.filter(task => !task.completed));

    const handleToggleTask = (id: string) => () => {
    setCompletedTasks(prevCompleted => {
        const task = uncompletedTasks.find(task => task.id === id);
        // if task is uncompleted, we send it to the completed tasks
        if (task) {
        return [...prevCompleted, {...task, completed: true}];
        } else {
        // else we remove it from the completed tasks
        return prevCompleted.filter(task => task.id !== id);
        }
    })

    setUncompletedTasks(prevUncompleted => {
        const task = completedTasks.find(task => task.id === id);
        // if task is completed, we send it to the uncompleted tasks
        if (task) {
        return [...prevUncompleted, {...task, completed: false}];
        } else {
        // else we remove it from the uncompleted tasks
        return prevUncompleted.filter(task => task.id !== id);
        }
    })
    }

    const addNewTask = () => {
        let newId = uuid();

        const sampleTask: TaskType = {
            id: newId,
            title: "Sample Task",
            description: "What are you plannig?",
            completed: false
        }
        setUncompletedTasks([...uncompletedTasks, sampleTask])
    }

    const deleteTask = (id: string) => () => {
        setCompletedTasks(completedTasks.filter(task => task.id !== id));
        setUncompletedTasks(uncompletedTasks.filter(task => task.id !== id));
    }

    const updateTask = (id: string) => (task: TaskType) => {
        setCompletedTasks(
            completedTasks.map(taskInList => taskInList.id === id ?
                {...taskInList, ...task} : taskInList
            )
        );
        setUncompletedTasks(
            uncompletedTasks.map(taskInList => taskInList.id === id ?
                {...taskInList, ...task} : taskInList
            )
        )
    }

    return { completedTasks, uncompletedTasks, handleToggleTask, addNewTask, deleteTask, updateTask }
}

export default useTasks;