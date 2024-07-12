// import React, { useEffect, useState } from 'react';
// import ExcelJS from 'exceljs';
// import { useLocation } from 'react-router-dom';

// export default function Result() {
//     const location = useLocation();
//     const [excelData, setExcelData] = useState(null);

//     useEffect(() => {
//         const fileData = location.state.fileData;

//         const workbook = new ExcelJS.Workbook();
//         workbook.xlsx.load(fileData)
//             .then(() => {
//                 const worksheet = workbook.getWorksheet(1);
//                 const data = [];

//                 worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//                     const rowData = [];
//                     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//                         rowData.push(cell.value);
//                     });
//                     data.push(rowData);
//                 });

//                 setExcelData(data);
//             })
//             .catch(error => {
//                 console.error('엑셀 파일 로드 중 오류가 발생했습니다!', error);
//             });
//     }, [location.state.fileData]);

//     return (
        
//     );
// }
