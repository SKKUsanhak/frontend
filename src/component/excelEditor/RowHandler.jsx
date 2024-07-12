import './Handler.css';

export const handleAddRow = (data, setData, columns, rowIndex, currentSheetIndex) => {
    const newData = [...data];
    const newRow = new Array(columns.length).fill(''); // 빈 행 생성
    newData[currentSheetIndex] = [
        ...newData[currentSheetIndex].slice(0, rowIndex),
        newRow,
        ...newData[currentSheetIndex].slice(rowIndex)
    ];
    setData(newData);
};

export const handleDeleteRow = (data, setData, rowIndex, currentSheetIndex) => {
    const newData = [...data];
    newData[currentSheetIndex].splice(rowIndex, 1);
    setData(newData);
};
