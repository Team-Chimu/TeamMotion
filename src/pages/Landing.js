import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ReactComponent as TadashiIcon } from '../assets/tadashi-icon.svg';
import '@fontsource/poppins';

export default function Landing() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function getStatus() {
        fetch('http://localhost:3001/api/users/self', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.status == 'success') {
                    history.push('/home');
                }
            })
    }

    function attemptLogin() {
        fetch('http://localhost:3001/login/signin', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success') {
                console.log(email);
                console.log(password);
                history.push('/home');
            } else {
                // failed login behavior
                console.log('login failed');
            }
        })
        .catch(e => { console.log(e)} );
    }

    useEffect(() => {
        getStatus();
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
                color: '#4B369D',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '24px',
                marginTop: '50px',
                marginBottom: '19px',
                lineHeight: '36px',
                textAlign: 'center'
            }}>Welcome back to</h1>
            <TadashiIcon style={{ marginLeft: '30vw' }} />
            <h1 style={{
                color: '#4B369D',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '72px',
                textAlign: 'center'
            }}>Tadashi</h1>
            <p style={{
                color: '#4B369D',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '18px',
                marginLeft: '45px',
                marginTop: '30px'
            }}>Email</p>
            <input type='text' onChange={t => setEmail(t.target.value)} required
                style={{
                    border: '1px solid #4B369D',
                    boxSizing: 'border-box',
                    borderRadius: '15px',
                    background: '#FFFFFF',
                    width: '362px',
                    height: '50px',
                    fontFamily: 'Poppins, sans-serif',
                    marginLeft: '32px',
                    color: '#4B369D'
                }}
            />
            <p style={{
                color: '#4B369D',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '18px',
                marginLeft: '45px'
            }}>Password</p>
            <input type='password' onChange={t => setPassword(t.target.value)} required
                style={{
                    border: '1px solid #4B369D',
                    boxSizing: 'border-box',
                    borderRadius: '15px',
                    background: '#FFFFFF',
                    width: '362px',
                    height: '50px',
                    fontFamily: 'Poppins, sans-serif',
                    marginLeft: '32px',
                    color: '#4B369D'
                }}
            />
            <div style={{
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '18px',
                color: '#4B369D',
                marginLeft: '100px',
                marginTop: '36px'
            }}>Don't have an account? <Link to='/signup'><b>Sign up</b></Link></div>
            <button onClick={e => {
                e.preventDefault();
                attemptLogin();
            }} style={{
                width: '173px',
                height: '59px',
                marginTop: '15px',
                marginLeft: '133px',
                backgroundColor: '#4B369D',
                borderRadius: '15px',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '27px'
            }}>Let's Go!</button>
        </div>
    );
}