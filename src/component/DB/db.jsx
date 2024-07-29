import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './db.css'; // CSS 파일 임포트
import FileList from './fileList/fileList.jsx';
import TableList from './tableList/tableList.jsx';
import TableData from './tableData/tableData.jsx';

export default function DB() {
    const [files, setFiles] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [tableList, setTableList] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [visible, setVisible] = useState('fileList'); // 표시할 컴포넌트 제어
    const [tableTitle, setTableTitle] = useState('');

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = () => {
        // 서버에 '/files' 요청 보내기
        axios.get('/files')
            .then(response => {
                // JSON 형태의 데이터를 받아서 files 상태로 설정
                setFiles(response.data);
            })
            .catch(error => {
                console.error('Error fetching files:', error);
            });
    }
    
    const fetchTable = async (fileId) => {
        // 서버에 `/files/${fileId}/tables` 요청 보내기
        axios.get(`/files/${fileId}/tables`)
        .then(response => {
            // JSON 형태의 데이터를 받아서 tableList 상태로 설정
            setTableList(response.data);
            setVisible('tableList'); // 테이블 목록을 표시하도록 설정
        })
        .catch(error => {
            console.error('Error fetching table data:', error);
        });
    }
    
    const fetchData = async (fileId, tableId) => {
        const selectedTable = tableList.find(table => table.id === tableId);
        setTableTitle(selectedTable ? selectedTable.tableTitle : '');
        // 서버에 `/files/${fileId}/tables/${tableId}/datas` 요청 보내기
        axios.get(`/files/${fileId}/tables/${tableId}/datas`)
            .then(response => {
                // JSON 형태의 데이터를 받아서 tableData 상태로 설정
                setTableData(response.data);
                setVisible('tableData'); // 테이블 데이터를 표시하도록 설정
            })
            .catch(error => {
                console.error('Error fetching table data:', error);
            });
    }

    const handleFileSelect = async (id) => {
        setSelectedFileId(id);
        setSelectedTableId(null); // 파일을 선택할 때 테이블 선택 초기화
        setTableList(null); // 파일을 선택할 때 테이블 목록 초기화
        setTableData(null); // 파일을 선택할 때 테이블 데이터 초기화
    }

    const handleTableSelect = async (id) => {
        setSelectedTableId(id);
        setTableData(null);
    }

    const handleFileDelete = async (fileId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(`/files/${fileId}`);
            if (response.status === 200) {
                alert("파일 삭제 성공");
                fetchFiles();
                // 파일이 삭제된 후의 추가 작업이 필요하다면 여기에 작성합니다.
            } else {
                throw new Error('파일 삭제 실패');
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
            alert("There was an error deleting the file.");
        }
    };
    
    const handleTableDelete = async (fileId, tableId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(`/files/${fileId}/tables/${tableId}`);
            if (response.status === 200) {
                alert("테이블 삭제 성공");
                fetchTable(fileId);
                // 테이블이 삭제된 후의 추가 작업이 필요하다면 여기에 작성합니다.
            } else {
                throw new Error('테이블 삭제 실패');
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
            alert("테이블 삭제 실패");
        }
    };

    const handleBackToFileList = () => {
        setVisible('fileList');
        setSelectedFileId(null);
        setTableList(null);
        setSelectedTableId(null);
        setTableData(null);
        fetchFiles();
    };

    const handleBackToTableList = () => {
        setVisible('tableList');
        setSelectedTableId(null);
        setTableData(null);
        fetchTable(selectedFileId);
    };

    return (
        <div className="db-container">
            {visible === 'fileList' && (
                <FileList 
                    files={files} 
                    onFileSelect={handleFileSelect} 
                    fetchTables={fetchTable} 
                    onFileDelete={handleFileDelete} 
                    fetchfiles={fetchFiles}
                />
            )}
            {visible === 'tableList' && (
                <div>
                    <TableList tableList={tableList} fileId={selectedFileId} fetchTables={fetchTable} BacktoFileList={handleBackToFileList}
                    onTableSelect={handleTableSelect} fetchData={fetchData} onTableDelete={handleTableDelete}/>
                </div>
            )}
            {visible === 'tableData' && tableData && (
                <div>
                    <h1 className='title-name'>{tableTitle}</h1>
                    <TableData fileId={selectedFileId} tableData={tableData} tableId={selectedTableId} BacktoTableList={handleBackToTableList}
                    fetchData={fetchData} isFinal={tableList.find(table => table.id === selectedTableId)?.finalData} />
                </div>
            )}
        </div>
    );
}
