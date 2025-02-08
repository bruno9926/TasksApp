import type TaskType from '../../types/Tasks';
// components
import Task from '../task/task';
// styles
import classes from './taskColumn.module.scss';

import TaskStatuses from '../../types/TaskStatuses';

type TaskColumnProps = {
  header: {title: string},
  status: TaskStatuses,
  tasks: TaskType[],
  onToggle: (id: string) => () => void
}

const TaskColumn = ({ header, status, tasks, onToggle }: TaskColumnProps) => {
  return (
    <div className={classes.tasksColumn}>
        <HeaderChip title={`${header.title} (${tasks.length})`} status={status} />
        {tasks.map(task => (
            <Task
              task={task}
              onToggle={onToggle(task.id)}
            />
        ))}
    </div>
  )
}

const HeaderChip = ({ title, status = TaskStatuses.PENDING }: { title: string, status: TaskStatuses }) => {
  const statusTuStyle = (status: TaskStatuses) => {
    switch (status) {
      case TaskStatuses.PENDING:
        return classes.pending;
      case TaskStatuses.COMPLETED:
        return classes.completed;
      default:
        return '';
    }
  } 
  return (
    <div className={`${classes.headerChip} ${statusTuStyle(status)}`}>
      {title}
    </div>
  )
}

export default TaskColumn