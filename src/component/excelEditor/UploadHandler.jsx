import ExcelJS from 'exceljs';
import axios from 'axios';
import buffer from 'react'

export const UploadHandler = async (data, ColumnRanges) => {

    const workbook = new ExcelJS.Workbook();

    data.forEach((sheetData, sheetIndex) => {
        const worksheet = workbook.addWorksheet(`Sheet ${sheetIndex + 1}`);

        sheetData.rows.forEach((row, rowIndex) => {
            const worksheetRow = worksheet.getRow(rowIndex + 1);
            row.forEach((cell, cellIndex) => {
                worksheetRow.getCell(cellIndex + 1).value = cell;
            });
        });
    });

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const file = new File([blob], 'output.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ColumnRanges', JSON.stringify(ColumnRanges));

    try {
        const response = await axios.post('/final-result', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('파일 업로드 성공', response.data);
    } catch (error) {
        console.error('파일 업로드 실패', error);
    }

}