import React, { useState } from 'react';

export default function TableData({ tableData , initialTableTitle}) {
    const [selectedCell, setSelectedCell] = useState(null);

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
            return cell ? cell.contents : '';
        });
    });

    const handleCellClick = (rowIndex, cellIndex, cellData) => {
        setSelectedCell({ rowIndex, cellIndex, cellData });
    };

    return (
        <div>
            <div className='excel-editor'>
                <div className='table-section'>
                    <div className='table-data-container'>
                        <table className='db-table'>
                            <thead>
                                <tr>
                                    {columns.map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td
                                            key={cellIndex}
                                            className={selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.cellIndex === cellIndex ? 'highlight-cell' : ''}
                                            onClick={() => handleCellClick(rowIndex, cellIndex, cell)}
                                        >
                                            {cell}
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
                            <p>Selected Cell:</p>
                            <p>Row: {selectedCell.rowIndex + 1}</p>
                            <p>Column: {columns[selectedCell.cellIndex]}</p>
                            <p>Data: {selectedCell.cellData}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}