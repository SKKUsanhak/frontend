import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export default function Home() {
    return (
        <div className="home-container">
            <div className="auth-buttons">
                <Link to="/login" className="button">로그인</Link>
                <Link to="/register" className="button">회원가입</Link>
            </div>
            <div className="main-content">
                <Link to="/upload" className='button' />
                <Link to="/database" className='button' />
            </div>
        </div>
    );
}