import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './db.css'; // CSS 파일 임포트
import FileList from './fileList';
import TableList from './tableList';
import TableData from './tableData';

export default function DB() {
    const [files, setFiles] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [tableList, setTableList] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [tableData, setTableData] = useState(null);

    useEffect(() => {
        // 서버에 '/show-file' 요청 보내기
        axios.get('/show-file')
            .then(response => {
                // JSON 형태의 데이터를 받아서 files 상태로 설정
                setFiles(response.data);
            })
            .catch(error => {
                console.error('Error fetching files:', error);
            });
    }, []);

    const handleFileSelect = (id) => { // 파일 선택을 관리
        setSelectedFileId(id);
        setSelectedTableId(null); // 파일을 선택할 때 테이블 선택 초기화
        setTableList(null); // 파일을 선택할 때 테이블 목록 초기화
        setTableData(null); // 파일을 선택할 때 테이블 데이터 초기화
    };

    const handleTableSelect = (id) => { // 테이블 선택을 관리
        setSelectedTableId(id);
    };

    const FileSelect = () => { // 파일을 선택하고 파일의 테이블을 call
        if (selectedFileId !== null) {
            // 서버에 '/show-table' 요청 보내기
            axios.get(`/show-table`, { params: { id: selectedFileId } })
                .then(response => {
                    // JSON 형태의 데이터를 받아서 tableList 상태로 설정
                    setTableList(response.data);
                })
                .catch(error => {
                    console.error('Error fetching table data:', error);
                });
        }
    };

    const TableSelect = () => { // 테이블을 선택하고 데이터를 call
        if (selectedTableId !== null) {
            // 서버에 '/show-temp-data' 요청 보내기
            axios.get(`/show-temp-data`, { params: { tableId: selectedTableId } })
                .then(response => {
                    // JSON 형태의 데이터를 받아서 tableData 상태로 설정
                    setTableData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching table data:', error);
                });
        }
    }

    return (
        <div className="db-container">
            <div>
                <FileList files={files} selectedFileId={selectedFileId} onFileSelect={handleFileSelect} />
                {selectedFileId && (
                    <div>
                        <button onClick={FileSelect}>파일 확인</button>
                    </div>
                )}
                {tableList && (
                    <div>
                        <TableList tableList={tableList} selectedTableId={selectedTableId} onTableSelect={handleTableSelect} />
                        {selectedTableId && (
                            <div>
                                <button onClick={TableSelect}>테이블 데이터 확인</button>
                            </div>
                        )}
                    </div>
                )}
                {tableData && (
                <TableData tableData={tableData} />
            )}
            </div>
        </div>
    );
}
