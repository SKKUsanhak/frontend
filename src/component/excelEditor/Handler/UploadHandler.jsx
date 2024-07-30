import ExcelJS from 'exceljs';
import axios from 'axios';

export const UploadHandler = async (data, fileName, buildingName, buildingAddress, comments) => {

    const workbook = new ExcelJS.Workbook();

    try {
        data.forEach((sheetData, sheetIndex) => {
            const worksheet = workbook.addWorksheet(`Sheet ${sheetIndex + 1}`);

            sheetData.rows.forEach((row, rowIndex) => {
                const worksheetRow = worksheet.getRow(rowIndex + 1);
                row.forEach((cell, cellIndex) => {
                    worksheetRow.getCell(cellIndex + 1).value = cell;
                });
            });
        });

    } catch (error) {
        console.error("Error creating workbook:", error);
        return;
    }

    try {
        // Create FormData
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const formData = new FormData();
        formData.append("file", new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

        // Create fileInformation object
        const fileInformation = {
            address: buildingAddress,
            fileName: fileName,
            buildingName: buildingName,
            note: comments
        };

        // Convert fileInformation object to a JSON string
        const fileInformationJson = JSON.stringify(fileInformation);

        // Create a Blob for the fileInformation JSON string
        const fileInformationBlob = new Blob([fileInformationJson], { type: 'application/json' });

        // Append the fileInformation Blob to the FormData
        formData.append("fileInformation", fileInformationBlob);

        // File upload
        const response = await axios.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert('DB 업로드 성공', response.data);
    } catch (error) {
        console.error('DB 업로드 실패', error);
        alert('DB 업로드 성공', error);
    }
};