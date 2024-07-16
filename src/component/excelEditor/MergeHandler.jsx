import { useCallback } from 'react';
import { useRowHandler } from './RowHandler';

export const MergeHandler = ({ data, setData, currentSheetIndex, ColumnRanges }) => {
    
    const { handleDeleteRow } = useRowHandler(data, setData, currentSheetIndex);

    const handleMerge = useCallback(() => {
        const newData = [...data];
        const sheetData = newData[currentSheetIndex];

        if (!sheetData || !ColumnRanges[currentSheetIndex]) {
            alert('시트 데이터나 열 범위가 올바르지 않습니다.');
            return;
        }

        const { startColumn, endColumn } = ColumnRanges[currentSheetIndex] || {};

        if (startColumn === undefined || endColumn === undefined) {
            alert('시작 열과 종료 열을 지정하세요.');
            return;
        }

        for (let col = 0; col < sheetData.columns.length; col++) {
            // 빈 칸 제거를 위해 상단 열의 데이터를 아래로 복제 (이동하고자 하는 위치에 데이터 있으면 이동 X)
            for (let row = startColumn; row < endColumn; row++) {
                if (sheetData.rows[row][col] !== "" && sheetData.rows[row + 1][col] === "") {
                    sheetData.rows[row + 1][col] = sheetData.rows[row][col];
                }
            }
        }

        for (let row = startColumn; row < endColumn; row++){
            for (let col = 0; col < sheetData.columns.length; col++){
                if (sheetData.rows[row][col] !== "" && sheetData.rows[row][col+1] === ""){
                    sheetData.rows[row][col+1] = sheetData.rows[row][col];
                }
            }
        }
        // 여기까지는 정상적 
        // 임시 배열을 하나 만들어 병합 과정에 사용
        const tempSheet = sheetData.rows.slice(startColumn, endColumn + 1).map(row => row.slice());
        // console.log('tempSheet:', tempSheet);
        // console.log('tempSheet length:', tempSheet.length);
        // console.log('tempSheet:', JSON.stringify(tempSheet, null, 2));
        // 병합 작업 수행
        for (let col = 0; col < sheetData.columns.length; col++){
            for (let row = 0; row < tempSheet.length - 1; row++){
                // 위 아래 행의 데이터가 같을 경우 복제하지 않고 넘어감 
                // (같은 걸 판단하는 기준은 tempSheet의 원본값이고 합치는건 sheetData)
                if(tempSheet[row+1][col] === tempSheet[row][col]){ // 같은 값일 경우 그냥 옮김
                    sheetData.rows[startColumn+row+1][col] = sheetData.rows[startColumn+row][col];
                }
                // 아닐 경우 아래로 - 연결 후 복제
                else if(tempSheet[row+1][col] !== tempSheet[row][col]) {
                    sheetData.rows[startColumn+row+1][col] = sheetData.rows[startColumn+row][col] + '-' + sheetData.rows[startColumn+row+1][col];
                }
                //console.log("sheetData : ", sheetData.rows[startColumn+row+1][col] , "tempSheet : ", tempSheet[row+1][col]);
            }
        }
        for (let i = endColumn - 1; i >= startColumn; i--) {
            handleDeleteRow(i);
        }
        newData[currentSheetIndex] = sheetData;
        setData(newData);
    }, [data, setData, currentSheetIndex, ColumnRanges, handleDeleteRow]);

    return (
        <button onClick={handleMerge}>Merge</button>
    );
};
