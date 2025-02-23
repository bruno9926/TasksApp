import type TaskType from '../types/Tasks';
import useTaskManager from './useTaskManager';
import useFetchTasks from './useFetchTasks';
import useTaskDragAndDrop from './useTaskDragAndDrop';
import TasksAPIInterface, { getDefaultImplementation } from '../interfaces/TasksAPIInterface';

const useTasks = (
    toggleCallback: (task: TaskType) => void,
    tasksAPiInterface: TasksAPIInterface | undefined = getDefaultImplementation()
) => {

    const { tasks, setTasks, handleToggleTask, addNewTask, deleteTask, updateTask } = useTaskManager(toggleCallback, tasksAPiInterface);
    const { fetchTasks, fetching } = useFetchTasks(setTasks, tasksAPiInterface);
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