import React, { useState, useEffect, useRef } from 'react';
import { TbTablePlus, TbArrowBackUp } from "react-icons/tb";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import axios from 'axios';
import './tableList.css';

export default function TableList({ tableList, fileId, fetchTables, onTableSelect, fetchData, onTableDelete, BacktoFileList }) {
    const [editingTableId, setEditingTableId] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const itemsPerPage = 15; // 페이지 당 항목 수

    const tableDetailsRef = useRef(null);
    const tableListContainerRef = useRef(null);

    const handleAddTable = async () => {
        const newTableName = prompt("새로운 테이블 이름을 입력하세요:");
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/create-new-table?fileid=${fileId}`;
            await axios.post(
                url,
                { contents: newTableName },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert("테이블이 성공적으로 추가되었습니다.");
            fetchTables(fileId); // Fetch the updated table list
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
            const url = `/update-table-name?tableid=${table.id}`;
            await axios.patch(url, { contents: newTableName });
            alert("테이블 이름이 성공적으로 수정되었습니다.");
            setEditingTableId(null);
            fetchTables(fileId); // Fetch the updated table list
            setSelectedTable((prevTable) => ({ ...prevTable, tableTitle: newTableName })); // Update the selected table name
        } catch (error) {
            console.error("테이블 이름 수정 중 오류 발생:", error);
            alert("테이블 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const filteredTables = () => {
        if (!searchQuery) return tableList;
        return tableList.filter(table => table.tableTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredTables().length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleTableNameClick = (table) => {
        setSelectedTable(table);
        onTableSelect(editingTableId);
    };

    useEffect(() => {
        if (selectedTable) {
            setTimeout(() => {
                if (tableListContainerRef.current) {
                    tableListContainerRef.current.classList.add('expanded'); // Add expanded class
                }
                if (tableDetailsRef.current) {
                    tableDetailsRef.current.classList.add('visible'); // Add visible class
                }
            }, 10); // 애니메이션이 자연스럽게 작동하도록 약간의 지연시간 추가
        } else {
            if (tableListContainerRef.current) {
                tableListContainerRef.current.classList.remove('expanded'); // Remove expanded class
            }
            if (tableDetailsRef.current) {
                tableDetailsRef.current.classList.remove('visible'); // Remove visible class
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

    const paginatedTables = filteredTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredTables().length / itemsPerPage);

    return (
        <div>
            <div className="table-list-container" ref={tableListContainerRef}>
                <h2 className='table-list-title'>테이블 목록</h2>
                <div className='table-list-header'>
                    <div className='back-container' onClick={BacktoFileList}>
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
                                setCurrentPage(1); // 검색할 때 첫 페이지로 이동
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
                                    {paginatedTables.map((table, index) => (
                                        <tr key={index} onClick={() => handleTableNameClick(table)} className={selectedTable && selectedTable.id === table.id ? 'selected' : ''}>
                                            <td>
                                                {editingTableId === table.id ? (
                                                    <div className="edit-name-container">
                                                        <input
                                                            type="text"
                                                            value={newTableName}
                                                            onChange={(e) => setNewTableName(e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="table-name-container">
                                                        <span className="table-name">
                                                            {table.tableTitle}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{table.finalData !== undefined ? (table.finalData ? 'O' : 'X') : 'N/A'}</td> {/* finalData가 undefined일 경우 'N/A'로 표시 */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="pagination">
                            <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className='pagination-icon' />
                            <span>{currentPage}</span>
                            <GoTriangleRight onClick={handleNextPage} disabled={currentPage === totalPages} className='pagination-icon' />
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
                                    <td><strong>테이블 ID</strong></td>
                                    <td>{selectedTable.id}</td>
                                </tr>
                                <tr>
                                    <td><strong>테이블 이름</strong></td>
                                    <td>{selectedTable.tableTitle}</td>
                                </tr>
                                <tr>
                                    <td><strong>완료 여부</strong></td>
                                    <td>{selectedTable.finalData !== undefined ? (selectedTable.finalData ? 'O' : 'X') : 'N/A'}</td> {/* finalData가 undefined일 경우 'N/A'로 표시 */}
                                </tr>
                            </tbody>
                        </table>
                        <div className="table-action-buttons">
                            <div className="edit-name-wrapper">
                                <div className="edit-name-container">
                                    <span>테이블 이름 수정</span>
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
                                <button className="trash-icon" onClick={() => onTableDelete(selectedTable.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <button className="table-view-button" onClick={() => fetchData(selectedTable.id)}>테이블 데이터 보기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
