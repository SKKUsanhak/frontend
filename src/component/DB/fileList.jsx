import React from 'react';
import './db.css';
import { FaTrash } from "react-icons/fa";

export default function FileList({ files, selectedFileId, onFileSelect, onFileDelete}) {

    return (
        <div className='file-list-container'>
            <h2>파일 목록</h2>
            {files && files.length === 0 ? (
                <p>No files available.</p>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>File ID</th>
                            <th>File Name</th>
                            <th>Upload Date</th>
                            <th>Delete File</th>
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
                                <td>
                                    <button 
                                        className='trash-icon' 
                                        onClick={() => onFileDelete(file.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}