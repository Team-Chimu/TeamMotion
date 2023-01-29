import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import HeaderBarBackArrow from '../components/nav/HeaderBarBackArrow';
import BottomNavBar from '../components/nav/BottomNavbar';
import '../components/charters-page/CharterItem.css';

export default function PostCreation() {
    const history = useHistory()
    const { orgid, teamid } = useParams();
    const reflectionPath = `/orgs/${orgid}/teams/${teamid}/reflections`;

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [date, setDate] = React.useState(new Date());

    const savePost = async () => {
        setDate(new Date());
        const post = { title, content, date };
        await fetch(`http://localhost:3001/api/board/${orgid}/${teamid}`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        history.push(reflectionPath);
    }

    const content_placeholder = "What are your thoughts?\n- How is your group working together as a team?\n- What was one positive thing that happened in the project this week?\n- What worked well and what didn’t work well?\n- How well is the team adhering to the team charter?";

    return (
        <div>
            <HeaderBarBackArrow screenname='Reflection Board'/>
            <div className='reflection-container'>
                <input 
                    className="input-title" 
                    type="text" 
                    placeholder='Title'
                    value={title} 
                    size="50"
                    onChange={event => setTitle(event.target.value)}
                />

                <textarea 
                    className="input-content" 
                    type="text" 
                    placeholder={content_placeholder}
                    value={content}
                    size="50"
                    rows="10" cols="50"
                    onChange={event => setContent(event.target.value)}
                />
                <button className="btn-post" onClick={savePost}>
                    Post
                </button>
            </div>
            <BottomNavBar />
        </div>
    )
}