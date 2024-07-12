import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import './ExcelEditor.css';
import { useCellSelection } from './SelectCell';
import { handleAddRow, handleDeleteRow } from './RowHandler';
import { handleAddColumn, handleDeleteColumn } from './ColumnHandler';

export default function ExcelEditor() {
    const location = useLocation();
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0); // 현재 시트 인덱스 추가
    const [data, setData] = useState([]); // 테이블 데이터 추가
    const [rowIndex, setRowIndex] = useState(0); // 행 인덱싱 추가
    const [colIndex, setColIndex] = useState(0); // 열 인덱싱 추가
    const [columns, setColumns] = useState([]); // 열 상태 추가

    const { // 셀 선택 함수 묶음
        selectedCells,
        handleMouseDown,
        handleMouseOver,
        handleMouseUp,
        handleTableMouseDown,
        
    } = useCellSelection();

    useEffect(() => {
        if (location.state && location.state.fileData) {
            const workbook = new ExcelJS.Workbook();
            const buffer = location.state.fileData;

            workbook.xlsx.load(buffer).then(() => {
                const sheets = [];
                workbook.worksheets.forEach((worksheet) => {
                    const rows = [];
                    let maxColumns = 0;

                    worksheet.eachRow((row) => {
                        const rowData = [];
                        row.eachCell({ includeEmpty: true }, (cell) => {
                            rowData.push(cell.value !== null ? cell.value : '');
                        });
                        rows.push(rowData);
                        if (rowData.length > maxColumns) {
                            maxColumns = rowData.length;
                        }
                    });

                    // 모든 행을 동일한 길이로 맞춤
                    const normalizedRows = rows.map(row => {
                        while (row.length < maxColumns) {
                            row.push(''); // 빈 셀을 빈 문자열로 채움
                        }
                        return row;
                    });

                    sheets.push(normalizedRows);
                });

                setData(sheets);
                if (sheets.length > 0 && sheets[0].length > 0) {
                    setColumns(new Array(sheets[0][0].length).fill('')); // 초기 열 상태 설정
                }
            });
        }
    }, [location.state]);

    const handlePrevSheet = () => { // 이전 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
    };
      
    const handleNextSheet = () => { // 다음 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
    };

    const addRow = () => {
        if (rowIndex >= 0 && rowIndex <= data.length) {
            handleAddRow(data, setData, columns, rowIndex, currentSheetIndex);
        }
    };

    const deleteRow = () => {
        if (rowIndex >= 0 && rowIndex < data[currentSheetIndex].length) {
            handleDeleteRow(data, setData, rowIndex, currentSheetIndex);
        }
    };

    const addColumn = () => {
        if (colIndex >= 0 && colIndex <= columns.length) {
            handleAddColumn(columns, setColumns, data, setData, colIndex, currentSheetIndex); // 열 추가 함수 호출
        }
    };

    const deleteColumn = () => {
        if (colIndex >= 0 && colIndex < columns.length) {
            handleDeleteColumn(columns, setColumns, data, setData, colIndex, currentSheetIndex); // 열 삭제 함수 호출
        }
    };

    const handleCellChange = (rowIndex, cellIndex, value) => {
        const newData = [...data];
        newData[currentSheetIndex][rowIndex][cellIndex] = value;
        setData(newData);
    };

    return (
        <div className="excel-editor" onMouseUp={handleMouseUp}>
            <h1>Excel Editor</h1>
            
            <div className="sheet-navigation"> {/* 테이블 간 이동 버튼 추가*/ }
                <button onClick={handlePrevSheet} disabled={data.length === 0}>
                    &lt; 이전 테이블
                </button>
                <span>Table {currentSheetIndex + 1} / {data.length}</span>
                <button onClick={handleNextSheet} disabled={data.length === 0}>
                    다음 테이블 &gt;
                </button>
            </div>
            <div className="Rowcontrols"> {/* 행 추가 및 삭제 버튼 */ }

                <input
                    type="number"
                    value={rowIndex}
                    onChange={(e) => setRowIndex(Number(e.target.value))}
                    placeholder="행 지정"
                    min="0"
                    max={data.length}
                />
                <button onClick={addRow}>행 추가</button>
                <button onClick={deleteRow}>행 삭제</button>

            </div>

            <div className="Colcontrols"> {/* 열 추가 및 삭제 버튼 */ }

                <input
                    type="number"
                    value={colIndex}
                    onChange={(e) => setColIndex(Number(e.target.value))}
                    placeholder="열 지정"
                    min="0"
                    max={columns.length}
                />
                <button onClick={addColumn}>열 추가</button>
                <button onClick={deleteColumn}>열 삭제</button>

            </div>
            {/* 테이블 표기 부분 */ }
            <table className='table' onMouseDown={handleTableMouseDown}>
                <tbody> {/* 현재 시트에 대해서 데이터 열 순회 */ }
                    {Array.isArray(data[currentSheetIndex]) && data[currentSheetIndex].map((row, rowIndex) => ( 
                        Array.isArray(row) && (
                            <tr key={rowIndex}>
                                {/* 현재 시트에 대해서 데이터 셀 순회 */ }
                                {row.map((cell, cellIndex) => (
                                    <td className='td'
                                        key={cellIndex}
                                        onMouseDown={(e) => handleMouseDown(e, rowIndex, cellIndex)}
                                        onMouseOver={(e) => handleMouseOver(e, rowIndex, cellIndex)}    
                                        style={{ backgroundColor: selectedCells.has(`${rowIndex}-${cellIndex}`) ? 'lightblue' : 'transparent' }} 
                                    >
                                        {/* 값 넣을시 변경 */ }
                                        <input
                                            className='input'
                                            type="text"
                                            value={cell || ''}
                                            onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}
