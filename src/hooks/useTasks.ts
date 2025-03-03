import type TaskType from '../types/Tasks';
import useTaskManager from './useTaskManager';
import useFetchTasks from './useFetchTasks';
import useTaskDragAndDrop from './useTaskDragAndDrop';
import TasksAPIInterface, { getDefaultImplementation } from '../interfaces/TasksAPIInterface';

const useTasks = (
    toggleCallback: (task: TaskType) => void,
    tasksAPiInterface: TasksAPIInterface | undefined = getDefaultImplementation()
) => {

    const { tasks, setTasks, handleToggleTask, addNewTask, deleteTask, updateTask } = useTaskManager(tasksAPiInterface);
    const { fetchTasks, fetching } = useFetchTasks(setTasks, tasksAPiInterface);
    const { handleDragEnd, completedTaskColumnId, uncompletedTaskColumnId } = useTaskDragAndDrop(
        tasks,
        setTasks,
        tasksAPiInterface,
        toggleCallback
    );

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