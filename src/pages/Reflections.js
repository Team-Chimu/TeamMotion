import React from 'react';
import { useParams } from 'react-router-dom';
import HeaderBar from '../components/nav/HeaderBar';
import BottomNavBar from '../components/nav/BottomNavbar';
import AddButton from '../components/common/AddButton';
import CharterList from '../components/charters-page/CharterList';

export default function Reflections() {
    const { orgid, teamid } = useParams();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [posts, setPosts] = React.useState([]);

    const loadPosts = async () => {
        await fetch(`http://localhost:3001/api/board/${orgid}/${teamid}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(receivedPosts => {
                setPosts(receivedPosts);
                setIsLoaded(true);
            })
            .catch(error => {
                setIsLoaded(false);
                console.log("load data error:", error);
            })
    }
    React.useEffect(() => {
        loadPosts();
    }, []);

    const postPath = `/orgs/${orgid}/teams/${teamid}/reflections/create-post`;

    return (
        <div>
            {!isLoaded && <p>Loading...</p>}
            {isLoaded && (
                <div>
                    <HeaderBar screenname="Reflection" />
                    <AddButton path={postPath} isPurple={true} />
                    <CharterList name="Reflection" data_list={posts} />
                    <BottomNavBar />
                </div>
            )}
        </div>
    )
}