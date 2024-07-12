export const handleAddColumn = (columns, setColumns, data, setData, colIndex, currentSheetIndex) => {
    const newColumns = [...columns];
    newColumns.splice(colIndex, 0, ''); // 새로운 열 추가
    setColumns(newColumns);

    const newData = data.map((sheet, sheetIndex) => {
        if (sheetIndex === currentSheetIndex) {
            return sheet.map(row => {
                const newRow = [...row];
                newRow.splice(colIndex, 0, ''); // 각 행에 빈 셀 추가
                return newRow;
            });
        }
        return sheet;
    });
    setData(newData);
};

export const handleDeleteColumn = (columns, setColumns, data, setData, colIndex, currentSheetIndex) => {
    const newColumns = [...columns];
    newColumns.splice(colIndex, 1); // 열 삭제
    setColumns(newColumns);

    const newData = data.map((sheet, sheetIndex) => {
        if (sheetIndex === currentSheetIndex) {
            return sheet.map(row => {
                const newRow = [...row];
                newRow.splice(colIndex, 1); // 각 행에서 해당 열 삭제
                return newRow;
            });
        }
        return sheet;
    });
    setData(newData);
};
