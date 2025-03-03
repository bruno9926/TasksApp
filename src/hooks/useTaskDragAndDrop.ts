import { DropResult } from "@hello-pangea/dnd";
import type TaskType from "../types/Tasks";
import Task from "../types/Tasks";
import TasksAPIInterface from '../interfaces/TasksAPIInterface';

const useTaskDragAndDrop = (
    tasks: Task[],
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>,
    API: TasksAPIInterface,
    toggleCallback: (task: TaskType) => void) => {

    const completedTaskColumnId = "completed";
    const uncompletedTaskColumnId = "uncompleted";

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        // Optimistic UI approach
        // we change the state locally, and then send a request to update it remotely
        // if the remote change fails, we go back to our previous state
        const initialState = [...tasks]
        setLocalChanges(result);
        try {
            //await sendChangesToBackend(result)
        } catch {
            setTasks(initialState);
        }
    };

    const setLocalChanges = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        let oldIndex = result.source.index;
        let newIndex = result.destination ? result.destination.index : oldIndex;

        let destinationColumnIsCompleted = result.destination?.droppableId === completedTaskColumnId;
        const changedColumn = result.source.droppableId !== result.destination.droppableId;

        setTasks(prevTasks => {
            let updatedTasks = prevTasks.map(task => {
                if (task.id !== result.draggableId) {
                    if (task.order >= newIndex && changedColumn) {
                        return {...task, order: ++task.order}
                    } return task;
                } else {
                    let completionStateChanged = result.source.droppableId !== result.destination?.droppableId
                    return {
                        ...task,
                        order: newIndex,
                        completed: completionStateChanged ? !task.completed : task.completed
                    }
                }
            })
            console.log(updatedTasks)
            updatedTasks = updatedTasks.sort((a, b) => a.order - b.order);
            return updatedTasks;
        })

        if (result.destination) {
            updateOrder(result.draggableId, oldIndex, newIndex, destinationColumnIsCompleted);
        }
    };

    const updateOrder = (referenceTaskId: string, oldIndex: number, newIndex: number, completionStatus: boolean) => {
        const isMovingDown = oldIndex < newIndex;
        const isMovingUp = oldIndex > newIndex;

        setTasks(prevTasks => {
            let newState = prevTasks.map(task => {
                if (task.completed !== completionStatus) {
                    return {...task};
                }

                let order = task.order
                if (task.id === referenceTaskId) {
                    // do nothing
                } else if (isMovingDown && task.order > oldIndex && task.order <= newIndex) {
                    order--;
                } else if (isMovingUp && task.order < oldIndex && task.order >= newIndex) {
                    order++;
                }
                // stay in the valid range [0, taskLenght - 1]
                order = Math.max(0, Math.min(order, prevTasks.length - 1));
                return { ...task, order }
            })

            if (newIndex === oldIndex) {
                newState = prevTasks
            }

            newState.filter(task => task.completed !== completionStatus)
            .forEach((task, index) => {
                task.order = index;
            });

            return newState.sort((a, b) => a.order - b.order);
        })
    }

    const sendChangesToBackend = async (result: DropResult) => {

        const taskIndex = tasks.findIndex(task => task.id === result.draggableId);
        if (taskIndex === -1) return;

        let newOrder = result.destination!.index;
        if (result.source.droppableId === uncompletedTaskColumnId && result.destination?.droppableId == completedTaskColumnId) {
            let numberOfUncompletedTasks = tasks.filter(t => !t.completed).length - 1;
            newOrder += numberOfUncompletedTasks;
        }

        const updatedTask = { ...tasks[taskIndex], order: newOrder };
        await API.update(updatedTask);
    };

    return { handleDragEnd, completedTaskColumnId, uncompletedTaskColumnId };
};

export default useTaskDragAndDrop;
