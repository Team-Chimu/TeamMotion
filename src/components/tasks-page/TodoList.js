import React from "react";
import { AssignmentContext } from "../../pages/AssignmentContext";
import TodoItem from "./TodoItem";
import { Grid } from '@mui/material';

export default function TodoList() {
    const value = React.useContext(AssignmentContext);

    const handleStatus = (todo) => {
        let modified_todos = value.todo_list;
        const index = modified_todos.indexOf(todo);
        modified_todos[index].completed = !modified_todos[index].completed;
        changeComplete(modified_todos[index]._id, modified_todos[index].completed, value.assignment_id)
        value.setTodoList(modified_todos);
    }

    const changeComplete = async (todoId, completed, assignmentId) => {
        const todo = { todoId: todoId, completed: completed };
        fetch(`http://localhost:3000/api/assignments/621d26f81a997588eb8b7979/${assignmentId}/team/1`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
    }

    // TODO: handleDelete

    // TODO: handleEdit

    return (
        <Grid>
            {
                value.todo_list.map(todo => {
                    if (!todo.completed) return <TodoItem key={todo._id} todo={todo} handleStatus={handleStatus} />
                })
            }
        </Grid>
    );
}
