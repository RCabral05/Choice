// utils/excelUtils.js
import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetNames = workbook.SheetNames;
      const extractedSheets = sheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        return { name: sheetName, data: XLSX.utils.sheet_to_json(worksheet, { header: 1 }) };
      });

      resolve(extractedSheets);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };

    fileReader.readAsArrayBuffer(file);
  });
};
