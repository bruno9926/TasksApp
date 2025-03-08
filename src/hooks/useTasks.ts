import type TaskType from '../types/Tasks';
import useTaskManager from './useTaskManager';
import useFetchTasks from './useFetchTasks';
import useTaskDragAndDrop from './useTaskDragAndDrop';
import TasksAPIInterface, { getDefaultImplementation } from '../interfaces/TasksAPIInterface';
import { useEffect, useState } from 'react';

const useTasks = (
    toggleCallback: (task: TaskType) => void,
    tasksAPiInterface: TasksAPIInterface | undefined = getDefaultImplementation()
) => {

    // tasks divided by status, each column has its own set of tasks
    const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
    const [uncompletedTasks, setUncompletedTasks] = useState<TaskType[]>([]);

    const { tasks, setTasks, handleToggleTask, addNewTask, deleteTask, updateTask } = useTaskManager(tasksAPiInterface, toggleCallback);
    const { fetchTasks, fetching } = useFetchTasks(setTasks, tasksAPiInterface);
    const { handleDragEnd, subscribeSetterFunction } = useTaskDragAndDrop(
        tasks,
        tasksAPiInterface
    );

    // separate all the tasks into different categories
    useEffect(() => {
        const completed = tasks.filter(task => task.completed);
        const uncompleted = tasks.filter(task => !task.completed);

        setCompletedTasks(completed.map((task, index) => ({ ...task, order: index })));
        setUncompletedTasks(uncompleted.map((task, index) => ({ ...task, order: index })));
    }, [tasks]);

    // column ids
    const completedTaskColumnId: string = "completed";
    const uncompletedTaskColumnId: string = "uncompleted";
    subscribeSetterFunction(completedTaskColumnId, {
        setTasks: setCompletedTasks,
        onTaskMoved: (task: TaskType) => {
            task.completed = true;
            toggleCallback(task);

        }
    });
    subscribeSetterFunction(uncompletedTaskColumnId, {
        setTasks: setUncompletedTasks,
        onTaskMoved: (task: TaskType) => {
            task.completed = false;
            toggleCallback(task);
        }
    });

    return {
        completedTasks: completedTasks,
        uncompletedTasks: uncompletedTasks,
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