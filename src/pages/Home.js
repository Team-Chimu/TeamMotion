import React, { useState, useEffect } from 'react';
import Orgs from '../components/home/orgs';
import { Box }  from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import '@fontsource/poppins';

export default function Home() {
    const [self, setSelf] = useState(null);
    const [force, setForce] = useState(false);
    const [joinOrgId, setJoinOrgId] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const history = useHistory();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    
    function getSelf() {
        fetch('http://localhost:3001/api/users/self', {
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.status == 'success') {
                    setSelf(data)
                } else {
                    
                    history.push('/');
                }
            })
            .catch((error) => {
                console.log({status: 'error', error: 'fetch error'});
            });
    }

    function signout() {
        fetch('http://localhost:3001/login/signout', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => {
                if(data.status == 'success') {
                    history.push('/')
                } else {
                    console.log('unexpected error')
                }
            })
            .catch((error) => console.log('signout error', error));
    }

    function joinOrg() {
        if(joinOrgId != '' && joinCode != '') {
            fetch(`http://localhost:3001/api/org/${joinOrgId}/join`, {
                credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accessCode: joinCode
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.status == 'success') {
                    getSelf();
                }
            })
            .catch(error => console.log('error', error));
        }
    }
    
    useEffect(() => {
        getSelf();
        if (query.get('org')) {
            setJoinOrgId(query.get('org'));
            setForce(true);
            if(query.get('code')) {
                setJoinCode(query.get('code'));
            } 
        }
    }, []);

    // if self.status=='error', load login page
    // if self.status=='success', load orgs
    let page = (
        <div>
            <Box sx={{ typography: 'body1' }}>
                <p>Not logged in</p>
            </Box>
            <button onClick={e => {
                e.preventDefault();
                history.push('/');
            }}>Return Home</button>
        </div>
    );

    if(self != null && self.status == 'success') {
        // process orgs into div
        // process admin into div
        let greeting = (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '50px',
                marginBottom: '63px'
            }}>
                <div style={{
                    height: '70px',
                    width: '70px',
                    backgroundColor: '#EFEFEF',
                    borderRadius: '50%',
                    marginLeft: '39px',
                    marginRight: '28px'
                }}></div>
                <p style={{
                    color: '#4B369D',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '24px',
                    lineHeight: '36px'
                }}>Hi {self.displayName},<br></br>here are your teams:</p>
            </div>
        )
        page = (
            <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                    }}
            >
                {greeting}
                {Orgs(self.orgs, joinOrg,
                    joinOrgId, setJoinOrgId,
                    joinCode, setJoinCode,
                    force, setForce)}
                <div onClick={e => {
                    e.preventDefault();
                    signout();
                }} style={{
                    marginLeft: '280px',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}>
                    <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '27px',
                        color: '#4B369D',
                        marginRight: '10px'
                    }}>Sign Out</p>
                    <LogoutIcon size='large' sx={{color: '#4B369D'}}></LogoutIcon>
                </div>
            </div>
        );
    }
    return page;
}
