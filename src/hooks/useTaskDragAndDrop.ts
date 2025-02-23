import { DropResult } from "@hello-pangea/dnd";
import type TaskType from "../types/Tasks";

const useTaskDragAndDrop = (
    setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>,
    toggleCallback: (task: TaskType) => void) => {

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
            updatedTasks.splice(destinationIndex, 0, movedTask);
    
            return updatedTasks;
        });
    };

    return { handleDragEnd, completedTaskColumnId, uncompletedTaskColumnId };
};

export default useTaskDragAndDrop;
