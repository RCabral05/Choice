import React, { useState, useEffect } from 'react';
import './styles.css';
import { DropzoneComponent } from '../DropZone/DropZoneComponent';
import { parseExcelFile } from '../../utils/excelUtils.js';

export const Index = () => {
  const [sheets, setSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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

  const changeActiveSheet = (event) => {
    const selectedIndex = event.target.value;
    setActiveSheetIndex(parseInt(selectedIndex, 10));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

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
                    <td key={cellIndex}>{cell}</td>
                  ))}
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
