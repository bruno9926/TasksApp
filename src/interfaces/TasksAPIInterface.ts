import Task, { CreateTaskType } from "../types/Tasks";
import TaskAPIConnection from "../utils/TaskAPIConnection";

export default interface TasksAPIInterface {
    getAll: () => Promise<Task[]>,
    post: (task: CreateTaskType) => Promise<Task[]>,
    update: (task: Task) => Promise<Task[]>,
    delete: (id: string) => Promise<Task[]>
}

export function getDefaultImplementation(): TasksAPIInterface {
    return TaskAPIConnection.getInstance();
}