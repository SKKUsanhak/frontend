import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableData({ tableData, tableId, fetchData }) {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [table, setTable] = useState([]);
    const [editQueue, setEditQueue] = useState([]);

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            const uniqueColumns = [...new Set(tableData.map(item => item.columnName))];
            const uniqueRows = [...new Set(tableData.map(item => item.rowNumber))];
            setColumns(uniqueColumns);
            setRows(uniqueRows);
            const newTable = uniqueRows.map(rowNum => {
                const row = tableData.filter(item => item.rowNumber === rowNum);
                return uniqueColumns.map(colName => {
                    const cell = row.find(item => item.columnName === colName);
                    return cell ? { ...cell, contents: cell.contents } : { rowNumber: rowNum, columnName: colName, contents: '' };
                });
            });
            setTable(newTable);
        }
    }, [tableData]);

    const handleHeaderContentChange = (index, value) => {
        const newColumns = [...columns];
        newColumns[index] = value;
        setColumns(newColumns);
    };

    const handleHeaderContentBlur = (index, value) => {
        setEditQueue([...editQueue, {
            method: 'patch',
            url: '/update-column-name',
            params: { tableid: tableId, columnnumber: index },
            data: { contents: value },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleMakeHeader = () => {
        const newColumnName = prompt("새로운 열 이름을 입력하세요:");
        if (!newColumnName) {
            alert("열 이름을 입력하지 않았습니다.");
            return;
        }

        const newColumnIndex = columns.length;
        const newTable = table.map(row => [...row, { rowNumber: row[0].rowNumber, columnName: newColumnName, contents: '' }]);
        
        setColumns([...columns, newColumnName]);
        setTable(newTable);
        setEditQueue([...editQueue, {
            method: 'post',
            url: '/create-new-column',
            data: { contents: newColumnName },
            params: { tableid: tableId, colindex: newColumnIndex },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleMakeRow = () => {
        const newRowIndex = Math.max(...rows) + 1;
        const newRow = columns.map(columnName => ({ rowNumber: newRowIndex, columnName, contents: '' }));

        const newTable = [...table, newRow];
        setRows([...rows, newRowIndex]);
        setTable(newTable);
        setEditQueue([...editQueue, {
            method: 'post',
            url: '/create-new-row',
            params: { tableid: tableId, rowindex: newRowIndex },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleDeleteRow = () => {
        const rowIndex = parseInt(prompt("삭제할 행 번호를 입력하세요:"), 10);
        if (isNaN(rowIndex) || !rows.includes(rowIndex + 2)) {
            alert("유효하지 않은 행 번호입니다.");
            return;
        }
    
        setEditQueue([...editQueue, {
            method: 'delete',
            url: '/delete-row',
            params: { tableid: tableId, rowindex: rowIndex + 2 },
            headers: { 'Content-Type': 'application/json' }
        }]);
    
        const newTable = table.filter(row => row[0].rowNumber !== rowIndex + 2).map((row, index) =>
            row.map(cell => ({ ...cell, rowNumber: index + 2 }))
        );
        const newRows = newTable.map(row => row[0].rowNumber);
    
        setTable(newTable);
        setRows(newRows);
    };
    
    const handleDeleteColumn = () => {
        const columnIndex = parseInt(prompt("삭제할 열 번호를 입력하세요:"), 10);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= columns.length) {
            alert("유효한 열 번호를 입력하세요.");
            return;
        }

        setEditQueue([...editQueue, {
            method: 'delete',
            url: '/delete-column',
            params: { tableid: tableId, columnindex: columnIndex },
            headers: { 'Content-Type': 'application/json' }
        }]);

        const newTable = table.map(row => row.filter((_, index) => index !== columnIndex));
        const newColumns = columns.filter((_, index) => index !== columnIndex);

        setTable(newTable);
        setColumns(newColumns);
    };

    const handleCellChange = (rowIndex, cellIndex, value) => {
        const newTable = [...table];
        newTable[rowIndex][cellIndex].contents = value;
        setTable(newTable);
    };

    const handleCellBlur = (rowIndex, cellIndex, value) => {
        const cell = table[rowIndex][cellIndex];
        setEditQueue([...editQueue, {
            method: 'patch',
            url: '/update-cell',
            data: {
                tableId: tableId,
                row: cell.rowNumber,
                column: cell.columnNumber,
                contents: value
            },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };
    
    const handleSaveChanges = async () => {
        try {
            for (const request of editQueue) {
                const response = await axios(request);
                if (response.status !== 200) {
                    alert('일부 변경 사항 저장 실패');
                    setEditQueue([]);
                    return;
                }
            }
            alert('모든 변경 사항이 성공적으로 저장되었습니다.');
            fetchData();
            setEditQueue([]);
        } catch (error) {
            alert('오류가 발생했습니다.');
            console.error('Error:', error);
            setEditQueue([]);
        }
    };

    return (
        <div>
            <div className='excel-editor'>
                <div className='table-section'>
                    <div className='table-data-container'>
                        <table className='db-table'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {columns.map((col, index) => (
                                        <th key={index}>{index}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th></th>
                                    {columns.map((col, index) => (
                                        <th key={index}>
                                            <input
                                                type="text"
                                                value={col}
                                                onChange={(e) => handleHeaderContentChange(index, e.target.value)}
                                                onBlur={(e) => handleHeaderContentBlur(index, e.target.value)}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{rowIndex}</td>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>
                                                <input
                                                    type="text"
                                                    value={cell.contents}
                                                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                    onBlur={(e) => handleCellBlur(rowIndex, cellIndex, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='control-section'>
                    <div className='button-group'>
                        <button onClick={handleMakeRow}>행 추가</button>
                        <button onClick={handleDeleteRow}>행 삭제</button>
                    </div>
                    <div className='button-group'>
                        <button onClick={handleMakeHeader}>열 추가</button>
                        <button onClick={handleDeleteColumn}>열 삭제</button>
                    </div>
                    <div className='button-group'>
                        <button onClick={handleSaveChanges}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
