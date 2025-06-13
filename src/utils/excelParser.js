// 文件路径：src/utils/excelParser.js
import * as XLSX from 'xlsx';

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    console.log('开始解析Excel文件...');

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        console.log('文件读取完成，开始解析...');
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        console.log('工作表:', workbook.SheetNames);

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('解析到数据:', jsonData.length, '行');

        // ...其余代码
      } catch (error) {
        console.error('解析过程中出错:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('文件读取错误:', error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
}
