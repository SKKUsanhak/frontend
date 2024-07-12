import { useState, useRef } from 'react';

export const useCellSelection = () => {
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const dragStartCell = useRef(null);

  const handleMouseDown = (e, rowIndex, colKey) => {
    e.stopPropagation();
    const cellId = `${rowIndex}-${colKey}`;
    if (e.shiftKey) {
      const newSelectedCells = new Set(selectedCells);
      newSelectedCells.has(cellId) ? newSelectedCells.delete(cellId) : newSelectedCells.add(cellId);
      setSelectedCells(newSelectedCells);
    } else {
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
    if (!isDragging) return; // 드래그 중일 때만 셀을 선택
    const start = dragStartCell.current;
    const newSelectedCells = new Set(selectedCells);
    for (let i = Math.min(start.rowIndex, rowIndex); i <= Math.max(start.rowIndex, rowIndex); i++) {
      for (let j = Math.min(start.colKey, colKey); j <= Math.max(start.colKey, colKey); j++) {
        newSelectedCells.add(`${i}-${j}`);
      }
    }
    setSelectedCells(newSelectedCells);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTableMouseDown = (e) => {
    e.stopPropagation();
  };

  return {
    selectedCells,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    handleTableMouseDown,
  };
};
