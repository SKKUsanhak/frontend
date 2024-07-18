import { useCallback } from 'react';

export const useRowHandler = (data, setData, currentSheetIndex) => {
    const handleAddRow = useCallback((rowIndex) => {
        const newData = [...data];
        const maxRowIndex = newData[currentSheetIndex].rows.length;
        
        if (rowIndex < 0 || rowIndex > maxRowIndex) {
            rowIndex = maxRowIndex;
        }

        const newRow = new Array(newData[currentSheetIndex].columns.length).fill(''); // 빈 행 생성
        newData[currentSheetIndex].rows = [
            ...newData[currentSheetIndex].rows.slice(0, rowIndex),
            newRow,
            ...newData[currentSheetIndex].rows.slice(rowIndex)
        ];
        setData(newData);
    }, [data, setData, currentSheetIndex]);

    const handleDeleteRow = useCallback((rowIndex) => {
        const newData = [...data];
        if (rowIndex >= 0 && rowIndex <= newData[currentSheetIndex].rows.length) {
            newData[currentSheetIndex].rows.splice(rowIndex, 1);
            setData(newData);
        }
    }, [data, setData, currentSheetIndex]);

    return { handleAddRow, handleDeleteRow };
};
