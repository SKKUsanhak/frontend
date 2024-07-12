import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import './ExcelEditor.css';

export default function ExcelEditor() {
    const location = useLocation();
    const [data, setData] = useState([]);

    useEffect(() => { // xlsv 리턴값 저장
        if (location.state && location.state.fileData) {
            const workbook = new ExcelJS.Workbook();
            const buffer = location.state.fileData;

            workbook.xlsx.load(buffer).then(() => {
                const worksheet = workbook.getWorksheet(1);
                const rows = [];
                let maxColumns = 0; // 최대 열 길이 저장

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

                setData(normalizedRows);
            });
        }
    }, [location.state]);

    const handleCellChange = (rowIndex, cellIndex, value) => {
        const newData = [...data];
        newData[rowIndex][cellIndex] = value;
        setData(newData);
    };

    return (
        <div className="excel-editor">
            <h1>Excel Editor</h1>
            <table className='table'>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td className='td' key={cellIndex}>
                                    <input
                                        className='input'
                                        type="text"
                                        value={cell || ''}
                                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
