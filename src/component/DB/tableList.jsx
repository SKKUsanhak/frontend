import React from 'react';
import { TbTablePlus } from "react-icons/tb";
import axios from 'axios';
import './db.css';

export default function TableList({ tableList, selectedTableId, onTableSelect, fileId, fetchTables }) {

    const handleAddTable = async () => {
        const newTableName = prompt("새로운 테이블 이름을 입력하세요:");
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/create-new-table?fileid=${fileId}`;
            await axios.post(url, { contents: newTableName });
            alert("테이블이 성공적으로 추가되었습니다.");
            fetchTables(); // Fetch the updated table list
        } catch (error) {
            console.error("테이블 추가 중 오류 발생:", error);
            alert("테이블 추가 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className='table-list-container'>
            <h2 className='table-list-title'>테이블 목록</h2>
            <div className='table-list-header'>
                <TbTablePlus onClick={handleAddTable} className='add-table-button' size={24} />
            </div>
            {tableList.length === 0 ? (
                <p>No tables available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Table Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableList.map((table, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedTableId === table.id}
                                        onChange={() => onTableSelect(table.id)}
                                    />
                                </td>
                                <td>{table.id}</td>
                                <td>{table.tableTitle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
