import React, { useState, useRef } from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExcelEditor() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const [colIndex, setColIndex] = useState(0);
  const [specifiedRow, setSpecifiedRow] = useState(null);
  const dragStartCell = useRef(null);

  const handleInputChange = (e, rowIndex, colKey) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colKey] = e.target.value;
    setRows(updatedRows);
  };

  const handleMouseDown = (e, rowIndex, colKey) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const cellId = `${rowIndex}-${colKey}`;
      const newSelectedCells = new Set(selectedCells);
      newSelectedCells.has(cellId) ? newSelectedCells.delete(cellId) : newSelectedCells.add(cellId);
      setSelectedCells(newSelectedCells);
    } else {
      const cellId = `${rowIndex}-${colKey}`;
      if (selectedCells.has(cellId)) {
        setSelectedCells(new Set());
      } else {
        setSelectedCells(new Set([cellId]));
        dragStartCell.current = { rowIndex, colKey };
        setIsDragging(true);
      }
    }
  };

  const handleMouseOver = (e, rowIndex, colKey) => {
    if (isDragging) {
      const start = dragStartCell.current;
      const newSelectedCells = new Set();
      for (let i = Math.min(start.rowIndex, rowIndex); i <= Math.max(start.rowIndex, rowIndex); i++) {
        for (let j = Math.min(start.colKey, colKey); j <= Math.max(start.colKey, colKey); j++) {
          newSelectedCells.add(`${i}-${j}`);
        }
      }
      setSelectedCells(newSelectedCells);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTableMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleClearSelection = () => {
    setSelectedCells(new Set());
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((col, index) => {
      newRow[index] = '';
    });
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex, 0, newRow);
    setRows(updatedRows);
  };

  const handleDeleteRow = () => {
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex, 1);
    setRows(updatedRows);
  };

  const handleAddColumn = () => {
    const newColumns = [...columns];
    newColumns.splice(colIndex, 0, { header: '', key: colIndex });

    for (let i = colIndex + 1; i < newColumns.length; i++) {
      newColumns[i].key = i;
    }
    
    setColumns(newColumns);

    const updatedRows = rows.map(row => {
      const newRow = { ...row };
      for (let i = newColumns.length - 1; i > colIndex; i--) {
        newRow[i] = newRow[i - 1];
      }
      newRow[colIndex] = '';
      return newRow;
    });
    setRows(updatedRows);
  };

  const handleDeleteColumn = () => {
    const newColumns = [...columns];
    newColumns.splice(colIndex, 1);

    for (let i = colIndex; i < newColumns.length; i++) {
      newColumns[i].key = i;
    }
    
    setColumns(newColumns);

    const updatedRows = rows.map(row => {
      const newRow = { ...row };
      for (let i = colIndex; i < newColumns.length; i++) {
        newRow[i] = newRow[i + 1];
      }
      delete newRow[newColumns.length];
      return newRow;
    });
    setRows(updatedRows);
  };

  const isSelected = (rowIndex, colKey) => {
    return selectedCells.has(`${rowIndex}-${colKey}`);
  };

  const handleSpecifiedRowChange = (e) => {
    setSpecifiedRow(parseInt(e.target.value, 10));
  };

  return (
    <Container onMouseDown={handleClearSelection} onMouseUp={handleMouseUp}>
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <Button onClick={handleSave}>수정된 엑셀 파일 저장</Button>
      <div>
        <Input
          type="number"
          value={rowIndex}
          onChange={(e) => setRowIndex(parseInt(e.target.value, 10))}
          placeholder="행 인덱스"
        />
        <Button onClick={handleAddRow}>행 추가</Button>
        <Button onClick={handleDeleteRow}>행 삭제</Button>
      </div>
      <div>
        <Input
          type="number"
          value={colIndex}
          onChange={(e) => setColIndex(parseInt(e.target.value, 10))}
          placeholder="열 인덱스"
        />
        <Button onClick={handleAddColumn}>열 추가</Button>
        <Button onClick={handleDeleteColumn}>열 삭제</Button>
      </div>
      <Table onMouseDown={handleTableMouseDown}>
        <thead>
          <tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <Td
                  key={col.key}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, col.key)}
                  onMouseOver={(e) => handleMouseOver(e, rowIndex, col.key)}
                  isSelected={isSelected(rowIndex, col.key)}
                >
                  <CellInput
                    type="text"
                    value={row[col.key] || ''}
                    onChange={(e) => handleInputChange(e, rowIndex, col.key)}
                  />
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ marginTop: "10px" }}>
        <label>
          행 지정:
          <Input
            type="number"
            value={specifiedRow || ""}
            onChange={handleSpecifiedRowChange}
            placeholder=""
          />
        </label>
      </div>
    </Container>
  );
}
