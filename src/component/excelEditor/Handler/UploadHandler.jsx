import ExcelJS from 'exceljs';
import axios from 'axios';

export const UploadHandler = async (data, fileName, buildingName, buildingAddress, comments) => {
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

        // Blob 객체로 변환
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // FormData 생성
        const formData = new FormData();
        formData.append("file", new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

        // 파일 정보를 JSON 문자열로 추가
        const fileInfo = {
            fileName: fileName,
            address: buildingAddress,
            buildingName: buildingName,
            note: comments
        };

        // 각 파일 정보를 FormData의 별도 필드로 추가
        for (const key in fileInfo) {
            formData.append(key, fileInfo[key]);
        }

        // 파일 업로드
        const response = await axios.post('/files', formData, {
            // headers: {
            //     'Content-Type': 'multipart/form-data' // 이 헤더를 설정하지 않음
            // }
        });
        alert('DB 업로드 성공', response.data);
    } catch (error) {
        console.error('DB 업로드 실패', error);
        alert('DB 업로드 실패', error);
    }
};
