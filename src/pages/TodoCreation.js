import React from 'react';
import { ArrowLeft } from 'phosphor-react';
import { useHistory, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import BottomNavBar from '../components/nav/BottomNavbar';
import './Tasks.css';

export default function TodoCreation() {
    const history = useHistory()

    const goBack = () => {
        history.goBack()
    }

    const { orgid, teamid } = useParams();
    const taskPath = `/orgs/${orgid}/teams/${teamid}/tasks`;

    const [todo_content, setTodoName] = React.useState('');
    const [selected_assignment, setSelectedAssignment] = React.useState({ id: "", name: "" });
    const [todo_due, setTodoDue] = React.useState();
    const [assignee, setAssignee] = React.useState({ id: "", name: "" });

    const handleTodo = (event) => {
        setTodoName(event.target.value);
    }

    const handleAssignment = (event) => {
        const name = event.target.value;
        const id = assignments.find(item => item.name === name)._id
        setSelectedAssignment({ id, name });
    }

    const handleAssignee = (event) => {
        const name = event.target.value;
        const id = members.find(item => item.displayName === name)._id._id;
        setAssignee({ id, name });
    }

    const handleDate = (event) => {
        const date = new Date(event.target.value);
        setTodoDue(date);
    }

    const [isLoaded, setIsLoaded] = React.useState(false);
    const [assignments, setAssignments] = React.useState([]);
    const [[...members], setMembers] = React.useState('');

    // get assignment list from api : names & due dates
    const loadAssignments = async () => {
        await fetch(`http://localhost:3001/api/assignments/${orgid}/team/${teamid}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(receivedData => {
                setAssignments(receivedData);
                setIsLoaded(true); // FIXME: await both assignment and member's async responses
            })
            .catch(error => {
                setIsLoaded(false);
                console.log("load data error:", error);
            })
    }

    // get team member list from api : names
    const loadMembers = async () => {
        await fetch(`http://localhost:3001/api/org/${orgid}/team/${teamid}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(receivedData => {
                setMembers(receivedData.teams[0].members);
                setIsLoaded(true);
            })
            .catch(error => {
                setIsLoaded(false);
                console.log("load data error:", error);
            })
    }

    // post a new todo to api
    const postTodo = async () => {
        const todo = { content: todo_content, date: todo_due, assignedId: assignee.id, assignedName: assignee.name };
        await fetch(`http://localhost:3001/api/assignments/${orgid}/${selected_assignment.id}/team/${teamid}`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        });
        history.push(taskPath);
    }

    React.useEffect(() => {
        loadAssignments();
        loadMembers();
    }, []);

    const btnHomeStyle = {
        position: "absolute",
        marginTop: "23px",
        marginLeft: "22px"
    }

    return (
        <div>
            {!isLoaded && <p>Loading...</p>}
            {isLoaded && (
                <div className='container'>
                    <button className="btn-back" onClick={goBack} style={btnHomeStyle}>
                        <ArrowLeft size={35} color="#4B369D" />
                    </button>

                    <Stack
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { mt: 5, width: '25ch' },
                            pl: 5,
                            pt: 3,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Input
                            placeholder="To-Do Name"
                            sx={{ mt: 6.5, color: "#4B369D", fontSize: 24, maxWidth: 300 }}
                            onChange={handleTodo}
                        />

                        <TextField
                            id="outlined-select-assignment"
                            select
                            label="Assignments"
                            value={selected_assignment.name}
                            onChange={handleAssignment}
                            helperText="Please select an assignment"
                        >
                            {assignments.map((option) => (
                                <MenuItem key={option.name} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            id="date"
                            label="Done by"
                            type="date"
                            sx={{ minWidth: 250 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleDate}
                        />

                        <TextField
                            id="outlined-select-member"
                            select
                            label="Assignee"
                            value={assignee.name}
                            onChange={handleAssignee}
                            helperText="Please select a member"
                        >
                            {members.map((option) => (
                                <MenuItem key={option.displayName} value={option.displayName}>
                                    {option.displayName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                    <button className="btn-post" onClick={postTodo}>Add To-do</button>
                    <BottomNavBar />
                </div>
            )}
        </div>
    );
}