import ExcelJS from 'exceljs';
import axios from 'axios';

export const UploadHandler = async (data, fileName, comments, navigate, buildingId) => {
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

        // Create fileInfo object
        const fileInfo = {
            fileName: fileName,
            note: comments
        };

        // Convert fileInfo object to a JSON string
        const fileInfoJson = JSON.stringify(fileInfo);

        // Create a Blob for the fileInfo JSON string
        const fileInfoBlob = new Blob([fileInfoJson], { type: 'application/json' });

        // Append the fileInfo Blob to the FormData
        formData.append("fileInfo", fileInfoBlob);

        // File upload
        await axios.post(`/buildings/${buildingId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert('DB 업로드 성공');

        // Navigate to the new URL
        navigate(`/buildings/${buildingId}/files`);

    } catch (error) {
        console.error('DB 업로드 실패', error);
        alert('DB 업로드 실패', error);
    }
};
