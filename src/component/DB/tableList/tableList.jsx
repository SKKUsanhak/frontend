import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TbTablePlus } from "react-icons/tb";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import './tableList.css';

export default function TableList() {
    const { fileId, buildingId } = useParams();
    const [tableList, setTableList] = useState([]);
    const [editingTableId, setEditingTableId] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [newNote, setNewNote] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedVersions, setSelectedVersions] = useState({});
    const itemsPerPage = 15;

    const tableDetailsRef = useRef(null);
    const tableListContainerRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchTable = useCallback(() => {
        axios.get(`/buildings/${buildingId}/files/${fileId}/tables`)
            .then(response => {
                setTableList(response.data);
                const initialVersions = {};
                response.data.forEach(table => {
                    if (table.dataVersionList.length > 0) {
                        initialVersions[table.id] = table.dataVersionList[table.dataVersionList.length - 1].id;
                    }
                });
                setSelectedVersions(initialVersions);
            })
            .catch(error => {
                console.error('Error fetching table data:', error);
            });
    }, [fileId, buildingId]);

    useEffect(() => {
        fetchTable();
    }, [fetchTable]);

    useEffect(() => {
        if (selectedTable) {
            if (tableListContainerRef.current) {
                tableListContainerRef.current.classList.add('expanded');
            }
            if (tableDetailsRef.current) {
                tableDetailsRef.current.classList.add('visible');
            }

        } else {
            if (tableListContainerRef.current) {
                tableListContainerRef.current.classList.remove('expanded');
            }
            if (tableDetailsRef.current) {
                tableDetailsRef.current.classList.remove('visible');
            }
        }
    }, [selectedTable]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tableDetailsRef.current && !tableDetailsRef.current.contains(event.target) &&
                tableListContainerRef.current && !tableListContainerRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setSelectedTable(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedTable && selectedVersions[selectedTable.id]) {
            const selectedVersion = selectedTable.dataVersionList.find(version => version.id === selectedVersions[selectedTable.id]);
            setNewNote(selectedVersion?.note || '');
        }
    }, [selectedVersions, selectedTable]);

    const handleAddTable = async () => {
        const newTableName = prompt("새로운 테이블 이름을 입력하세요:");
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/buildings/${buildingId}/files/${fileId}/tables`;
            await axios.post(url, { name: newTableName }, { headers: { 'Content-Type': 'application/json' } });
            alert("테이블이 성공적으로 추가되었습니다.");
            fetchTable();
        } catch (error) {
            console.error("테이블 추가 중 오류 발생:", error);
            alert("테이블 추가 중 오류가 발생했습니다.");
        }
    };

    const handleEditTableName = (table) => {
        setEditingTableId(table.id);
        setNewTableName(table.tableTitle);
        const selectedVersion = table.dataVersionList.find(version => version.id === selectedVersions[table.id]);
        setNewNote(selectedVersion?.note || '');
    };

    const handleSaveTableName = async (table) => {
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/buildings/${buildingId}/files/${fileId}/tables/${table.id}`;
            await axios.patch(url, { name: newTableName, note: newNote });
            alert("테이블 정보가 성공적으로 수정되었습니다.");
            setEditingTableId(null);
            fetchTable();
            setSelectedTable(prevTable => ({ ...prevTable, tableTitle: newTableName }));
        } catch (error) {
            console.error("테이블 정보 수정 중 오류 발생:", error);
            alert("테이블 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleTableSelect = (buildingId, fileId, tableId, versionId) => {
        const isLastVersion = selectedTable.dataVersionList[selectedTable.dataVersionList.length - 1].id === versionId;
        const versionName = selectedTable.dataVersionList.find(version => version.id === selectedVersions[selectedTable.id])?.version;
        navigate(`/buildings/${buildingId}/files/${fileId}/tables/${tableId}/datas?versionId=${versionId}`, {
            state: {
                tableTitle: selectedTable.tableTitle,
                isLastVersion: isLastVersion,
                currentVersion: versionName 
            }
        });
    };
    

    const handleTableDelete = async (tableId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`/buildings/${buildingId}/files/${fileId}/tables/${tableId}`);
            if (response.status === 200) {
                alert("테이블 삭제 성공");
                fetchTable();
                if (tableList.length === 1) {
                    setTableList([]);
                }
                setSelectedTable(null);
            } else {
                throw new Error('테이블 삭제 실패');
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
            alert("테이블 삭제 실패");
        }
    };

    const filteredTables = () => {
        if (!searchQuery) return tableList;
        return tableList.filter(table => table.tableTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredTables().length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleString('ko-KR', options);
    };

    return (
        <div className='main-container'>
            <div className="table-list-page">
                <div className="table-list-container" ref={tableListContainerRef}>
                    <h2 className='table-list-title'>테이블 목록</h2>
                    <div className='table-list-header'>
                        <div className='search-container'>
                            <input
                                type='text'
                                placeholder='테이블 이름으로 검색...'
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <FaSearch className='search-icon' />
                        </div>
                        <div className='add-container' onClick={handleAddTable}>
                            <span>테이블 추가</span>
                            <TbTablePlus className='add-table-icon' size={24} />
                        </div>
                    </div>
                    <div className='table-list-content'>
                        <div className='table-list'>
                            {tableList.length === 0 ? (
                                <p>현재 파일에 테이블이 없습니다.</p>
                            ) : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>테이블 이름</th>
                                            <th>버전 정보</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((table, index) => (
                                            <tr key={index} onClick={() => {
                                                setSelectedTable(table);
                                            }} className={selectedTable && selectedTable.id === table.id ? 'selected' : ''}>
                                                <td>{table.tableTitle}</td>
                                                <td className='drop-down'>
                                                    <select
                                                        ref={dropdownRef}
                                                        value={selectedVersions[table.id] || ''}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const selectedVersion = table.dataVersionList.find(version => version.id === parseInt(value, 10));
                                                            setSelectedVersions(prev => ({ ...prev, [table.id]: selectedVersion.id }));
                                                            setNewNote(selectedVersion?.note || '');
                                                        }}
                                                    >
                                                        {table.dataVersionList.map(version => (
                                                            <option key={version.id} value={version.id}>{version.version}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="pagination">
                                <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className='pagination-icon' />
                                <span>{currentPage}</span>
                                <GoTriangleRight onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredTables().length / itemsPerPage)} className='pagination-icon' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`table-details ${selectedTable ? 'visible' : ''}`} ref={tableDetailsRef}>
                    {selectedTable && (
                        <div className='table-detail-container'>
                            <h3>테이블 상세 정보</h3>
                            <table className="detail-table">
                                <tbody>
                                    <tr>
                                        <td className='details-td'><strong>테이블 ID</strong></td>
                                        <td>{selectedTable.id}</td>
                                    </tr>
                                    <tr>
                                        <td className='details-td'><strong>테이블 이름</strong></td>
                                        <td>{editingTableId === selectedTable.id ? (
                                            <input
                                                type="text"
                                                value={newTableName}
                                                onChange={(e) => setNewTableName(e.target.value)}
                                            />
                                        ) : (
                                            selectedTable.tableTitle
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td className='details-td'><strong>최종 수정일</strong></td>
                                        <td>{formatDate(selectedTable.dataVersionList.find(version => version.id === selectedVersions[selectedTable.id])?.updateTime)}</td>
                                    </tr>
                                    <tr>
                                        <td className='details-td'><strong>비고</strong></td>
                                        <td>{selectedTable.dataVersionList.find(version => version.id === selectedVersions[selectedTable.id])?.note}</td>
                                    </tr>
                                    <tr>
                                        <td className='details-td'><strong>버전</strong></td>
                                        <td>{selectedTable.dataVersionList.find(version => version.id === selectedVersions[selectedTable.id])?.version}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="table-action-buttons">
                                <div className="edit-name-wrapper">
                                    <div className="edit-name-container">
                                        <span>테이블 정보 수정</span>
                                        {editingTableId === selectedTable.id ? (
                                            <>
                                                <IoIosSave
                                                    onClick={() => handleSaveTableName(selectedTable)}
                                                    className="save-table-button"
                                                />
                                            </>
                                        ) : (
                                            <FaEdit
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditTableName(selectedTable);
                                                }}
                                                className="edit-table-button"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="delete-table-container">
                                    <span>테이블 삭제</span>
                                    <button className="trash-icon" onClick={() => handleTableDelete(selectedTable.id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                                <button className="table-view-button" onClick={() => handleTableSelect(buildingId, fileId, selectedTable.id, selectedVersions[selectedTable.id])}>테이블 데이터 보기</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
