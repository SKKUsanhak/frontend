import { useCallback } from 'react';

export const useRowHandler = (data, setData, currentSheetIndex) => {
    const handleAddRow = useCallback((rowIndex) => {
        const newData = [...data];
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
        newData[currentSheetIndex].rows.splice(rowIndex, 1);
        setData(newData);
    }, [data, setData, currentSheetIndex]);

    return { handleAddRow, handleDeleteRow };
};
