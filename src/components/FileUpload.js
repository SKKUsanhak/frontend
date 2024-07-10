import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUpload.css';

function FileUpload({ setTableData }) {
  const [file, setFile] = useState(null);

  const onDrop = acceptedFiles => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log("Uploading file...");
      const response = await axios.post('http://백엔드서버IP:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("File uploaded successfully:", response.data);
      setTableData(response.data);  // Assuming the backend returns JSON data
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="upload-container" {...getRootProps()}>
      <input {...getInputProps()} className="file-input" />
      {
        isDragActive ?
          <p>Drop the file here ...</p> :
          <p>Drag and drop a file here, or click here to select a file</p>
      }
      {file && <p className="file-name">{file.name}</p>}
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
