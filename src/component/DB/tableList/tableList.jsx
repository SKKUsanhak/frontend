import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TbTablePlus, TbArrowBackUp } from "react-icons/tb";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import './tableList.css';

export default function TableList() {
    const { fileId, buildingId } = useParams();
    const [tableList, setTableList] = useState([]);
    const [editingTableId, setEditingTableId] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const itemsPerPage = 15;

    const tableDetailsRef = useRef(null);
    const tableListContainerRef = useRef(null);
    const navigate = useNavigate();

    const fetchTable = useCallback(() => {
        axios.get(`/buildings/${buildingId}/files/${fileId}/tables`)
            .then(response => {
                setTableList(response.data);
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
                tableListContainerRef.current && !tableListContainerRef.current.contains(event.target)
            ) {
                setSelectedTable(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddTable = async () => {
        const newTableName = prompt("새로운 테이블 이름을 입력하세요:");
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/files/${fileId}/tables`;
            await axios.post(url, { contents: newTableName }, { headers: { 'Content-Type': 'application/json' } });
            alert("테이블이 성공적으로 추가되었습니다.");
            fetchTable(fileId);
        } catch (error) {
            console.error("테이블 추가 중 오류 발생:", error);
            alert("테이블 추가 중 오류가 발생했습니다.");
        }
    };

    const handleEditTableName = (table) => {
        setEditingTableId(table.id);
        setNewTableName(table.tableTitle);
    };

    const handleSaveTableName = async (table) => {
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/files/${fileId}/tables/${table.id}`;
            await axios.patch(url, { contents: newTableName });
            alert("테이블 이름이 성공적으로 수정되었습니다.");
            setEditingTableId(null);
            fetchTable(fileId);
            setSelectedTable(prevTable => ({ ...prevTable, tableTitle: newTableName }));
        } catch (error) {
            console.error("테이블 이름 수정 중 오류 발생:", error);
            alert("테이블 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const handleTableSelect = (id) => {
        navigate(`/database/tables/${fileId}/data/${id}`);
    };

    const handleTableDelete = async (tableId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`/files/${fileId}/tables/${tableId}`);
            if (response.status === 200) {
                alert("테이블 삭제 성공");
                fetchTable(fileId);
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

    return (
        <div className="table-list-page">
            <div className="table-list-container" ref={tableListContainerRef}>
                <h2 className='table-list-title'>테이블 목록</h2>
                <div className='table-list-header'>
                    <div className='back-container' onClick={() => navigate(-1)}>
                        <TbArrowBackUp className='back-icon' size={24} />
                        <span>파일 목록으로 돌아가기</span>
                    </div>
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
                                        <th>완료 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((table, index) => (
                                        <tr key={index} onClick={() => setSelectedTable(table)} className={selectedTable && selectedTable.id === table.id ? 'selected' : ''}>
                                            <td>{table.tableTitle}</td>
                                            <td>{table.finalData !== undefined ? (table.finalData ? 'O' : 'X') : 'N/A'}</td>
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
            {selectedTable && (
                <div className={`table-details ${selectedTable ? 'visible' : ''}`} ref={tableDetailsRef}>
                    <div className='table-detail-container'>
                        <h3>테이블 상세 정보</h3>
                        <table className="detail-table">
                            <tbody>
                                <tr>
                                    <td><strong>테이블 ID</strong></td>
                                    <td>{selectedTable.id}</td>
                                </tr>
                                <tr>
                                    <td><strong>테이블 이름</strong></td>
                                    <td>{selectedTable.tableTitle}</td>
                                </tr>
                                <tr>
                                    <td><strong>완료 여부</strong></td>
                                    <td>{selectedTable.finalData !== undefined ? (selectedTable.finalData ? 'O' : 'X') : 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="table-action-buttons">
                            <div className="edit-name-wrapper">
                                <div className="edit-name-container">
                                    {editingTableId === selectedTable.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newTableName}
                                                onChange={(e) => setNewTableName(e.target.value)}
                                            />
                                            <IoIosSave
                                                onClick={() => handleSaveTableName(selectedTable)}
                                                className="save-table-button"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span>테이블 이름 수정</span>
                                            <FaEdit
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditTableName(selectedTable);
                                                }}
                                                className="edit-table-button"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="delete-table-container">
                                <span>테이블 삭제</span>
                                <button className="trash-icon" onClick={() => handleTableDelete(selectedTable.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <button className="table-view-button" onClick={() => handleTableSelect(selectedTable.id)}>테이블 데이터 보기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
