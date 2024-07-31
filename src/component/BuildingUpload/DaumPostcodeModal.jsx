// DaumPostcodeModal.jsx
import React, { useEffect } from 'react';
import './DaumPostcodeModal.css';

const DaumPostcodeModal = ({ onComplete, onClose }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        script.onload = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let fullAddress = data.address;
                    let extraAddress = '';

                    if (data.addressType === 'R') {
                        if (data.bname !== '') {
                            extraAddress += data.bname;
                        }
                        if (data.buildingName !== '') {
                            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                        }
                        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                    }

                    onComplete(fullAddress);
                    onClose(); // 창 닫기
                },
            }).embed(document.getElementById('postcode-container'));
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [onComplete, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button onClick={onClose} className="close-button">&times;</button>
                <div id="postcode-container" style={{ width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
};

export default DaumPostcodeModal;
