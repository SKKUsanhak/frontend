import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { RiQuestionLine } from "react-icons/ri";
import { TbArrowBackUp } from "react-icons/tb";
import './tableData.css'

export default function TableData() {
    const { fileId, tableId } = useParams();
    const [tableData, setTableData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [table, setTable] = useState([]);
    const [editQueue, setEditQueue] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        axios.get(`/files/${fileId}/tables/${tableId}/datas`)
            .then(response => {
                setTableData(response.data);
            })
            .catch(error => {
                console.error('Error fetching table data:', error);
            });
    }, [fileId, tableId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSelectedCell(null);
                setDeleteEnabled(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef]);

    const handleHeaderContentChange = (index, value) => {
        const newColumns = [...columns];
        newColumns[index] = value;
        setColumns(newColumns);
    };

    const handleHeaderContentBlur = (fileId, tableId, index, value) => {
        setEditQueue([...editQueue, {
            method: 'patch',
            url: `/files/${fileId}/tables/${tableId}/columns/${index}`,
            data: { contents: value },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleMakeHeader = (fileId, tableId, columns) => {
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
            url: `/files/${fileId}/tables/${tableId}/columns/${newColumnIndex}`,
            data: { contents: newColumnName },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleMakeRow = (fileId, tableId, rows, columns, table) => {
        const newRowIndex = Math.max(...rows) + 1;
        const newRow = columns.map(columnName => ({ rowNumber: newRowIndex, columnName, contents: '' }));

        const newTable = [...table, newRow];
        setRows([...rows, newRowIndex]);
        setTable(newTable);
        setEditQueue([...editQueue, {
            method: 'post',
            url: `/files/${fileId}/tables/${tableId}/rows/${newRowIndex}`,
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleDeleteRow = (fileId, tableId, rowIndex) => {
        const actualRowIndex = rowIndex + 2;
        if (!selectedCell) return;
        if (isNaN(actualRowIndex) || !rows.includes(actualRowIndex)) {
            alert("유효하지 않은 행 번호입니다.");
            return;
        }
        const confirmDelete = window.confirm(`정말로 ${rowIndex} 행을 삭제하시겠습니까?`);
        if (!confirmDelete) return;
        axios.delete(`/files/${fileId}/tables/${tableId}/rows/${actualRowIndex}`)
            .then(() => {
                alert("행 삭제 성공");
                const newTable = table.filter(row => row[0].rowNumber !== actualRowIndex)
                                      .map((row, index) => row.map(cell => ({
                                          ...cell, 
                                          rowNumber: index + 2
                                      })));
                const newRows = newTable.map(row => row[0].rowNumber);
                setTable(newTable);
                setRows(newRows);
                setSelectedCell(null);
                setDeleteEnabled(false);
            })
            .catch(error => {
                console.error("Error deleting row:", error);
                alert("Error deleting the row.");
            });
    };

    const handleDeleteColumn = (fileId, tableId, columnIndex) => {
        if (!selectedCell) return;
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= columns.length) {
            alert("유효한 열 번호를 입력하세요.");
            return;
        }
        const confirmDelete = window.confirm(`정말로 ${columns[columnIndex]} 열을 삭제하시겠습니까?`);
        if (!confirmDelete) return;
        axios.delete(`/files/${fileId}/tables/${tableId}/columns/${columnIndex}`)
            .then(() => {
                alert("열 삭제 성공");
                const newColumns = columns.filter((_, idx) => idx !== columnIndex);
                setColumns(newColumns);
                const newTable = table.map(row => row.filter((_, idx) => idx !== columnIndex));
                setTable(newTable);
                setSelectedCell(null);
                setDeleteEnabled(false);
            })
            .catch(error => {
                console.error("열 삭제 중 오류 발생:", error);
                alert("열 삭제 실패");
            });
    };

    const handleCellChange = (rowIndex, cellIndex, value) => {
        const newTable = [...table];
        newTable[rowIndex][cellIndex].contents = value;
        setTable(newTable);
    };

    const handleCellBlur = (fileId, tableId, rowIndex, cellIndex, value) => {
        setEditQueue([...editQueue, {
            method: 'patch',
            url: `/files/${fileId}/tables/${tableId}/columns/${cellIndex}/rows/${rowIndex+2}`,
            data: { contents: value },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleCellClick = (rowIndex, cellIndex) => {
        setSelectedCell({ rowIndex, cellIndex });
        setDeleteEnabled(true);
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
            if (toggle) {
                const finalResponse = await axios.post(`/files/${fileId}/finalTables/${tableId}`);
                if (finalResponse.status === 200) {
                    alert('최종 데이터로 전환되었습니다.');
                } else {
                    alert('최종 데이터 전환 실패');
                }
            }
            const updateDate = await axios.patch(`/files/${fileId}/updateDate`);
            if(updateDate.status === 200){
                console.log('최종 수정일 업데이트 완료');
            } else {
                console.log('최종 수정일 업데이트 실패');
            }
            fetchData(fileId, tableId);
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
        <div className='excel-editor-container'>
            <div className='back-button-container' onClick={() => navigate(-1)}>
                <TbArrowBackUp className='back-icon' size={24} />
                <span>테이블 목록으로 돌아가기</span>
            </div>
            <div ref={containerRef}>
                <div className='excel-editor'>
                    <div className='table-section'>
                        <div className='table-data-container'>
                            <table className='db-table'>
                                <thead>
                                    <tr className='first-column'>
                                        <th>#</th>
                                        {columns.map((col, index) => (
                                            <th key={index}>{index}</th>
                                        ))}
                                    </tr>
                                    <tr>
                                        <th> </th>
                                        {columns.map((col, index) => (
                                            <th key={index}>
                                                <input
                                                    type="text"
                                                    value={col}
                                                    onChange={(e) => handleHeaderContentChange(index, e.target.value)}
                                                    onBlur={(e) => handleHeaderContentBlur(fileId, tableId, index, e.target.value)}
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
                                                                : ''
                                                    }
                                                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                                                >
                                                    <input
                                                        type="text"
                                                        value={cell.contents}
                                                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                        onBlur={(e) => handleCellBlur(fileId, tableId, rowIndex, cellIndex, e.target.value)}
                                                        className={selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.cellIndex === cellIndex ? 'highlight-input' : ''}
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
                            <button className="add-button" onClick={() => handleMakeRow(fileId, tableId, rows, columns, table)}>행 추가</button>
                            <button className="delete-button" onClick={() => handleDeleteRow(fileId, tableId, selectedCell ? selectedCell.rowIndex : null)} disabled={!deleteEnabled}>행 삭제</button>
                        </div>
                        <div className='button-group'>
                            <button className="add-button" onClick={() => handleMakeHeader(fileId, tableId, columns)}>열 추가</button>
                            <button className="delete-button" onClick={() => handleDeleteColumn(fileId, tableId, selectedCell ? selectedCell.cellIndex : null)} disabled={!deleteEnabled}>열 삭제</button>
                        </div>
                        <div className='save-button-group'>
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
                            <button className='save-button' onClick={handleSaveChanges}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
