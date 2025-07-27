import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AuthForm.module.css';

export default function RegisterForm() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const { register } = useAuth();
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
            await register(user);
            navigate('/dashboard');
        } catch (error) {
            throw error;
        }
    }

    return (
        <>
            <h2>Create New Account</h2>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        value={user.username} 
                        onChange={handleChange}
                        placeholder="Username"
                    ></input>
                    <input 
                        type="email" 
                        name="email" 
                        value={user.email} 
                        onChange={handleChange}
                        placeholder="Email"
                    ></input>
                    <input 
                        type="password" 
                        name="password" 
                        value={user.password} 
                        onChange={handleChange}
                        placeholder="Password"
                    ></input>
                    <button className={styles.button} type="submit">Register</button>
                </form>
            </div>
        </>
    )
}