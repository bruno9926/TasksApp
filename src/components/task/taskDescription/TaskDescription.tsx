import { useState } from 'react'
import classes from '../tasks.module.scss'

type TaskDescriptionProps = {
  description: string,
  onSave: (description: string) => void
}

const TaskDescription = ({ description, onSave}: TaskDescriptionProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedDescription, setEditedDescription] = useState(description);

	const handleSave = () => {
		if (editedDescription.trim()) {
			setIsEditing(false);
			onSave(editedDescription);
		}
	}

	return isEditing ? (
		<textarea
			className={classes.descriptionInput}
			value={editedDescription}
			onChange={(e) => setEditedDescription(e.target.value)}
			onBlur={handleSave}
			onKeyDown={(e) => e.key === 'Enter' && handleSave()}
			autoFocus
		/>
	) : (
		<span className={classes.description} onClick={() => setIsEditing(true)}>
			{description}
		</span>
	)
}

export default TaskDescription