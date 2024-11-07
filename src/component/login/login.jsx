// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.jwt;  // 서버로부터 받은 JWT 토큰
                const user = username; // 서버로부터 받은 사용자명
                localStorage.setItem('token', token);  // JWT 토큰을 로컬스토리지에 저장
                localStorage.setItem('username', user);
                alert('Login successful!');
                window.location.reload(); // 로그아웃 후 페이지 새로고침
                navigate('/');  // 로그인 성공 시 홈으로 이동
            } else {
                const errorData = await response.text();
                setError(errorData || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred: ' + error.message);
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
