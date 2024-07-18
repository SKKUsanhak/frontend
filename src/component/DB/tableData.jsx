import React from 'react';

export default function TableData({ tableData , tableTitle}) {
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

    return (
        <div>
            <h2 className='tableTitle'>{tableTitle}</h2>
            <table>
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
                                <td key={cellIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}