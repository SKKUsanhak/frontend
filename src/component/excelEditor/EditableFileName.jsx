import React, { useState, useEffect } from 'react';
import './EditableFileName.css';

const EditableFileName = ({ initialFileName, onSave }) => {
    const [isEditing, setIsEditing] = useState(false); // 파일 이름 편집 상태
    const [fileName, setFileName] = useState(initialFileName); // 파일 이름 상태

    useEffect(() => {
        setFileName(initialFileName); // initialFileName이 변경될 때 fileName 상태 업데이트
    }, [initialFileName]);

    const handleEditClick = () => {
        setIsEditing(true); // 수정 모드로 전환
    };

    const handleSaveClick = () => {
        setIsEditing(false); // 보기 모드로 전환
        onSave(fileName); // 파일 이름 저장 함수 호출
    };

    const handleInputChange = (e) => {
        setFileName(e.target.value); // 파일 이름 상태 업데이트
    };

    return (
        <div className="editable-file-name">
            {isEditing ? (
                <input
                    type="text"
                    value={fileName}
                    onChange={handleInputChange} // 파일 이름 변경 시 상태 업데이트
                />
            ) : (
                <span>{fileName}</span> // 파일 이름 표시
            )}
            <button onClick={isEditing ? handleSaveClick : handleEditClick}>
                {isEditing ? 'Save' : 'Edit'} 
            </button>
        </div>
    );
};

export default EditableFileName;
