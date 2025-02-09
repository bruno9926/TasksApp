// types
import type TaskType from '../../types/Tasks';
// components
import TaskColumn from '../TaskColumn/TaskColumn';
// styles
import classes from './tasksView.module.scss';
import TaskStatuses from '../../types/TaskStatuses';
// icons
import { FaPlus } from "react-icons/fa6";
// hooks
import useTasks from '../../hooks/useTasks';


const TasksView = () => {
  const tasks: TaskType[] = [
    {
      id: "1",
      title: "Fist Task",
      description: "que pasa si pongo un texto muy muy muy muy largo. El largo de la card no deberia verse afectado pero si su alto",
      completed: false
    },
    {
      id: "2",
      title: "Second Task",
      description: "getting used to it",
      completed: true
    }
  ];

  const {
    completedTasks,
    uncompletedTasks,
    handleToggleTask,
    addNewTask,
    deleteTask,
    updateTask
  } = useTasks(tasks);

  return (
    <section className={classes.tasksView}>
      <Header addNewTask={addNewTask}/>
      <div className={classes.tasksContainer}>
        <TaskColumn
          header={{title: "pending"}}
          status={TaskStatuses.PENDING}
          tasks={uncompletedTasks}
          onToggle={handleToggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <TaskColumn
          header={{title: "completed"}}
          status={TaskStatuses.COMPLETED}
          tasks={completedTasks}
          onToggle={handleToggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </section>
  )
}

const Header = ({ addNewTask } : { addNewTask: () => void }) => {
  return (
    <div className={classes.header}>
      <h1>Your Tasks</h1>
      <button className={classes.addTask} onClick={() => addNewTask()}>
        <FaPlus />
      </button>
    </div>
  )
}

export default TasksView