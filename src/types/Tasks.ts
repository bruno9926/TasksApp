export default interface Task extends CreateTaskType{
    id: string;
    order: number
}

export interface CreateTaskType {
    title: string,
    description: string,
    completed: boolean,
}