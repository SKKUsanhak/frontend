import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import './ExcelEditor.css';
import { useCellSelection } from './SelectCell';
import { useRowHandler } from './Handler/RowHandler';
import { useColumnHandler } from './Handler/ColumnHandler';
import { UploadHandler } from './Handler/UploadHandler';
import { MergeHandler } from './Handler/MergeHandler';
import { DownloadHandler } from './Handler/DownloadHandler';
import EditableFileName from './EditableFileName';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

export default function ExcelEditor() {
    const location = useLocation(); // 파일 로딩을 위한 location
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0); // 현재 시트 인덱스 추가
    const [data, setData] = useState([]); // 테이블 데이터 추가
    const [rowIndex, setRowIndex] = useState(0); // 행 인덱싱 추가
    const [colIndex, setColIndex] = useState(0); // 열 인덱싱 추가
    const [tableIndex, setTableIndex] = useState(0); // 테이블 인덱싱 추가
    const [ColumnRanges, setColumnRanges] = useState({}); // 열 범위 추가
    const [fileName, setFileName] = useState("");
    const [selectedCell, setSelectedCell] = useState(null); // 선택된 셀 상태 추가

    const { // 셀 선택 함수 묶음
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
            const loadedFileName = location.state.fileName;

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
                setFileName(loadedFileName);
            });
        }
    }, [location.state]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const container = document.querySelector('.table-container');
            if (container && !container.contains(event.target)) {
                setSelectedCell(null); // table-container 바깥쪽을 클릭하면 셀 선택 취소
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addTable = (index) => { // 테이블 생성
        const newData = [...data];
        const newTable = { rows: [['']], columns: [''] }; // 기본적으로 빈 테이블 생성

        if (index < 0 || index > newData.length) {
            index = newData.length;
        }

        newData.splice(index, 0, newTable);
        setData(newData);
        setCurrentSheetIndex(index);
    };

    const deleteTable = (index) => { // 테이블 삭제
        if (data.length > 0 && index >= 0 && index < data.length) {
            const newData = data.filter((_, i) => i !== index);
            setData(newData);
            setCurrentSheetIndex(newData.length > 0 ? Math.min(index, newData.length - 1) : 0);
        }
    };

    const handlePrevSheet = () => { // 이전 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
    };

    const handleNextSheet = () => { // 다음 시트로 이동
        setCurrentSheetIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
    };

    const handleColumnRangeChange = (sheetIndex, e) => { // 행 범위 변경
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

    const handleFileNameSave = (newFileName) =>{
        setFileName(newFileName);
    }

    // 선택된 셀을 처리하는 함수
    const handleCellClick = (rowIndex, cellIndex) => {
        setSelectedCell({ rowIndex, cellIndex }); // 선택된 셀 상태 업데이트
    };

    return (
        <div className="excel-editor-container">
            <div className="editor-header">
                <h1><EditableFileName initialFileName={fileName} onSave={handleFileNameSave}/></h1>
                {/* <h1 className="editor-title">Excel Editor</h1> */}
            </div>
            <div className="excel-editor" onMouseUp={handleMouseUp}>
                <div className="table-section">
                    {/* 테이블 표기 부분 */}
                    <div className="table-container">
                        <table className="table" onMouseDown={handleTableMouseDown}>
                            <thead>
                                <tr>
                                    <th></th>
                                    {Array.isArray(data[currentSheetIndex]?.rows[0]) && data[currentSheetIndex].rows[0].map((_, cellIndex) => (
                                        <th key={cellIndex}>{cellIndex}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data[currentSheetIndex]?.rows) && data[currentSheetIndex].rows.map((row, rowIndex) => (
                                    Array.isArray(row) && (
                                        <tr key={rowIndex}>
                                            <th>{rowIndex}</th>
                                            {row.map((cell, cellIndex) => (
                                                <td className={
                                                    selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.cellIndex === cellIndex
                                                    ? 'highlight-cell highlight-cell-border highlight-cell-background'
                                                    : selectedCell && (selectedCell.rowIndex === rowIndex || selectedCell.cellIndex === cellIndex)
                                                        ? 'highlight-row-column'
                                                        : '' /* 선택된 셀 테두리 강조 및 하이라이트 */
                                                }
                                                key={cellIndex}
                                                onMouseDown={(e) => {
                                                    handleMouseDown(e, rowIndex, cellIndex);
                                                    handleCellClick(rowIndex, cellIndex); // 셀 클릭 시 선택된 셀 업데이트
                                                }}
                                                onMouseOver={(e) => handleMouseOver(e, rowIndex, cellIndex)}
                                               
                                            >
                                                    <input
                                                        className="input"
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

                    <div className="sheet-navigation">

                        <button onClick={handlePrevSheet} disabled={data.length === 0}>
                            <FaArrowAltCircleLeft className="nav-icon"/>
                        </button>

                        <span>Table {currentSheetIndex + 1} / {data.length}</span>
                        <button onClick={handleNextSheet} disabled={data.length === 0}>
                            <FaArrowAltCircleRight className="nav-icon" />
                        </button>
                    </div>
                </div>

                <div className="controls-section">
                    <div className="Tablecontrols">
                        <input
                            type="number"
                            value={tableIndex}
                            onChange={(e) => {
                                const value = e.target.value === '' ? '' : Math.min(Math.max(Number(e.target.value), 1), data.length); // 사용자 입력값을 현재 테이블 범위 내로 제한
                                setTableIndex(value === '' ? '' : value);
                            }}
                            placeholder="테이블 번호 지정"
                            min="1"
                            max={data.length + 1}
                        />
                        <button onClick={() => addTable(tableIndex - 1)}>테이블 추가</button>
                        <button onClick={() => deleteTable(tableIndex - 1)}>테이블 삭제</button>
                    </div>

                    <div className="Rowcontrols">
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

                    <div className="Colcontrols">
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
                        <h3> 열 데이터 병합 범위 지정 </h3>
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
                        <MergeHandler
                            data={data}
                            setData={setData}
                            currentSheetIndex={currentSheetIndex}
                            ColumnRanges={ColumnRanges}
                        />
                    </div>

                    <div>
                        <button onClick={() => UploadHandler(data, fileName)}> DB 업로드 </button>

                        <button onClick={() => DownloadHandler(data)}> 엑셀 파일로 다운로드 </button>
                    </div>
                </div>
            </div>
        </div>
    );

}