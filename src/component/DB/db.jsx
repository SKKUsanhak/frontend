// 기능

    // 1. 파일 추가(upload file로 대체) / 삭제 (삭제 시 temp가 아닌 데이터도 함께 삭제되는 문제) 기능
    // 2. 테이블 추가(excelEditor 기능처럼 구현?) / 삭제 (삭제 시 table과 연결된 temp가 아닌 데이터도 함께 삭제됨) 기능
    // 3. 테이블 수정 기능 (excelEditor 기능처럼 구현)
    // 4. 
    
    // 파일 관리 기능 추가 (Admin, User 기능 나누어 구현)

    // 모듈화 하기

    // 시각화

    // 1. 테이블 생김새 개선 (파일 - 테이블 - 데이터 크기 일치감, + 테이블 스크롤)
    // 2. 기능 버튼들 추가 (테이블 추가 기능은 해당 파일에 이름, 테이블 id 등 입력하여 추가)
    // 3. 데이터 수정 기능 ExcelEditor 재탕으로 구현

    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import './db.css'; // CSS 파일 임포트
    import FileList from './fileList';
    import TableList from './tableList';
    import TableData from './tableData';
    import EditabletableTitle from './tableTitleEdit';
    
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
            // 서버에 '/show-file' 요청 보내기
            axios.get('/show-file')
                .then(response => {
                    // JSON 형태의 데이터를 받아서 files 상태로 설정
                    // console.log(response.data);
                    setFiles(response.data);
                })
                .catch(error => {
                    console.error('Error fetching files:', error);
                });
        }

        const fetchTable = () => {
            // 서버에 '/show-table' 요청 보내기
            axios.get('/show-table', { params: { id: selectedFileId } })
            .then(response => {
                // JSON 형태의 데이터를 받아서 tableList 상태로 설정
                setTableList(response.data);
                setVisible('tableList'); // 테이블 목록을 표시하도록 설정
            })
            .catch(error => {
                console.error('Error fetching table data:', error);
            });
        }

        const fetchData = () => {
            const selectedTable = tableList.find(table => table.id === selectedTableId);
                setTableTitle(selectedTable ? selectedTable.tableTitle : '');
                axios.get('/show-data', { params: { tableid: selectedTableId } })
                    .then(response => {
                        // JSON 형태의 데이터를 받아서 tableData 상태로 설정
                        setTableData(response.data);
                        setVisible('tableData'); // 테이블 데이터를 표시하도록 설정
                    })
                    .catch(error => {
                        console.error('Error fetching table data:', error);
                    });
        }
    
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
                fetchTable();
            }
        };
    
        const TableSelect = () => { // 테이블을 선택하고 데이터를 call
            console.log(tableList);
            console.log(selectedTableId);
            if (selectedTableId !== null) {
                // 서버에 '/show-temp-data' 요청 보내기
                fetchData();
            }
        };
        
        const handleFileDelete = async (fileId) => {
            try {
                const response = await axios.delete(`/delete-file`, {
                    params: { id: fileId },
                });
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
            fetchTable();
        };
    
        return (
            <div className="db-container">
                {visible === 'fileList' && (
                    <div>
                        <FileList files={files} selectedFileId={selectedFileId} onFileSelect={handleFileSelect} onFileDelete={handleFileDelete}/>
                        {selectedFileId && (
                            <div className="file-button-container">
                                <button onClick={FileSelect}>파일 선택</button>
                            </div>
                        )}
                    </div>
                )}
                {visible === 'tableList' && (
                    <div>
                        <TableList tableList={tableList} selectedTableId={selectedTableId} onTableSelect={handleTableSelect} fileId={selectedFileId} fetchTables={fetchTable}/>
                        {selectedTableId && (
                            <div className="table-button-container">
                                <button onClick={TableSelect}>테이블 선택</button>
                            </div>
                        )}
                        <div className="file-back-container">
                            <button onClick={handleBackToFileList}>뒤로 가기</button>
                        </div>
                    </div>
                )}
                {visible === 'tableData' && tableData && (
                    <div>
                        <h1><EditabletableTitle initialTableTitle={tableTitle} onSave={setTableTitle} tableId={selectedTableId}/></h1>
                        <TableData tableData={tableData} tableId={selectedTableId} fetchData={fetchData} />
                        <div className="table-back-container">
                            <button onClick={handleBackToTableList}>뒤로 가기</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    