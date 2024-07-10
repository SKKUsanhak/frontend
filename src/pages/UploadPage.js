import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Table from '../components/Table';

function UploadPage() {
  const [tableData, setTableData] = useState([]);

  return (
    <div>
      <h1>Upload PDF</h1>
      <FileUpload setTableData={setTableData} />
      <Table data={tableData} />
    </div>
  );
}

export default UploadPage;
