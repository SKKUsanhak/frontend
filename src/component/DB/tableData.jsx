import React, { useState } from 'react';
import axios from 'axios';

export default function TableData({ tableData, tableId, fetchData }) {
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [newHeaderContent, setNewHeaderContent] = useState('');

    if (!tableData || tableData.length === 0) {
        return <p>No table data available.</p>;
    }

    // Extract unique column names
    const columns = [...new Set(tableData.map(item => item.columnName))];
    // Extract unique row numbers
    const rows = [...new Set(tableData.map(item => item.rowNumber))];

    // Create a 2D array to represent the table
    const table = rows.map(rowNum => {
        const row = tableData.filter(item => item.rowNumber === rowNum);
        return columns.map(colName => {
            const cell = row.find(item => item.columnName === colName);
            return cell ? { ...cell, contents: cell.contents } : { rowNumber: rowNum, columnName: colName, contents: '' };
        });
    });

    const handleCellClick = (cell) => {
        setSelectedCell(cell);
        setNewContent(cell.contents);
        setSelectedHeader(null);  // Deselect header when a cell is selected
    };

    const handleHeaderClick = (cellIndex, cellName) => {
        setSelectedHeader({ cellIndex, cellName });
        setNewHeaderContent(cellName);
        setSelectedCell(null);  // Deselect cell when a header is selected
    };

    const handleContentChange = (e) => {
        setNewContent(e.target.value);
    };

    const handleHeaderContentChange = (e) => {
        setNewHeaderContent(e.target.value);
    };

    const handleUpdateClick = () => {
        if (selectedCell) {
            const { id } = selectedCell;
            axios.patch(`/update-cell?cellid=${id}`, { contents: newContent })
                .then(response => {
                    if (response.status === 200) {
                        alert('업데이트 성공.');
                        fetchData();
                        setSelectedCell({ ...selectedCell, contents: newContent });
                    } else {
                        alert('업데이트 실패');
                    }
                })
                .catch(error => {
                    alert('오류가 발생했습니다.');
                    console.error('Error:', error);
                });
        }
    };

    const handleHeaderUpdateClick = () => {
        if (selectedHeader) {
            const { cellIndex } = selectedHeader;
            axios.patch(`/update-column-name?tableid=${tableId}&columnnumber=${cellIndex}`, { contents: newHeaderContent })
                .then(response => {
                    if (response.status === 200) {
                        alert('열 업데이트 성공.');
                        fetchData();
                        setSelectedHeader({ ...selectedHeader, cellName: newHeaderContent });
                    } else {
                        alert('열 업데이트 실패');
                    }
                })
                .catch(error => {
                    alert('오류가 발생했습니다.');
                    console.error('Error:', error);
                });
        }
    };

    // const handleMakeHeader = () => {
    //     const newColumnName = prompt("새로운 열 이름을 입력하세요:");
        
    //     if (!newColumnName) {
    //         alert("열 이름을 입력하지 않았습니다.");
    //         return;
    //     }
    
    //     // 새로운 열의 인덱스 계산
    //     const newColumnIndex = columns.length;
    
    //     // 서버에 새로운 열 생성 요청 보내기
    //     axios.post('/create-new-column', { contents: newColumnName }, {
    //         params: {
    //             tableid: tableId,
    //             colindex: newColumnIndex
    //         },
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => {
    //         if (response.status === 200) {
    //             alert('새로운 열이 성공적으로 추가되었습니다.');
    //             // 여기서부터 cell 추가 반복 시행
    //             const newCells = rows.map(rowNumber => ({
    //                 tableId: tableId,
    //                 row: rowNumber,
    //                 column: newColumnIndex,
    //                 contents: ''
    //             }));
    
    //             Promise.all(newCells.map(cell => (
    //                 axios.post('/create-new-cell', cell, {
    //                     headers: {
    //                         'Content-Type': 'application/json'
    //                     }
    //                 })
    //             )))
    //             .then(() => {
    //                 console.log('빈 셀 생성 성공.');
    //                 fetchData();
    //             })
    //             .catch(error => {
    //                 console.log('빈 셀 생성 실패.');
    //                 console.error('Error:', error);
    //             });
    
    //         } else {
    //             alert('새로운 열 생성 실패');
    //         }
    //     })
    //     .catch(error => {
    //         alert('열 생성 중 오류가 발생했습니다.');
    //         console.error('Error:', error);
    //     });
    // };
    
    

    return (
        <div>
            <div className='excel-editor'>
                <div className='table-section'>
                    <div className='table-data-container'>
                        <table className='db-table'>
                            <thead>
                                <tr>
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className={selectedHeader && selectedHeader.cellIndex === index ? 'highlight-cell' : ''}
                                            onClick={() => handleHeaderClick(index, col)}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className={selectedCell && selectedCell.rowNumber === cell.rowNumber && selectedCell.columnNumber === cell.columnNumber ? 'highlight-cell' : ''}
                                                onClick={() => handleCellClick(cell)}
                                            >
                                                {cell.contents}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='control-section'>
                    {selectedCell && (
                        <div className='selected-cell-info'>
                            <p>현재 선택한 셀</p>
                            <p>행: {selectedCell.rowNumber} / 열: {selectedCell.columnName}</p>
                            <p>데이터: {selectedCell.contents}</p>
                            <input 
                                type="text" 
                                value={newContent} 
                                onChange={handleContentChange}
                            />
                            <button onClick={handleUpdateClick}>수정</button>
                        </div>
                    )}
                    {selectedHeader && (
                        <div>
                            <div className='selected-header-info'>
                                <p>현재 선택한 열</p>
                                <p>행: 1</p>
                                <p>데이터: {selectedHeader.cellName}</p>
                                <input
                                    type="text"
                                    value={newHeaderContent}
                                    onChange={handleHeaderContentChange}
                                />
                                <button onClick={handleHeaderUpdateClick}>수정</button>
                            </div>
                        </div>
                    )}
                    {/* <div>
                        <button onClick={handleMakeHeader}>열 추가</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
