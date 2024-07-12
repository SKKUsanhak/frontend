import React from 'react';

const RowControls = ({ rowIndex, setRowIndex, handleAddRow, handleDeleteRow }) => {
  return (
    <div>
      <input
        className="input"
        type="number"
        value={rowIndex}
        onChange={(e) => setRowIndex(parseInt(e.target.value, 10))}
        placeholder="행 인덱스"
      />
      <button className="button" onClick={handleAddRow}>행 추가</button>
      <button className="button" onClick={handleDeleteRow}>행 삭제</button>
    </div>
  );
};

export default RowControls;
