import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { DropResult  } from '@hello-pangea/dnd';
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

    const completedTaskColumnId = "completed";
    const uncompletedTaskColumnId = "uncompleted";

    // should we sepparate this function in a different hook?
    const handleDragEnd = (result: DropResult ) => {
        if (!result.destination) {
          return;
        }

        // we arrage uncompleted tasks first and then completed tasks
        const updatedTasks = [...uncompletedTasks, ...completedTasks];

        // since the result brings the index only for the current column, we need to take into account the other column
        // if the task comes from the completed list, we need to add the length of the uncompleted tasks to the source index
        let sourceIndex = result.source.index + (result.source.droppableId === completedTaskColumnId ? uncompletedTasks.length : 0);
        // if the task go to the completed list, we need to add the length of the uncompleted tasks to the destination index
        let destinationIndex = result.destination.index +
            (result.destination.droppableId === completedTaskColumnId ?
                // the -1 is because we are removing the task from the list
                uncompletedTasks.length - (result.source.droppableId === uncompletedTaskColumnId ? 1 : 0) 
                : 0
            );
    
        const [movedTask] = updatedTasks.splice(sourceIndex, 1);
        
        if (result.destination.droppableId === completedTaskColumnId) {
            movedTask.completed = true;
        }
        if (result.destination.droppableId === uncompletedTaskColumnId) {
            movedTask.completed = false;
        }

        updatedTasks.splice(destinationIndex, 0, movedTask);

        setUncompletedTasks(updatedTasks.filter(task => !task.completed));
        setCompletedTasks(updatedTasks.filter(task => task.completed));
    }

    return {
        completedTasks,
        uncompletedTasks,
        handleToggleTask,
        addNewTask,
        deleteTask,
        updateTask,
        handleDragEnd,
        completedTaskColumnId,
        uncompletedTaskColumnId
    }
}

export default useTasks;