import { DropResult } from "@hello-pangea/dnd";
import type TaskType from "../types/Tasks";
import TasksAPIInterface from '../interfaces/TasksAPIInterface';
import { useRef } from "react";

const useTaskDragAndDrop = (API: TasksAPIInterface) => {

    type dispatchTask = React.Dispatch<React.SetStateAction<TaskType[]>>;
    type subscriptionBody = {
        setTasks: dispatchTask,
        onTaskMoved: (task: TaskType) => void
    };
    const columnSubscriptions = useRef(new Map<string, subscriptionBody>([]));

    const subscribeSetterFunction = (columnId: string, subscriptionBody: {
        setTasks: dispatchTask,
        onTaskMoved?: (task: TaskType) => void
    }) => {
        columnSubscriptions.current.set(columnId, {
            setTasks: subscriptionBody.setTasks,
            onTaskMoved: subscriptionBody.onTaskMoved || (() => { })
        })
    }

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        // Optimistic UI approach
        // we change the state locally, and then send a request to update it remotely
        // if the remote change fails, we go back to our previous state

        let originColumn = result.source.droppableId;
        let destinationColumn = result.destination?.droppableId;

        let oldIndex = result.source.index;
        let newIndex = result.destination ? result.destination.index : oldIndex;

        if (originColumn === destinationColumn) {
            sortInOriginColumn(result, newIndex);
        } else {
            exportToDestinationColumn(result, newIndex);
        }
    }

    // reorders the tasks in the origin
    const sortInOriginColumn = (result: DropResult, newIndex: number) => {
        const origin = columnSubscriptions.current.get(result.source.droppableId);
        if (!origin) {
            return;
        }

        origin.setTasks(prevTasks => {
            let copyTasks = [...prevTasks];
            const movedTaskIndex = copyTasks.findIndex(task => task.id === result.draggableId);
            if (movedTaskIndex === -1) {
                return prevTasks;
            }
            let movedTask = copyTasks.splice(movedTaskIndex, 1)[0];
            copyTasks.splice(newIndex, 0, movedTask);

            let orderedTasks = updateOrderFromIndex(copyTasks);
            sendChangesToBackend(orderedTasks);
            return orderedTasks;
        })
    }

    // removes a task from the origin column and adds it to the destination column
    const exportToDestinationColumn = (result: DropResult, newIndex: number) => {
        if (!result.destination) return;

        const origin = columnSubscriptions.current.get(result.source.droppableId);
        const destination = columnSubscriptions.current.get(result.destination.droppableId);

        if (!origin || !destination) return;

        // remove from origin column
        removeTaskFromColumn(origin, result.draggableId)
            .then(movedTask => {
                addTaskToColumn(destination, movedTask, newIndex);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const removeTaskFromColumn = (column: subscriptionBody, taskId: string): Promise<TaskType> => {
        return new Promise((resolve, reject) => {
            column.setTasks(prevTasks => {
                let copyTasks = [...prevTasks];
                let movedTaskIndex = copyTasks.findIndex(task => task.id === taskId);
                if (movedTaskIndex === -1) {
                    reject(new Error("Task not found"));
                    return prevTasks;
                }

                let movedTask = { ...copyTasks[movedTaskIndex] };
                copyTasks.splice(movedTaskIndex, 1);

                let orderedTasks = updateOrderFromIndex(copyTasks);
                sendChangesToBackend(orderedTasks);

                resolve(movedTask);
                return orderedTasks;
            });
        });

    };

    const addTaskToColumn = (column: subscriptionBody, task: TaskType, newIndex: number) => {
        column.setTasks(prevTasks => {

            let copyTasks = [...prevTasks];
            copyTasks.splice(newIndex, 0, task);
            column.onTaskMoved(task);

            let orderedTasks = updateOrderFromIndex(copyTasks);
            sendChangesToBackend(orderedTasks);
            return orderedTasks;
        });
    };

    const updateOrderFromIndex = (tasks: TaskType[]) => {
        return tasks.map((task, index) => {
            return { ...task, order: index };
        });
    }

    const sendChangesToBackend = async (tasksToSend: TaskType[]) => {
        if (tasksToSend.length === 0) return;
        try {
            const promises = tasksToSend.map(task =>
                API.update(task).catch(err => {
                    console.error(`Error updating task ${task.id}:`, err);
                }
                ));
            await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    return { handleDragEnd, subscribeSetterFunction };
};

export default useTaskDragAndDrop;
