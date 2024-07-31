import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './buildingList.css';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

export default function BuildingList() {
    const [buildings, setBuildings] = useState([]);
    const [editingBuildingId, setEditingBuildingId] = useState(null);
    const [newBuildingData, setNewBuildingData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const buildingListContainerRef = useRef(null);
    const buildingDetailsRef = useRef(null);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = () => {
        axios.get('/buildings')
            .then(response => {
                setBuildings(response.data);
            })
            .catch(error => {
                console.error('Error fetching buildings:', error);
            });
    };

    useEffect(() => {
        if (selectedBuilding) {
            setTimeout(() => {
                if (buildingListContainerRef.current) {
                    buildingListContainerRef.current.classList.add('expanded');
                }
                if (buildingDetailsRef.current) {
                    buildingDetailsRef.current.classList.add('visible');
                }
            }, 10);
        } else {
            if (buildingListContainerRef.current) {
                buildingListContainerRef.current.classList.remove('expanded');
            }
            if (buildingDetailsRef.current) {
                buildingDetailsRef.current.classList.remove('visible');
            }
        }
    }, [selectedBuilding]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buildingDetailsRef.current && !buildingDetailsRef.current.contains(event.target) &&
                buildingListContainerRef.current && !buildingListContainerRef.current.contains(event.target)
            ) {
                setSelectedBuilding(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditBuilding = (building) => {
        setEditingBuildingId(building.id);
        setNewBuildingData(building);
    };

    const handleSaveBuilding = async () => {
        if (!newBuildingData.buildingName || !newBuildingData.address) {
            alert("건물 이름과 주소를 입력해 주세요.");
            return;
        }
        try {
            const url = `/buildings/${editingBuildingId}`;
            await axios.patch(url, newBuildingData);
            alert("건물 정보가 성공적으로 수정되었습니다.");
            setEditingBuildingId(null);
            fetchBuildings();
            setSelectedBuilding(null);
        } catch (error) {
            console.error("건물 정보 수정 중 오류 발생:", error);
            alert("건물 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleBuildingNameClick = (building, event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedBuilding(building);
    };

    const handleBuildingDelete = async (buildingId) => {
        const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`/buildings/${buildingId}`);
            if (response.status === 204) {
                alert("건물 삭제 성공");
                fetchBuildings();
            } else {
                throw new Error('건물 삭제 실패');
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
            alert("There was an error deleting the building.");
        }
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredBuildings().length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const filteredBuildings = () => {
        if (!searchQuery) return buildings;
        return buildings.filter(building => building.buildingName.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleBuildingSelect = (buildingId) => {
        navigate(`/buildings/${buildingId}/files`);
    }

    const paginatedBuildings = filteredBuildings().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredBuildings().length / itemsPerPage);

    return (
        <div className="building-list-page">
            <div className="building-list-container" ref={buildingListContainerRef}>
                <h2>건물 목록</h2>
                <div className='building-list-header'>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="건물 이름으로 검색..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <FaSearch className="search-icon" />
                    </div>
                </div>
                <div className="building-list-content">
                    <div className="building-list">
                        {buildings && buildings.length === 0 ? (
                            <p>현재 DB에 건물이 없습니다.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='header-cell'>
                                            건물 이름
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBuildings.map((building, index) => (
                                        <tr key={index} onClick={(e) => handleBuildingNameClick(building, e)} className={selectedBuilding && selectedBuilding.id === building.id ? 'selected' : ''}>
                                            <td>
                                                <div className="building-name">
                                                    {building.buildingName}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="pagination">
                            <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-icon" />
                            <span>{currentPage}</span>
                            <GoTriangleRight onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-icon" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`building-details ${selectedBuilding ? 'visible' : ''}`} ref={buildingDetailsRef}>
                {selectedBuilding && (
                    <div className='building-detail-container'>
                        <h3>건물 상세 정보</h3>
                        <table className="detail-table">
                            <tbody>
                                <tr>
                                    <td className='detail-td'><strong>건물 ID</strong></td>
                                    <td>{selectedBuilding.id}</td>
                                </tr>
                                <tr>
                                    <td className='detail-td'><strong>건물 이름</strong></td>
                                    <td>
                                        {editingBuildingId === selectedBuilding.id ? (
                                            <input
                                                type="text"
                                                value={newBuildingData.buildingName}
                                                onChange={(e) => setNewBuildingData({ ...newBuildingData, buildingName: e.target.value })}
                                            />
                                        ) : (
                                            selectedBuilding.buildingName
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='detail-td'><strong>주소</strong></td>
                                    <td>
                                        {editingBuildingId === selectedBuilding.id ? (
                                            <input
                                                type="text"
                                                value={newBuildingData.address}
                                                onChange={(e) => setNewBuildingData({ ...newBuildingData, address: e.target.value })}
                                            />
                                        ) : (
                                            selectedBuilding.address
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='detail-td'><strong>총 면적</strong></td>
                                    <td>
                                        {editingBuildingId === selectedBuilding.id ? (
                                            <input
                                                type="text"
                                                value={newBuildingData.totalArea}
                                                onChange={(e) => setNewBuildingData({ ...newBuildingData, totalArea: e.target.value })}
                                            />
                                        ) : (
                                            selectedBuilding.totalArea
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='detail-td'><strong>지상 층수</strong></td>
                                    <td>
                                        {editingBuildingId === selectedBuilding.id ? (
                                            <input
                                                type="number"
                                                value={newBuildingData.groundFloors}
                                                onChange={(e) => setNewBuildingData({ ...newBuildingData, groundFloors: e.target.value })}
                                            />
                                        ) : (
                                            selectedBuilding.groundFloors
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='detail-td'><strong>지하 층수</strong></td>
                                    <td>
                                        {editingBuildingId === selectedBuilding.id ? (
                                            <input
                                                type="number"
                                                value={newBuildingData.basementFloors}
                                                onChange={(e) => setNewBuildingData({ ...newBuildingData, basementFloors: e.target.value })}
                                            />
                                        ) : (
                                            selectedBuilding.basementFloors
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="building-action-buttons">
                            <div className="edit-name-wrapper">
                                <div className="edit-name-container">
                                    <span>건물 정보 수정</span>
                                    {editingBuildingId === selectedBuilding.id ? (
                                        <IoIosSave
                                            onClick={handleSaveBuilding}
                                            className="save-building-button"
                                        />
                                    ) : (
                                        <FaEdit
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditBuilding(selectedBuilding);
                                            }}
                                            className="edit-building-button"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="delete-building-container">
                                <span>건물 삭제</span>
                                <button className="trash-icon" onClick={() => handleBuildingDelete(selectedBuilding.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <button onClick={() => handleBuildingSelect(selectedBuilding.id)} className='file-view-button'>파일 목록 보기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
