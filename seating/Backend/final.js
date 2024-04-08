const ExcelJS = require('exceljs');

async function readExcelFile(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Courses to Rooms Allocation');
  const data = [];

  worksheet.eachRow((row, rowNumber) => {
    // Skip the header row
    if (rowNumber === 1) return;

    const rowData = {
      date: row.getCell('date').value,
      time: row.getCell('time').value,
      courseName: row.getCell('courseName').value,
      rooms: row.getCell('rooms').value,
      numRooms: row.getCell('numRooms').value,
      totalCourseCount: row.getCell('totalCourseCount').value
    };
    data.push(rowData);
  });

  return data;
}

// Usage example
const filePath = './courses_to_rooms_with_counts_allocation.xlsx';
readExcelFile(filePath).then((data) => {
  console.log(data);
}).catch((error) => {
  console.error('Error reading the Excel file:', error);
});

module.exports = { readExcelFile };