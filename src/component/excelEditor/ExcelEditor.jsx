import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import './ExcelEditor.css';
import { useCellSelection } from './SelectCell';
import { useRowHandler } from './RowHandler';
import { useColumnHandler } from './ColumnHandler';
import { UploadHandler } from './UploadHandler';

export default function ExcelEditor() {
    const location = useLocation(); // 파일 로딩을 위한 location
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0); // 현재 시트 인덱스 추가
    const [data, setData] = useState([]); // 테이블 데이터 추가
    const [rowIndex, setRowIndex] = useState(0); // 행 인덱싱 추가
    const [colIndex, setColIndex] = useState(0); // 열 인덱싱 추가
    const [ColumnRanges, setColumnRanges] = useState({}); // 열 범위 추가

    const { // 셀 선택 함수 묶음
        selectedCells,
        handleMouseDown,
        handleMouseOver,
        handleMouseUp,
        handleTableMouseDown,
    } = useCellSelection();

    const { // 열 컨트롤 함수들 
        handleAddRow, 
        handleDeleteRow 
    } = useRowHandler(data, setData, currentSheetIndex);

    const { // 행 컨트롤 함수들
        handleAddColumn,
        handleDeleteColumn 
    } = useColumnHandler(data, setData, currentSheetIndex);

    useEffect(() => { // 파일 로딩 후 data로 엑셀 파일 매핑 
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

                    const columns = new Array(maxColumns).fill(''); // 초기 열 상태 설정

                    sheets.push({ rows: normalizedRows, columns: columns });
                });

                setData(sheets);
            });
        }
    }, [location.state]);

    const handlePrevSheet = () => { // 이전 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
    };
      
    const handleNextSheet = () => { // 다음 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
    };

    const handleColumnRangeChange = (sheetIndex, e) => {
        const { name, value } = e.target;
        const intValue = parseInt(value, 10);
        const maxColumn = data[currentSheetIndex]?.columns.length - 1 ?? 0;

        if (intValue >= 0) { // 값이 0 이상인지 확인
            setColumnRanges(prevRanges => ({
                ...prevRanges,
                [sheetIndex]: {
                    ...prevRanges[sheetIndex],
                    [name]: Math.min(intValue, maxColumn)
                }
            }));
        }
    };

    const handleCellChange = (rowIndex, cellIndex, value) => { // 셀 변경 적용
        const newData = [...data];
        newData[currentSheetIndex].rows[rowIndex][cellIndex] = value;
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
                    onChange={(e) => setRowIndex(e.target.value === '' ? '' : Math.min(Number(e.target.value), data[currentSheetIndex]?.rows.length ?? 0))}
                    placeholder="행 지정"
                    min="0"
                    max={data[currentSheetIndex]?.rows.length ?? 0}
                />
                <button onClick={() => handleAddRow(rowIndex)}>행 추가</button>
                <button onClick={() => handleDeleteRow(rowIndex)}>행 삭제</button>

            </div>

            <div className="Colcontrols"> {/* 열 추가 및 삭제 버튼 */ }

                <input
                    type="number"
                    value={colIndex}
                    onChange={(e) => setColIndex(e.target.value === '' ? '' : Math.min(Number(e.target.value), data[currentSheetIndex]?.columns.length ?? 0))}
                    placeholder="열 지정"
                    min="0"
                    max={data[currentSheetIndex]?.columns.length ?? 0}
                />
                <button onClick={() => handleAddColumn(colIndex)}>열 추가</button>
                <button onClick={() => handleDeleteColumn(colIndex)}>열 삭제</button>

            </div>

            <div className="ColumnRanges">
                <h3> 현재 시트의 행 범위 지정 </h3>
                <input
                    type="number"
                    name="startColumn"
                    placeholder="시작 열"
                    value={ColumnRanges[currentSheetIndex]?.startColumn !== undefined ? ColumnRanges[currentSheetIndex]?.startColumn : ''}
                    min="0"
                    max={data[currentSheetIndex]?.columns.length - 1 ?? 0}
                    onChange={(e) => handleColumnRangeChange(currentSheetIndex, e)}
                />
                <input
                    type="number"
                    name="endColumn"
                    placeholder="종료 열"
                    value={ColumnRanges[currentSheetIndex]?.endColumn !== undefined ? ColumnRanges[currentSheetIndex]?.endColumn : ''}
                    min="0"
                    max={data[currentSheetIndex]?.columns.length - 1 ?? 0}
                    onChange={(e) => handleColumnRangeChange(currentSheetIndex, e)}
                />
            </div>


            {/* 테이블 표기 부분 */ }
            <table className='table' onMouseDown={handleTableMouseDown}>
                <tbody> {/* 현재 시트에 대해서 데이터 열 순회 */ }
                    {Array.isArray(data[currentSheetIndex]?.rows) && data[currentSheetIndex].rows.map((row, rowIndex) => ( 
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
            <div>
                <button
                    className='upload-button'
                    onClick={() => UploadHandler(data, ColumnRanges)}
                >
                DB 업로드
                </button>
            </div>
        </div>
    );
}
