import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { RiQuestionLine } from "react-icons/ri";
import './tableData.css'
import { TbArrowBackUp } from "react-icons/tb";

export default function TableData({ fileId, tableData, tableId, fetchData, isFinal, BacktoTableList }) {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [table, setTable] = useState([]);
    const [editQueue, setEditQueue] = useState([]);
    const [toggle, setToggle] = useState();
    const [selectedCell, setSelectedCell] = useState(null); // 추가된 상태
    const [deleteEnabled, setDeleteEnabled] = useState(false); // 버튼 활성화 상태
    const containerRef = useRef(null);

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
    
        const newColumnIndex = columns.length; // 새로운 열 인덱스는 columns 배열의 길이
        console.log(newColumnIndex)
        const newTable = table.map(row => [...row, { rowNumber: row[0].rowNumber, columnName: newColumnName, contents: '' }]);
    
        setColumns([...columns, newColumnName]); // 열 목록 업데이트
        setTable(newTable); // 테이블 데이터 업데이트
        setEditQueue([...editQueue, {
            method: 'post',
            url: `/files/${fileId}/tables/${tableId}/columns/${newColumnIndex}`,
            data: { contents: newColumnName },
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleMakeRow = (fileId, tableId, rows, columns, table) => {
        const newRowIndex = Math.max(...rows) + 1; // 가장 큰 행 인덱스 계산 후 1을 추가
        const newRow = columns.map(columnName => ({ rowNumber: newRowIndex, columnName, contents: '' }));

        const newTable = [...table, newRow]; // 새로운 행을 테이블에 추가
        setRows([...rows, newRowIndex]); // 행 상태 업데이트
        setTable(newTable); // 테이블 상태 업데이트
        setEditQueue([...editQueue, {
            method: 'post',
            url: `/files/${fileId}/tables/${tableId}/rows/${newRowIndex}`,
            headers: { 'Content-Type': 'application/json' }
        }]);
    };

    const handleDeleteRow = (fileId, tableId, rowIndex, table, rows, setSelectedCell, setDeleteEnabled) => {
        // 실제 삭제할 행 번호 계산 (화면에 보이는 번호보다 2가 더 큰 값을 서버로 전송)
        const actualRowIndex = rowIndex + 2;
    
        if (!selectedCell) return; // 선택된 셀이 없으면 리턴
        if (isNaN(actualRowIndex) || !rows.includes(actualRowIndex)) {
            alert("유효하지 않은 행 번호입니다.");
            return;
        }
    
        const confirmDelete = window.confirm(`정말로 ${rowIndex} 행을 삭제하시겠습니까?`);
        if (!confirmDelete) return;
    
        axios.delete(`/files/${fileId}/tables/${tableId}/rows/${actualRowIndex}`)
            .then(() => {
                alert("행 삭제 성공");
    
                // 행 삭제 후 새 테이블 데이터 생성, 행 번호가 2부터 시작함을 고려
                const newTable = table.filter(row => row[0].rowNumber !== actualRowIndex)
                                      .map((row, index) => row.map(cell => ({
                                          ...cell, 
                                          // 행 번호를 새로 계산 (2를 더해줌)
                                          rowNumber: index + 2
                                      })));
                const newRows = newTable.map(row => row[0].rowNumber);
    
                setTable(newTable);
                setRows(newRows);
                setSelectedCell(null); // 선택된 셀 초기화
                setDeleteEnabled(false); // 버튼 비활성화
            })
            .catch(error => {
                console.error("Error deleting row:", error);
                alert("Error deleting the row.");
            });
    };

    const handleDeleteColumn = (fileId, tableId, columnIndex, columns, setColumns, table, setTable, setSelectedCell, setDeleteEnabled) => {
        if (!selectedCell) return; // 선택된 셀이 없으면 리턴
    
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= columns.length) {
            alert("유효한 열 번호를 입력하세요.");
            return;
        }
    
        const confirmDelete = window.confirm(`정말로 ${columns[columnIndex]} 열을 삭제하시겠습니까?`);
        if (!confirmDelete) return;
    
        axios.delete(`/files/${fileId}/tables/${tableId}/columns/${columnIndex}`)
            .then(() => {
                alert("열 삭제 성공");
                // 열 배열에서 해당 열 제거
                const newColumns = columns.filter((_, idx) => idx !== columnIndex);
                setColumns(newColumns);
                
                // 모든 행에서 해당 열의 데이터 제거
                const newTable = table.map(row => 
                    row.filter((_, idx) => idx !== columnIndex)
                );
                setTable(newTable);
    
                setSelectedCell(null); // 선택된 셀 초기화
                setDeleteEnabled(false); // 버튼 비활성화
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

    // 선택된 셀을 처리하는 함수
    const handleCellClick = (rowIndex, cellIndex) => {
        setSelectedCell({ rowIndex, cellIndex }); // 선택된 셀 상태 업데이트
        setDeleteEnabled(true); // 버튼 활성화
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
            }
            else{
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
            <div className='back-button-container' onClick={BacktoTableList}>
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
                                                                : '' /* 선택된 셀 테두리 강조 및 하이라이트 */
                                                    }
                                                    onClick={() => handleCellClick(rowIndex, cellIndex)} // 셀 클릭 시 선택된 셀 업데이트
                                                >
                                                    <input
                                                        type="text"
                                                        value={cell.contents}
                                                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                                        onBlur={(e) => handleCellBlur(fileId, tableId, rowIndex, cellIndex, e.target.value)}
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
                            <button className="add-button" onClick={() => handleMakeRow(fileId, tableId, rows, columns, table, setSelectedCell, setDeleteEnabled)}>행 추가</button>
                            <button className="delete-button" onClick={() => handleDeleteRow(fileId, tableId, selectedCell ? selectedCell.rowIndex : null, table, rows, setSelectedCell, setDeleteEnabled)} disabled={!deleteEnabled}>행 삭제</button>
                        </div>
                        <div className='button-group'>
                            <button className="add-button" onClick={() => handleMakeHeader(fileId, tableId, columns, table)}>열 추가</button>
                            <button className="delete-button" onClick={() => handleDeleteColumn(
                                fileId, tableId, selectedCell ? selectedCell.cellIndex : null, columns, setColumns,
                                table, setTable, setSelectedCell, setDeleteEnabled
                            )} disabled={!deleteEnabled}>열 삭제</button>
                        </div>
                        <div className='save-button-group'>
                            {!isFinal && (
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
                            <button className='save-button' onClick={() => handleSaveChanges(fileId, tableId, editQueue, toggle, setEditQueue, fetchData)}>저장</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
