import TaskColumn from '../TaskColumn/TaskColumn';
import { useState } from 'react';
// types
import type TaskType from '../../types/Tasks'

// styles
import classes from './tasksView.module.scss';
import TaskStatuses from '../../types/TaskStatuses';
// icons
import { FaPlus } from "react-icons/fa6";

import { v4 as uuid } from 'uuid';

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

  const [completedTasks, setCompletedTasks] = useState<TaskType[]>(tasks.filter(task => task.completed));
  const [uncompletedTasks, setUncompletedTasks] = useState<TaskType[]>(tasks.filter(task => !task.completed));

  const handleToggleTask = (id: string) => () => {
    setCompletedTasks(prevCompleted => {
      const task = uncompletedTasks.find(task => task.id === id);
      // if task is uncompleted, we send it to the completed tasks
      if (task) {
        return [...prevCompleted, {...task, completed: true}];
      } else {
        // else we remove it from the completed tasks
        return prevCompleted.filter(task => task.id !== id);
      }
    })

    setUncompletedTasks(prevUncompleted => {
      const task = completedTasks.find(task => task.id === id);
      // if task is completed, we send it to the uncompleted tasks
      if (task) {
        return [...prevUncompleted, {...task, completed: false}];
      } else {
        // else we remove it from the uncompleted tasks
        return prevUncompleted.filter(task => task.id !== id);
      }
    })
  }

  const addNewTask = () => {
    let newId = uuid();

    const sampleTask: TaskType = {
      id: newId,
      title: "Sample Task",
      description: "What are you plannig?",
      completed: false
    }
    setUncompletedTasks([...uncompletedTasks, sampleTask])
  }

  return (
    <section className={classes.tasksView}>
      <Header addNewTask={addNewTask}/>
      <div className={classes.tasksContainer}>
        <TaskColumn
          header={{title: "pending"}}
          status={TaskStatuses.PENDING}
          tasks={uncompletedTasks}
          onToggle={handleToggleTask}
        />
        <TaskColumn
          header={{title: "completed"}}
          status={TaskStatuses.COMPLETED}
          tasks={completedTasks}
          onToggle={handleToggleTask}
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