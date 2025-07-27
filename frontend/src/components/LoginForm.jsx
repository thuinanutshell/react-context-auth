import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AuthForm.module.css';

export default function LoginForm() {
    const [user, setUser] = useState({
        login: "",
        password: ""
    })
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-useless-catch
        try {
            await login(user);
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    }

    return (
        <>
            <h2>Login</h2>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input name="login" value={user.login} onChange={handleChange} placeholder="Username or Email"></input>
                    <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password"></input>
                    <button className={styles.button} type="submit">Login</button>
                </form>
            </div>
        </>
    )
}