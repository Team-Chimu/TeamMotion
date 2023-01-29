import React from 'react';
import { Link, useParams } from 'react-router-dom';
import HeaderBarTeambase from "../components/nav/HeaderBarTeambase";
import BottomNavBar from '../components/nav/BottomNavbar';
import { Divider } from '@mui/material';
import { Plus, PencilSimple, User } from "phosphor-react";
import MeetingCard from '../components/teambase/MeetingCard';
import GoalCard from '../components/teambase/GoalCard';
import EmailCard from '../components/teambase/EmailCard';
import './Teambase.css'

export default function Teambase() {
    const { orgid, teamid } = useParams();
    const meetingPath = `/orgs/${orgid}/teams/${teamid}/teambase/meetings`;
    const goalPath = `/orgs/${orgid}/teams/${teamid}/teambase/goals`;
    const emailPath = `/orgs/${orgid}/teams/${teamid}/teambase/emails`;

    const [isLoaded, setIsLoaded] = React.useState(false);
    const [meetings, setMeetings] = React.useState([]);
    const [profiles, setProfiles] = React.useState([]);
    const [goals, setGoals] = React.useState([]);

    const loadCharters = async () => {
        await fetch(`http://localhost:3001/api/charters/${orgid}/${teamid}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(receivedPosts => {
                receivedPosts.data.forEach(data => {
                    if (data.meetingTimes) setMeetings(data.meetingTimes)
                    else if (data.profile) setProfiles(data.profile)
                    else if (data.goals) setGoals(data.goals)
                })
                setIsLoaded(true);
            })
            .catch(error => {
                setIsLoaded(false);
                console.log("load data error:", error);
            })
    }
    React.useEffect(() => {
        loadCharters();
    }, []);

    return (
        <div className='container'>
            <HeaderBarTeambase />
            {!isLoaded && <p>Loading...</p>}
            {isLoaded && (
                <div>
                    <div className='profile-container'>
                        {profiles.map((profile, i) => {
                            return (
                                <div key={`profile-item-${i}`} className='profile-item'>
                                    {/* TODO: face-man-profile icon */}
                                    <User size={70} color="#4B369D" />
                                    <p>{profile.name}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className='section-break'>
                        <h3>Meeting Times</h3>
                        {meetings.length > 0 && (
                            <Link className="btn-edit" to={meetingPath}><PencilSimple size={30} color='#4B369D' /></Link>
                        )}
                    </div>
                    <Divider/>
                    {meetings.length < 1 ? (
                        <Link to={meetingPath}>
                            <div className="btn-add">
                                <Plus size={24} color="#4B369D"/>
                            </div>
                        </Link>
                    ) : (
                        <div className='meeting-list'>
                            {meetings.map(meeting => <MeetingCard meeting={meeting}/>)}
                        </div>
                    )}
                    
                    <div className='section-break'>
                        <h3>Team Goals</h3>
                        {goals.length > 0 && (
                            <Link className="btn-edit" to={goalPath}><PencilSimple size={30} color='#4B369D' /></Link>
                        )}
                    </div>
                    <Divider/>
                    {goals.length < 1 ? (
                        <Link to={goalPath}>
                            <div className="btn-add">
                                <Plus size={24} color="#4B369D"/>
                            </div>
                        </Link>
                    ) : (
                        <div className='meeting-list'>
                            {goals.map(goal => <GoalCard goal={goal}/>)}
                        </div>
                    )}

                    <div className='section-break'>
                        <h3>Emails</h3>
                        {profiles.length > 0 && (
                            <Link className="btn-edit" to={emailPath}><PencilSimple size={30} color='#4B369D' /></Link>
                        )}
                    </div>
                    <Divider/>
                    {profiles.length < 1 ? (
                        <Link to={emailPath}>
                            <div className="btn-add">
                                <Plus size={24} color="#4B369D"/>
                            </div>
                        </Link>
                    ) : (
                        <div className='meeting-list'>
                            {profiles.map(contact => <EmailCard contact={contact}/>)}
                        </div>
                    )}

                    <BottomNavBar />
                </div>
            )}
        </div>
    )
}
