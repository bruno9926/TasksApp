import { fireEvent, render, screen } from '@testing-library/react';
import Task from '../components/task/task.tsx';
import type TaskType from '../types/Tasks.ts';

describe('Task', () => {
    const sampleTask: TaskType = {
        id: '1',
        title: 'A Completed Task',
        description: 'This is a test task',
        completed: true,
        order: 0
    }

    const getTaskProps = (task: TaskType) => {
        return {
            task,
            onToggle: jest.fn(),
            onDelete: jest.fn(),
            onUpdate: jest.fn()
        }
    }

    it('renders an uncompleted task', () => {
        const task: TaskType = { ...sampleTask, completed: false };

        const taskProps = getTaskProps(task)
        render(<Task {...taskProps} />);

        expect(screen.getByText(sampleTask.title)).toBeInTheDocument();
        expect(screen.getByText(sampleTask.description)).toBeInTheDocument();
        expect(screen.getByText("uncompleted")).toBeInTheDocument();
    });

    it('renders a completed task', () => {
        const task: TaskType = { ...sampleTask, completed: true }

        const taskProps = getTaskProps(task)
        render(<Task {...taskProps} />);

        expect(screen.getByText("completed")).toBeInTheDocument();
    })

    test('toggle button is clickable', () => {
        const task: TaskType = { ...sampleTask, completed: false }
        // GIVEN
        const taskProps = getTaskProps(task)
        render(<Task {...taskProps} />);
        const checkButton = screen.getByText("uncompleted")
        // WHEN
        fireEvent.click(checkButton)
        // THEN
        expect(taskProps.onToggle).toHaveBeenCalledTimes(1)
    })

    test('delete task is clickable', () => {
        const task: TaskType = { ...sampleTask }
        const taskProps = getTaskProps(task)
        // GIVEN
        render(<Task {...taskProps} />);
        const deleteButton = screen.getByLabelText('delete-button')
        // WHEN
        fireEvent.click(deleteButton)
        // THEN
        expect(taskProps.onDelete).toHaveBeenCalledTimes(1)
    })

    test('title is editable', () => {
        const task: TaskType = { ...sampleTask }
        const taskProps = getTaskProps(task)
        // GIVEN
        render(<Task {...taskProps} />);
        // WHEN
        const title = screen.getByText(sampleTask.title)
        fireEvent.click(title)
        const titleInput = screen.getByDisplayValue(sampleTask.title)

        const newTitle = "New Title"
        fireEvent.change(titleInput, {
            target: { value: newTitle }
        })
        fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter', charCode: 13 })
        // THEN
        expect(taskProps.onUpdate).toHaveBeenCalledTimes(1)
        expect(taskProps.onUpdate).toHaveBeenCalledWith({...task, title: newTitle})
    })

    test('description is editable', () => {
        const task: TaskType = { ...sampleTask }
        const taskProps = getTaskProps(task)
        // GIVEN
        render(<Task {...taskProps} />);
        // WHEN
        const description = screen.getByText(task.description)
        fireEvent.click(description)
        const descriptionInput = screen.getByDisplayValue(task.description)

        const newDescription = "New Description"
        fireEvent.change(descriptionInput, {
            target: { value: newDescription}
        })
        fireEvent.keyDown(descriptionInput, { key: 'Enter', code: 'Enter', charCode: 13 })
        // THEN
        expect(taskProps.onUpdate).toHaveBeenCalledTimes(1)
        expect(taskProps.onUpdate).toHaveBeenCalledWith({...task, description: newDescription})
    })
});