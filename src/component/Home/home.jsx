import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { MdOutlineUploadFile } from "react-icons/md";
import { TbDatabase } from "react-icons/tb";

export default function Home() {
    return (
        <div className='main-container'>
            <div className='home-container'>
                <div className="auth-buttons">
                    <Link to="/login" className="auth-button">로그인</Link>
                    <Link to="/register" className="auth-button">회원가입</Link>
                </div>
                <div className="main-content">
                    <div className="main-button">
                        <Link to="/buildings/upload" className="icon-1">
                            <MdOutlineUploadFile className="icon" />
                            <span className="text">Upload</span>
                        </Link>
                    </div>
                    <div className="main-button">
                        <Link to="/buildings" className="icon-2">
                            <TbDatabase className="icon" />
                            <span className="text">Database</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
