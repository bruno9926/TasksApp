import { v4 as uuid } from 'uuid';
import { useState, useEffect } from 'react';
import { DropResult  } from '@hello-pangea/dnd';
// types
import type TaskType from '../types/Tasks';

const env = import.meta.env;

const useTasks = (
    toggleCallback: (task: TaskType) => void = () => {}
) => {

    useEffect(() => {
        if (!env.VITE_API_URL) {
            console.error("API URL is not defined!");
            setFetching(false);
            return;
        }

        setFetching(true);
        fetch(env.VITE_API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error("Error fetching tasks")
            }
            return res.json()
        })
        .then(json => {
            let tasks = json;
            setTasks(tasks);
        })
        .catch(err => {
            console.log(err)
            console.error(err)
        })
        .finally(() =>{
            setFetching(false)
        })
    },[])

    const [fetching, setFetching] = useState(false);
    const [tasks, setTasks] = useState<TaskType[]>([]);

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
        setTasks( prevTasks =>
            prevTasks.map(taskInList => taskInList.id === id ?
                {...taskInList, ...task} : taskInList
            )
        ); 
    }

    const completedTaskColumnId = "completed";
    const uncompletedTaskColumnId = "uncompleted";

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
    
        setTasks(prevTasks => {
            const taskIndex = prevTasks.findIndex(task => task.id === result.draggableId);
            if (taskIndex === -1) return prevTasks;
    
            const updatedTasks = [...prevTasks];
            const [movedTask] = updatedTasks.splice(taskIndex, 1);
    
            if (result.destination?.droppableId !== result.source.droppableId) {
                movedTask.completed = !movedTask.completed;
                toggleCallback(movedTask);
            }
            
            let destinationIndex = result.destination!.index;
            if (result.source.droppableId === uncompletedTaskColumnId && result.destination?.droppableId == completedTaskColumnId) {
                let numberOfUncompletedTasks = prevTasks.filter(t => !t.completed).length;
                destinationIndex += numberOfUncompletedTasks;
            }
            console.log(destinationIndex)
            updatedTasks.splice(destinationIndex, 0, movedTask);
    
            return updatedTasks;
        });
    };

    return {
        completedTasks: tasks.filter(t => t.completed),
        uncompletedTasks: tasks.filter(t => !t.completed),
        handleToggleTask,
        addNewTask,
        deleteTask,
        updateTask,
        handleDragEnd,
        completedTaskColumnId,
        uncompletedTaskColumnId,
        fetching
    }
}

export default useTasks;