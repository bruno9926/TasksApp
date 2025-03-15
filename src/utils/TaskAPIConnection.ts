import TasksAPIInterface from "../interfaces/TasksAPIInterface";
import Task from "../types/Tasks";

const env = import.meta.env;

export default class TaskAPIConnection implements TasksAPIInterface {
    private static instance: TaskAPIConnection;

    private constructor(){}

    private readonly defaultHeader = {
         "Content-Type": "application/json"
    }

    static getInstance(): TaskAPIConnection {
        if (!TaskAPIConnection.instance) {
            TaskAPIConnection.instance = new TaskAPIConnection();
        }
        return TaskAPIConnection.instance;
    }

    async getAll(): Promise<Task[]> {
        try {
            const res = await fetch(env.VITE_API_URL);
            if (!res.ok) throw new Error("Error fetching tasks");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async post(task: Task): Promise<Task[]> {
        try {
            const res = await fetch(env.VITE_API_URL, {
                method: "POST",
                headers: {...this.defaultHeader},
                body: JSON.stringify(task)
            });
            if (!res.ok) throw new Error("Error posting task");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async update(task: Task): Promise<Task[]> {
        try {
            const res = await fetch(`${env.VITE_API_URL}/${task.id}`, {
                method: "PUT",
                headers: {...this.defaultHeader},
                body: JSON.stringify(task)
            });
            if (!res.ok) throw new Error("Error updating task");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id: string): Promise<Task[]> {
        try {
            const res = await fetch(`${env.VITE_API_URL}/${id}`, {
                method: "DELETE",
                headers: {...this.defaultHeader}
            });
            if (!res.ok) throw new Error("Error deleting task");
            return await res.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}