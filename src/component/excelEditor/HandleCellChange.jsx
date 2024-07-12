export const handleCellChange = (data, setData, rowIndex, colIndex, newValue) => {
    const updatedData = [...data];
    updatedData[rowIndex][colIndex] = newValue;
    setData(updatedData);
};