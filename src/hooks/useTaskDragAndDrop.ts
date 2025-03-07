import { DropResult } from "@hello-pangea/dnd";
import type TaskType from "../types/Tasks";
import Task from "../types/Tasks";
import TasksAPIInterface from '../interfaces/TasksAPIInterface';
import { useRef } from "react";

const useTaskDragAndDrop = (
    tasks: Task[],
    API: TasksAPIInterface) => {

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

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        // Optimistic UI approach
        // we change the state locally, and then send a request to update it remotely
        // if the remote change fails, we go back to our previous state
        const initialState = [...tasks]
        //setLocalChanges(result);
        organize(result);
        try {
            //await sendChangesToBackend(result)
        } catch {
            //setTasks(initialState);
        }
    };

    const organize = (result: DropResult) => {
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

            return updateOrderFromIndex(copyTasks);
        })
    }

    // removes a task from the origin column and adds it to the destination column
    const exportToDestinationColumn = (result: DropResult, newIndex: number) => {
        if (!result.destination) return;

        const origin = columnSubscriptions.current.get(result.source.droppableId);
        const destionation = columnSubscriptions.current.get(result.destination.droppableId);

        if (!origin || !destionation) return;

        let movedTask: TaskType | null = null;


        // remove from origin column
        origin.setTasks(prevTasks => {
            let copyTasks = [...prevTasks];
            let movedTaskIndex = copyTasks.findIndex(task => task.id === result.draggableId);
            if (movedTaskIndex === -1) return prevTasks;

            movedTask = { ...copyTasks[movedTaskIndex] }; // Copia segura
            copyTasks.splice(movedTaskIndex, 1);

            return updateOrderFromIndex(copyTasks);
        })

        //add to destination column
        destionation.setTasks(prevTasks => {
            if (!movedTask) return prevTasks;

            let copyTasks = [...prevTasks];
            copyTasks.splice(newIndex, 0, movedTask);
            destionation.onTaskMoved(movedTask);
            return updateOrderFromIndex(copyTasks);
        })
    }

    const updateOrderFromIndex = (tasks: TaskType[]) => {
        return tasks.map((task, index) => {
            return { ...task, order: index };
        });
    }

    return { handleDragEnd, subscribeSetterFunction };
};

export default useTaskDragAndDrop;
