import React from 'react';

export default function FileList({ files, selectedFileId, onFileSelect }) {
    return (
        <div>
            <h2>파일 목록</h2>
            {files.length === 0 ? (
                <p>No files available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>File Name</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}