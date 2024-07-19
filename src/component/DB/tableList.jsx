import React from 'react';

export default function TableList({ tableList, selectedTableId, onTableSelect }) {
    return (
        <div className='table-list-container'>
            <h2>테이블 목록</h2>
            {tableList.length === 0 ? (
                <p>No tables available.</p>
            ) : (
                <table className='table'>
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