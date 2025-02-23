// types
import type TaskType from "../../types/Tasks";
// styles
import classes from './tasks.module.scss';
// components
import TaskTitle from './taskTitle/TaskTitle';
import TaskDescription from "./taskDescription/TaskDescription";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FiTrash } from "react-icons/fi";

type TaskProps = {
    task: TaskType
    onToggle: () => void,
    onDelete: () => void,
    onUpdate: (task: TaskType) => void
};

const Task = ({ task, onToggle, onDelete, onUpdate }: TaskProps) => {
    const CheckboxInput = () => (
        <div className={classes.checkboxContainer}>
            <Checkbox.Root id={`completedCheckbox-${task.id}`}
                className={classes.checkbox}
                checked={task.completed}
                onCheckedChange={onToggle}>
                <Checkbox.Indicator className={classes.indicator}>
                    <CheckIcon />
                </Checkbox.Indicator>
            </Checkbox.Root>
            <label className={classes.checkboxLabel}
                htmlFor={`completedCheckbox-${task.id}`}>
                {task.completed? 'completed' : 'uncompleted'}
            </label>
        </div>
    );
    
    return (
        <div className={classes.taskCard + (task.completed ? ' ' + classes.completed : '')}>
            <TaskTitle
                title={task.title}
                onSave={(title:string) => onUpdate({...task, title})}
            />
            <TaskDescription
                description={task.description}
                onSave={(description:string) => onUpdate({...task, description})}
            />
            <div className={classes.taskFooter}>
                <CheckboxInput />
                <button className={classes.deleteButton} onClick={() => onDelete()}>
                    <FiTrash />
                </button>
            </div>
        </div>
    )
}

export default Task;