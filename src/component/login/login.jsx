// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // 기본적인 로그인 로직 (여기서는 username: admin, password: password가 올바른 자격 증명이라고 가정)
        if (username === 'admin' && password === 'password') {
            alert('Login successful!');
            // 여기서 실제 로그인 로직을 구현할 수 있습니다. 예를 들어, JWT 토큰을 저장하거나, 다른 페이지로 리디렉션하는 등의 작업
        } else {
            setError('Invalid username or password');
        }
    };

    const redirectRegister = () => {
        navigate('/register');
    };

    return (
        <div className='main-container'>
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">ID</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className='login-button'>
                        <button type="submit">로그인</button>
                        <button type="button" onClick={redirectRegister}>회원가입</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
