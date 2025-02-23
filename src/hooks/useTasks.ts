import type TaskType from '../types/Tasks';
import useTaskManager from './useTaskManager';
import useFetchTasks from './useFetchTasks';
import useTaskDragAndDrop from './useTaskDragAndDrop';

const useTasks = (
    toggleCallback: (task: TaskType) => void
) => {

    const { tasks, setTasks, handleToggleTask, addNewTask, deleteTask, updateTask } = useTaskManager(toggleCallback);
    const { fetchTasks, fetching } = useFetchTasks(setTasks);
    const { handleDragEnd, completedTaskColumnId, uncompletedTaskColumnId } = useTaskDragAndDrop(setTasks, toggleCallback);

    return {
        completedTasks: tasks.filter(t => t.completed),
        uncompletedTasks: tasks.filter(t => !t.completed),
        completedTaskColumnId,
        uncompletedTaskColumnId,
        fetching,
        handleToggleTask,
        addNewTask,
        deleteTask,
        updateTask,
        handleDragEnd,
        fetchTasks,
    }
}

export default useTasks;