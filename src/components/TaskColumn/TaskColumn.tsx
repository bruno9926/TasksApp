import type TaskType from '../../types/Tasks';
// components
import Task from '../task/task';
// styles
import classes from './taskColumn.module.scss';

type TaskColumnProps = { header: {title: string}, tasks: TaskType[], onToggle: (id: string) => () => void }

const TaskColumn = ({ header, tasks, onToggle }: TaskColumnProps) => {
  return (
    <div className={classes.tasksColumn}>
        {header.title}
        {tasks.map(task => (
            <Task
              task={task}
              onToggle={onToggle(task.id)}
            />
        ))}
    </div>
  )
}

export default TaskColumn