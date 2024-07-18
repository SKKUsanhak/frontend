import ExcelJS from 'exceljs';

export const DownloadHandler = async (data) => {

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
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('파일 다운로드 성공');
    } catch (error) {
        console.error('파일 다운로드 실패', error);
    }
}