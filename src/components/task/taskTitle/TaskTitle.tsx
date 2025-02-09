import { useState } from 'react'
import classes from '../tasks.module.scss'

type TaskTitleProps = {
  title: string,
  onSave: (title: string) => void
}

const TaskTitle = ({ title, onSave}: TaskTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);	

  const handleSave = () => {
    if (editedTitle.trim()) {
      onSave(editedTitle);
      setIsEditing(false);
    }
  }

  return isEditing ? (
    <input
      type="text"
      className={classes.taskTitleInput}
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
      autoFocus
    />
  ) : (
    <h3 className={classes.taskTitle} onClick={() => setIsEditing(true)}>{title}</h3>
  )
}

export default TaskTitle