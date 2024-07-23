import React, { useState } from 'react';
import { TbTablePlus } from "react-icons/tb";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleDown, GoTriangleUp, GoTriangleRight, GoTriangleLeft } from "react-icons/go";
import axios from 'axios';
import './db.css';

export default function TableList({ tableList, fileId, fetchTables, onTableSelect, fetchData, onTableDelete, selectedTableId }) {
    const [editingTableId, setEditingTableId] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

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
        } catch (error) {
            console.error("테이블 이름 수정 중 오류 발생:", error);
            alert("테이블 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = 'id';
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTables = () => {
        if (!sortConfig.key) return tableList;
        const sorted = [...tableList].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                return <GoTriangleDown className='sort-icon' />;
            } else if (sortConfig.direction === 'descending') {
                return <GoTriangleUp className='sort-icon' />;
            }
        }
        return <GoTriangleRight className='sort-icon' />;
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < tableList.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleTableNameClick = async (id) => {
        onTableSelect(id);
        fetchData(id);
    };

    const paginatedTables = sortedTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(tableList.length / itemsPerPage);

    return (
        <div className='table-list-container'>
            <h2 className='table-list-title'>테이블 목록</h2>
            <div className='table-list-header'>
                <TbTablePlus onClick={handleAddTable} className='add-table-button' size={24} />
            </div>
            {tableList.length === 0 ? (
                <p>No tables available.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    <div className="header-cell">
                                        ID {getSortIcon('id')}
                                    </div>
                                </th>
                                <th>Table Name</th>
                                <th>완료 여부</th>
                                <th>테이블 삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTables.map((table, index) => (
                                <tr key={index}>
                                    <td>{table.id}</td>
                                    <td>
                                        {editingTableId === table.id ? (
                                            <div className="edit-name-container">
                                                <input
                                                    type="text"
                                                    value={newTableName}
                                                    onChange={(e) => setNewTableName(e.target.value)}
                                                />
                                                <IoIosSave
                                                    onClick={() => handleSaveTableName(table)}
                                                    className='save-table-button'
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="table-name-container"
                                                onClick={() => handleTableNameClick(table.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="table-name">
                                                    {table.tableTitle}
                                                </span>
                                                <FaEdit
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditTableName(table);
                                                    }}
                                                    className='edit-table-button'
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td>{table.finalData ? 'O' : 'X'}</td>
                                    <td>
                                        <button className='trash-icon' onClick={() => onTableDelete(table.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedTables.length < itemsPerPage &&
                                [...Array(itemsPerPage - paginatedTables.length)].map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td colSpan="4">&nbsp;</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className='pagination-icon' />
                        <span>{currentPage}</span>
                        <GoTriangleRight onClick={handleNextPage} disabled={currentPage === totalPages} className='pagination-icon' />
                    </div>
                </>
            )}
        </div>
    );
}
