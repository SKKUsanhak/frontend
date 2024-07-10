import React, { useState } from 'react';
import './TableEditor.css';

function TableEditor({ data }) {
  const [tableData, setTableData] = useState(data);

  const addRow = () => {
    const newRow = tableData[0] ? Object.keys(tableData[0]).reduce((acc, key) => ({ ...acc, [key]: "" }), {}) : {};
    setTableData([...tableData, newRow]);
  };

  const removeRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
  };

  const handleCellChange = (index, key, value) => {
    const newData = [...tableData];
    newData[index][key] = value;
    setTableData(newData);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((key) => (
                <td key={key}>
                  <input
                    type="text"
                    value={row[key]}
                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                  />
                </td>
              ))}
              <td>
                <button onClick={() => removeRow(rowIndex)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
}

export default TableEditor;
