import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DB() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        // 서버에 '/show-file' 요청 보내기
        axios.get('/show-file')
            .then(response => {
                // JSON 형태의 데이터를 받아서 files 상태로 설정
                console.log(response.data);
                setFiles(response.data);
            })
            .catch(error => {
                console.error('Error fetching files:', error);
            });
    }, []);

    return (
        <div>
            <h1>Database</h1>
            <div>
                <h2>File List</h2>
                {files.length === 0 ? (
                    <p>No files available.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file, index) => (
                                <tr key={index}>
                                    <td>{file.id}</td>
                                    <td>{file.fileName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}