import { useCallback } from 'react';
import './Handler.css'

export const useColumnHandler = (data, setData, currentSheetIndex) => {
    const handleAddColumn = useCallback((colIndex) => {
        const newData = [...data];
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
        newData[currentSheetIndex].columns.splice(colIndex, 1); // 열 삭제
        newData[currentSheetIndex].rows = newData[currentSheetIndex].rows.map(row => {
            const newRow = [...row];
            newRow.splice(colIndex, 1); // 각 행에서 해당 열 삭제
            return newRow;
        });
        setData(newData);
    }, [data, setData, currentSheetIndex]);

    return { handleAddColumn, handleDeleteColumn };
};
