import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiQuestionLine } from "react-icons/ri";
import './tableData.css'

export default function TableData({ fileId, tableData, tableId, fetchData, isFinal }) {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [table, setTable] = useState([]);
    const [editQueue, setEditQueue] = useState([]);
    const [toggle, setToggle] = useState();
    const [selectedCell, setSelectedCell] = useState(null); // 추가된 상태
    const [deleteEnabled, setDeleteEnabled] = useState(false); // 버튼 활성화 상태

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
        if (!selectedCell) return; // 선택된 셀이 없으면 리턴

        const rowIndex = selectedCell.rowIndex + 2; // 선택된 셀의 행 번호
        if (isNaN(rowIndex) || !rows.includes(rowIndex)) {
            alert("유효하지 않은 행 번호입니다.");
            return;
        }
    
        setEditQueue([...editQueue, {
            method: 'delete',
            url: '/delete-row',
            params: { tableid: tableId, rowindex: rowIndex },
            headers: { 'Content-Type': 'application/json' }
        }]);
    
        const newTable = table.filter(row => row[0].rowNumber !== rowIndex).map((row, index) =>
            row.map(cell => ({ ...cell, rowNumber: index + 2 }))
        );
        const newRows = newTable.map(row => row[0].rowNumber);
    
        setTable(newTable);
        setRows(newRows);
        setSelectedCell(null); // 선택된 셀 초기화
        setDeleteEnabled(false); // 버튼 비활성화
    };
    
    const handleDeleteColumn = () => {
        if (!selectedCell) return; // 선택된 셀이 없으면 리턴

        const columnIndex = selectedCell.cellIndex;
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
        setSelectedCell(null); // 선택된 셀 초기화
        setDeleteEnabled(false); // 버튼 비활성화
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

    // 선택된 셀을 처리하는 함수
    const handleCellClick = (rowIndex, cellIndex) => {
        if (cellIndex !== 0) { // 첫 번째 열은 하이라이트하지 않음
            setSelectedCell({ rowIndex, cellIndex }); // 선택된 셀 상태 업데이트
            setDeleteEnabled(true); // 버튼 활성화
        }
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
            if(toggle) {
                axios.post('/save-final-table', null, {
                    params: { tableid: tableId } ,
                    headers: { 'Content-Type': 'application/json' }
                })
                alert('최종 데이터로 전환되었습니다.')
            }
            axios.patch('/update-date', null, {
                params: { fileid: fileId }
            })
            fetchData();
            setEditQueue([]);
        } catch (error) {
            alert('오류가 발생했습니다.');
            console.error('Error:', error);
            setEditQueue([]);
        }
    };

    const handleToggleChange = () => {
        setToggle(!toggle);
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
                                            <td
                                                key={cellIndex}
                                                className={
                                                    selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.cellIndex === cellIndex
                                                        ? 'highlight-cell highlight-cell-border highlight-cell-background'
                                                        : selectedCell && (selectedCell.rowIndex === rowIndex || selectedCell.cellIndex === cellIndex)
                                                            ? 'highlight-cell'
                                                            : '' /* 선택된 셀 테두리 강조 및 하이라이트 */
                                                }
                                                onClick={() => handleCellClick(rowIndex, cellIndex)} // 셀 클릭 시 선택된 셀 업데이트
                                            >
                                                <input
                                                    type="text"
                                                    value={cell.contents}
                                                    onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                    onBlur={(e) => handleCellBlur(rowIndex, cellIndex, e.target.value)}
                                                    className={selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.cellIndex === cellIndex ? 'highlight-input' : ''} /* 선택된 셀의 input 강조 */
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
                        <button onClick={handleDeleteRow} disabled={!deleteEnabled}>행 삭제</button> {/* 선택된 셀이 없으면 버튼 비활성화 */}
                    </div>
                    <div className='button-group'>
                        <button onClick={handleMakeHeader}>열 추가</button>
                        <button onClick={handleDeleteColumn} disabled={!deleteEnabled}>열 삭제</button> {/* 선택된 셀이 없으면 버튼 비활성화 */}
                    </div>
                    <div className='save-button-group'>
                        {!isFinal && ( // isFinal이 true가 아닌 경우에만 토글 스위치를 표시
                            <div className="toggle-container">
                                <label className='toggle-switch'>
                                    <input type='checkbox' checked={toggle} onChange={handleToggleChange} />
                                    <span className='slider'></span>
                                </label>
                                <div className="tooltip-container">
                                    <RiQuestionLine className='question' />
                                    <div className="tooltip">토글 시 최종 데이터로 저장되며, 관리자만 수정 가능해집니다.</div>
                                </div>
                            </div>
                        )}
                        <button className='save-button' onClick={handleSaveChanges}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}