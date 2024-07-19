import React from 'react';
import './db.css';

export default function FileList({ files, selectedFileId, onFileSelect }) {
    return (
        <div className='file-list-container'>
            <h2>파일 목록</h2>
            {files.length === 0 ? (
                <p>No files available.</p>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>File ID</th>
                            <th>File Name</th>
                            <th>Upload Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedFileId === file.id}
                                        onChange={() => onFileSelect(file.id)}
                                    />
                                </td>
                                <td>{file.id}</td>
                                <td>{file.fileName}</td>
                                <td>{file.createTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}