import React, { useState, useEffect } from 'react';
import './styles.css';
import { DropzoneComponent } from '../DropZone/DropZoneComponent';
import { parseExcelFile } from '../../utils/excelUtils.js';

export const Index = () => {
  const [sheets, setSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  // UPLOAD EXCEL FILE
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    parseExcelFile(file)
      .then((extractedSheets) => {
        const sortedSheets = extractedSheets.sort((a, b) => a.name.localeCompare(b.name));
        setSheets(sortedSheets);
        setActiveSheetIndex(0);
      })
      .catch((error) => {
        console.error('Error parsing Excel file:', error);
      });
  };

  // SELECT SHEET TO VIEW
  const changeActiveSheet = (event) => {
    const selectedIndex = event.target.value;
    setActiveSheetIndex(parseInt(selectedIndex, 10));
  };

  // SEARCH DATA ON SPECIFIED SHEET
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // EDIT DATA ON SPECIFIED SHEET
  const handleEdit = (rowIndex) => {
    setEditingRowIndex(rowIndex);
  };

  // SAVE DATA AFTER EDITING
  const handleSave = (rowIndex) => {
    setEditingRowIndex(null);
    // Here you can also implement functionality to persist the edited data
  };

  // HANDLE THE NEW DATA AFTER EDITITNG
  const handleChange = (rowIndex, cellIndex, value) => {
    const updatedSheets = sheets.map((sheet, sIndex) => {
      if (sIndex === activeSheetIndex) {
        // Cloning the sheet data to a new array for immutability
        const updatedData = sheet.data.map((row, rIndex) => {
          // Adjusting rowIndex by 1 due to header row
          if (rIndex === rowIndex + 1) {
            return row.map((cell, cIndex) => cIndex === cellIndex ? value : cell);
          }
          return row;
        });
        return { ...sheet, data: updatedData };
      }
      return sheet;
    });
  
    setSheets(updatedSheets);
  };
  
  // USE THE SEARCH INPUT TO FILTER DATA
  const filteredData = sheets[activeSheetIndex]?.data.slice(1).filter(row => {
    return row.some(cell => cell?.toString().toLowerCase().includes(searchQuery));
  });

  return (
    <div className="sheets">
      <DropzoneComponent onDrop={handleDrop} />
      <div className="sheets-container">
        <div className="sheets-navigation">
          <label htmlFor="sheet-dropdown">Select Sheet:</label>
          <select id="sheet-dropdown" value={activeSheetIndex} onChange={changeActiveSheet}>
            {sheets.map((sheet, index) => (
              <option key={index} value={index}>
                {sheet.name}
              </option>
            ))}
          </select>
          <label htmlFor="sheet-dropdown">Search Sheet:</label>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="sheets-content">
          <h2>{sheets[activeSheetIndex]?.name}</h2>
          <table>
            <thead>
              <tr>
                {sheets[activeSheetIndex]?.data[0].map((cell, cellIndex) => (
                  <th key={cellIndex}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {filteredData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {editingRowIndex === rowIndex ? (
                      <input 
                        type="text"
                        value={cell ?? ""} // Ensures the value is never null or undefined
                        onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value)}
                      />
                    ) : (
                      cell ?? "" // Also ensures cell data is displayed even if null/undefined
                    )}
                  </td>
                ))}
                {editingRowIndex === rowIndex ? (
                  <td>
                    <button onClick={() => handleSave(rowIndex)}>Save</button>
                  </td>
                ) : (
                  <td>
                    <button onClick={() => handleEdit(rowIndex)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
