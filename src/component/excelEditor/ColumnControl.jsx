import React from 'react';

const ColumnControls = ({ colIndex, setColIndex, handleAddColumn, handleDeleteColumn }) => {
  return (
    <div>
      <input
        className="input"
        type="number"
        value={colIndex}
        onChange={(e) => setColIndex(parseInt(e.target.value, 10))}
        placeholder="열 인덱스"
      />
      <button className="button" onClick={handleAddColumn}>열 추가</button>
      <button className="button" onClick={handleDeleteColumn}>열 삭제</button>
    </div>
  );
};

export default ColumnControls;
