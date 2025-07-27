import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1>Welcome {user?.username}! You are authenticated!</h1>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}