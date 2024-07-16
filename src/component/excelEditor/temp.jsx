// {/* <div className="excel-editor" onMouseUp={handleMouseUp}>
//             <h1>Excel Editor</h1>
    
//             <div className="sheet-navigation"> {/* 테이블 간 이동 버튼 추가*/ }
//                 <button onClick={handlePrevSheet} disabled={data.length === 0}>
//                     &lt; 이전 테이블
//                 </button>
//                 <span>Table {currentSheetIndex + 1} / {data.length}</span>
//                 <button onClick={handleNextSheet} disabled={data.length === 0}>
//                     다음 테이블 &gt;
//                 </button>
//             </div>
    
//             <div className="Tablecontrols"> {/* 테이블 추가 및 삭제 버튼 */ }
//                 <input
//                     type="number"
//                     value={tableIndex}
//                     onChange={(e) => {
//                         const value = e.target.value === '' ? '' : Math.min(Number(e.target.value) - 1, data.length);
//                         setTableIndex(value === '' ? '' : value + 1);
//                     }}
//                     placeholder="테이블 번호 지정"
//                     min="1"
//                     max={data.length + 1}
//                 />
//                 <button onClick={() => addTable(tableIndex - 1)}>테이블 추가</button>
//                 <button onClick={() => deleteTable(tableIndex - 1)}>테이블 삭제</button>
//             </div>
    
//             <div className="Rowcontrols"> {/* 행 추가 및 삭제 버튼 */ }
//                 <input
//                     type="number"
//                     value={rowIndex}
//                     onChange={(e) => setRowIndex(e.target.value === '' ? '' : Math.min(Number(e.target.value), data[currentSheetIndex]?.rows.length ?? 0))}
//                     placeholder="행 지정"
//                     min="0"
//                     max={data[currentSheetIndex]?.rows.length ?? 0}
//                 />
//                 <button onClick={() => handleAddRow(rowIndex)}>행 추가</button>
//                 <button onClick={() => handleDeleteRow(rowIndex)}>행 삭제</button>
//             </div>
    
//             <div className="Colcontrols"> {/* 열 추가 및 삭제 버튼 */ }
//                 <input
//                     type="number"
//                     value={colIndex}
//                     onChange={(e) => setColIndex(e.target.value === '' ? '' : Math.min(Number(e.target.value), data[currentSheetIndex]?.columns.length ?? 0))}
//                     placeholder="열 지정"
//                     min="0"
//                     max={data[currentSheetIndex]?.columns.length ?? 0}
//                 />
//                 <button onClick={() => handleAddColumn(colIndex)}>열 추가</button>
//                 <button onClick={() => handleDeleteColumn(colIndex)}>열 삭제</button>
//             </div>
    
//             <div className="ColumnRanges">
//                 <h3> 현재 시트의 행 범위 지정 </h3>
//                 <input
//                     type="number"
//                     name="startColumn"
//                     placeholder="시작 열"
//                     value={ColumnRanges[currentSheetIndex]?.startColumn !== undefined ? ColumnRanges[currentSheetIndex]?.startColumn : ''}
//                     min="0"
//                     max={data[currentSheetIndex]?.columns.length - 1 ?? 0}
//                     onChange={(e) => handleColumnRangeChange(currentSheetIndex, e)}
//                 />
//                 <input
//                     type="number"
//                     name="endColumn"
//                     placeholder="종료 열"
//                     value={ColumnRanges[currentSheetIndex]?.endColumn !== undefined ? ColumnRanges[currentSheetIndex]?.endColumn : ''}
//                     min="0"
//                     max={data[currentSheetIndex]?.columns.length - 1 ?? 0}
//                     onChange={(e) => handleColumnRangeChange(currentSheetIndex, e)}
//                 />
//                 <MergeHandler
//                     data={data}
//                     setData={setData}
//                     currentSheetIndex={currentSheetIndex}
//                     ColumnRanges={ColumnRanges}
//                 />
//             </div>
    
//             {/* 테이블 표기 부분 */ }
//             <table className='table' onMouseDown={handleTableMouseDown}>
//                 <tbody> {/* 현재 시트에 대해서 데이터 열 순회 */ }
//                     {Array.isArray(data[currentSheetIndex]?.rows) && data[currentSheetIndex].rows.map((row, rowIndex) => (
//                         Array.isArray(row) && (
//                             <tr key={rowIndex}>
//                                 {/* 현재 시트에 대해서 데이터 셀 순회 */ }
//                                 {row.map((cell, cellIndex) => (
//                                     <td className='td'
//                                         key={cellIndex}
//                                         onMouseDown={(e) => handleMouseDown(e, rowIndex, cellIndex)}
//                                         onMouseOver={(e) => handleMouseOver(e, rowIndex, cellIndex)}
//                                         style={{ backgroundColor: selectedCells.has(`${rowIndex}-${cellIndex}`) ? 'lightblue' : 'transparent' }}
//                                     >
//                                         {/* 값 넣을시 변경 */ }
//                                         <input
//                                             className='input'
//                                             type="text"
//                                             value={cell || ''}
//                                             onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
//                                         />
//                                     </td>
//                                 ))}
//                             </tr>
//                         )
//                     ))}
//                 </tbody>
//             </table>
//             <div>
//                 <button
//                     className='upload-button'
//                     onClick={() => UploadHandler(data, ColumnRanges)}
//                 >
//                     DB 업로드
//                 </button>
//             </div>
//         </div>