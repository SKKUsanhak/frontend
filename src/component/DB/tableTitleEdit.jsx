import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './tableTitleEdit.css';

const EditabletableTitle = ({ initialTableTitle, onSave, tableId}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tableTitle, settableTitle] = useState(initialTableTitle);
    const inputRef = useRef(null);

    useEffect(() => {
        settableTitle(initialTableTitle);
    }, [initialTableTitle]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
        }
    }, [isEditing]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);
        onSave(tableTitle);
        try {
            const response = await axios.patch(`/update-table-name?tableid=${tableId}`,{ contents: tableTitle}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    const handleInputChange = (e) => {
        settableTitle(e.target.value);
        inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    };

    return (
        <div className="editable-title-name">
            {isEditing ? (
                <input
                    type="text"
                    ref={inputRef}
                    value={tableTitle}
                    onChange={handleInputChange}
                    style={{ fontSize: '1rem' }}
                />
            ) : (
                <span onClick={handleEditClick}>{tableTitle}</span>
            )}
            <button onClick={isEditing ? handleSaveClick : handleEditClick}>
                {isEditing ? '저장' : '수정'}
            </button>
        </div>
    );
};

export default EditabletableTitle;