// types
import type TaskType from '../../types/Tasks';
// components
import TaskConfetti from './TaskConfetti/TaskConfetti';
import TaskColumn from '../TaskColumn/TaskColumn';
import { DragDropContext } from "@hello-pangea/dnd";
// styles
import classes from './tasksView.module.scss';
import TaskStatuses from '../../types/TaskStatuses';
// icons
import { FaPlus } from "react-icons/fa6";
// hooks
import useTasks from '../../hooks/useTasks';

import initialTasks from './initialTasks.json';

import { useState } from 'react';


const TasksView = () => {
  const tasks: TaskType[] = initialTasks;

  // Confetti animation
  const [showConfetti, setShowConfetti] = useState(false);

  const celebrate = () => {
    if (showConfetti) {
      return;
    }
    setShowConfetti(true);
    const celebrationTime = 3000;

    setTimeout(() => {
      setShowConfetti(false)
    }, celebrationTime)
  }

  const toggleCallback = (task: TaskType) => {
    if (task.completed) {
      celebrate()
    }
  }

  const {
    completedTasks,
    uncompletedTasks,
    handleToggleTask,
    addNewTask,
    deleteTask,
    updateTask,
    handleDragEnd,
    completedTaskColumnId,
    uncompletedTaskColumnId
  } = useTasks(
    tasks,
    toggleCallback
  );

  return (
    <section className={classes.tasksView}>
      <TaskConfetti show={showConfetti}/>
      <Header addNewTask={addNewTask}/>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.tasksContainer}>
          <TaskColumn
            id={uncompletedTaskColumnId}
            header={{title: "pending"}}
            status={TaskStatuses.PENDING}
            tasks={uncompletedTasks}
            onToggle={handleToggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
          <TaskColumn
            id={completedTaskColumnId}
            header={{title: "completed"}}
            status={TaskStatuses.COMPLETED}
            tasks={completedTasks}
            onToggle={handleToggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>
      </DragDropContext>
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