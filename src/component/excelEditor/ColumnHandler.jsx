import { useCallback } from 'react';
import './Handler.css'

export const useColumnHandler = (data, setData, currentSheetIndex) => {
    const handleAddColumn = useCallback((colIndex) => {
        const newData = [...data];
        const maxColIndex = newData[currentSheetIndex].columns.length;
        
        if (colIndex < 0 || colIndex > maxColIndex) {
            colIndex = maxColIndex;
        }
        newData[currentSheetIndex].columns.splice(colIndex, 0, ''); // 새로운 열 추가
        newData[currentSheetIndex].rows = newData[currentSheetIndex].rows.map(row => {
            const newRow = [...row];
            newRow.splice(colIndex, 0, ''); // 각 행에 빈 셀 추가
            return newRow;
        });
        setData(newData);
    }, [data, setData, currentSheetIndex]);

    const handleDeleteColumn = useCallback((colIndex) => {
        const newData = [...data];
        if (colIndex >= 0 && colIndex <= newData[currentSheetIndex].columns.length) {
            newData[currentSheetIndex].columns.splice(colIndex, 1);
            
            newData[currentSheetIndex].rows = newData[currentSheetIndex].rows.map(row => {
                row.splice(colIndex, 1);
                return row;
            });
            setData(newData);
        }
    }, [data, setData, currentSheetIndex]);

    return { handleAddColumn, handleDeleteColumn };
};
