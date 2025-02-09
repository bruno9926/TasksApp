import { v4 as uuid } from 'uuid';
// types
import type TaskType from '../../types/Tasks';
import TaskStatuses from '../../types/TaskStatuses';
// components
import Task from '../task/task';
import { Droppable, Draggable } from '@hello-pangea/dnd';
// styles
import classes from './taskColumn.module.scss';

type TaskColumnProps = {
  id: string,
  header: {title: string},
  status: TaskStatuses,
  tasks: TaskType[],
  onToggle: (id: string) => () => void,
  onDelete: (id: string) => () => void,
  onUpdate: (id: string) => (task: TaskType) => void
}

const TaskColumn = ({
  id,
  header, status, tasks,
  onToggle, onDelete, onUpdate
}: TaskColumnProps) => {

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div className={classes.tasksColumn} ref={provided.innerRef} {...provided.droppableProps}>
          <HeaderChip title={`${header.title} (${tasks.length})`} status={status} />
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Task
                  task={task}
                  onToggle={onToggle(task.id)}
                  onDelete={onDelete(task.id)}
                  onUpdate={onUpdate(task.id)}
                  />
                </div>
              )}
            </Draggable>
          ))}
      </div> 
    )}
    </Droppable>
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