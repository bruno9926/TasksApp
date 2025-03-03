import Task from "../types/Tasks";
import TaskAPIConnection from "../utils/TaskAPIConnection";

export default interface TasksAPIInterface {
    getAll: () => Promise<Task[]>,
    post: (task: Task) => Promise<Task[]>,
    update: (task: Task) => Promise<Task[]>
}

export function getDefaultImplementation(): TasksAPIInterface {
    return TaskAPIConnection.getInstance();
}