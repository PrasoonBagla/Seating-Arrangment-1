const XLSX = require('xlsx');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json'); // Path to the data file

const excel = async (date,time) => {
function readExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assumes the data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

function filterItemsByDateAndTime(items, date, time) {
    return items.filter(item => 
        item['Date'] && item['Date'].toString().includes(date) &&
        item['Time'] && item['Time'].toString().includes(time)
    );
}
/////////////////////////////// This is function for Master Midsem.XLSXL//////////////////////////////
// function countEntriesByCourseNo(items) {
//     const count = {};
//     items.forEach(item => {
//         if (item['Course No']) {
//             count[item['Course No']] = (count[item['Course No']] || 0) + 1;
//         }
//     });
//     return count;
// }
/////////////////////////////// This is function for DATA.XLSXL//////////////////////////////
function countEntriesByCourseNo(items) {
    let result = {};
    let x;
    let y;
    items.forEach(item => {
        result[item["Course No"]] = item["Count"];
    })
    return result;
}
///////////////////////////////////////////////////////////////////////////////////////////

function extractUniqueDates(items) {
    const dates = new Set();
    items.forEach(item => {
        if (item['Date']) {
            dates.add(item['Date'].toString());
        }
    });
    return Array.from(dates);
}

function extractUniqueTimes(items) {
    const times = new Set();
    items.forEach(item => {
        if (item['Time']) {
            times.add(item['Time'].toString());
        }
    });
    return Array.from(times);
}

// const filePath = "/Users/prasoonbagla/Desktop/DOP/seating/Backend/master file-mid sem.xlsx"; // Replace with your actual file path
const filePath = "/Users/prasoonbagla/Desktop/DOP/DATA.xlsx"; // Replace with your actual file path
const items = readExcelFile(filePath);

const uniqueDates = extractUniqueDates(items);
const uniqueTimes = extractUniqueTimes(items);
const dateToFilter = date; // Replace with your desired date
const timeToFilter = time; // Replace with your desired time

const filteredItems = filterItemsByDateAndTime(items, dateToFilter, timeToFilter);
let entriesCount = countEntriesByCourseNo(filteredItems);
// console.log("DHAFA",entriesCount);
module.exports = {entriesCount};
return entriesCount;
}
excel();
module.exports = excel;