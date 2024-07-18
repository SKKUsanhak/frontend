import ExcelJS from 'exceljs';
import axios from 'axios';

export const UploadHandler = async (data) => {

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
    try {
        // 버퍼 생성
        const buffer = await workbook.xlsx.writeBuffer();
        // console.log("Buffer created successfully");

        // Blob 객체로 변환
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // console.log("Blob created successfully");

        // 파일 다운로드
        // aveAs(blob, 'output.xlsx');
        // console.log("File saved locally");

        // FormData 생성
        const formData = new FormData();
        const file = new File([blob], 'output.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        formData.append('file', file);

        // 파일 업로드
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