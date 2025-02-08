import type TaskType from "../../types/Tasks";
import classes from './tasks.module.scss';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

type TaskProps = { task: TaskType, onToggle: () => void };

const Task = ({ task, onToggle }: TaskProps) => {

    return (
        <div className={classes.taskCard + (task.completed ? ' ' + classes.completed : '')}>
            <h3>{task.title}</h3>
            <span className={classes.description}>
                {task.description}
            </span>
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
        </div>
    )
    
}

export default Task