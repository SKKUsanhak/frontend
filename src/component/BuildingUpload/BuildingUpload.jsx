import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import './BuildingUpload.css';
import DaumPostcodeModal from './DaumPostcodeModal.jsx';

const BuildingUpload = () => {
    const [formData, setFormData] = useState({
        buildingName: '',
        address: '',
        totalArea: '',
        GroundFloors: '',
        BasementFloors: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressComplete = (address) => {
        setFormData({
            ...formData,
            address: address
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData); // 요청 데이터 출력
        try {
            await axios.post('/buildings', formData);
            console.log('Form Data Submitted:', formData);
            navigate('/buildings');
        } catch (error) {
            console.error('There was an error submitting the form!', error.response.data); // 에러 응답 데이터 출력
        }
    };

    return (
        <div>
            <form className='form-container' onSubmit={handleSubmit}>
                <div>
                    <label>건물명:</label>
                    <input
                        type="text"
                        name="buildingName"
                        value={formData.buildingName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="address-search">
                    <label>건물주소:</label>
                    <div className="address-input-container">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            readOnly
                            required
                        />
                        <button type="button" className="search-button" onClick={() => setIsModalOpen(true)}>
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div>
                    <label>총면적:</label>
                    <input
                        type="text"
                        name="totalArea"
                        value={formData.totalArea}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>지상 층수:</label>
                    <input
                        type="number"
                        name="GroundFloors"
                        value={formData.GroundFloors}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>지하 층수:</label>
                    <input
                        type="number"
                        name="BasementFloors"
                        value={formData.BasementFloors}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">업로드</button>
            </form>
            {isModalOpen && (
                <DaumPostcodeModal
                    onComplete={handleAddressComplete}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default BuildingUpload;
