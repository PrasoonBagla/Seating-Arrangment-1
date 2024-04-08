const XLSX = require('xlsx');
const workbook = XLSX.readFile('/Users/prasoonbagla/Desktop/Seatingexcel.xlsx');
const sheet_name_list = workbook.SheetNames;
const sheet = workbook.Sheets[sheet_name_list[0]];

const data = XLSX.utils.sheet_to_json(sheet);

let Room = [];
let Course = [];

data.forEach(row => {
    Room.push({ roomName: row['room name'], roomCapacity: row['room capacity'], allocatedStrength: 0, allocatedCourses: [] });
    Course.push({ courseName: row['course name'], courseStrength: row['course strength'], remainingStrength: row['course strength'] });
});

// Sort 
Room.sort((a, b) => b.roomCapacity - a.roomCapacity);
Course.sort((a, b) => b.courseStrength - a.courseStrength);

Course.forEach(course => {

    let roomIndex = Room.findIndex(room => !room.allocatedCourses.length && course.remainingStrength <= (room.roomCapacity - room.allocatedStrength));

    if (roomIndex !== -1) {
        Room[roomIndex].allocatedStrength += course.remainingStrength;
        Room[roomIndex].allocatedCourses.push({ courseName: course.courseName, strength: course.remainingStrength });
        course.remainingStrength = 0;
    } else {
        Room.forEach(room => {
            if (course.remainingStrength > 0 && room.allocatedStrength < room.roomCapacity) {
                const studentsAllocated = Math.min(course.remainingStrength, room.roomCapacity - room.allocatedStrength);
                course.remainingStrength -= studentsAllocated;
                room.allocatedStrength += studentsAllocated;
                room.allocatedCourses.push({ courseName: course.courseName, strength: studentsAllocated });
            }
        });
    }
});

Room.forEach(room => {
    room.allocatedCourses.forEach(courseAllocation => {
        console.log(`Room "${room.roomName}" has course: ${courseAllocation.courseName} (${courseAllocation.strength} students). Empty space: ${room.roomCapacity - room.allocatedStrength}`);
    });
});

const unallocatedCourses = Course.filter(course => course.remainingStrength > 0);
if (unallocatedCourses.length > 0) {
    console.log("Courses that couldn't be fully allocated:");
    unallocatedCourses.forEach(course => {
        console.log(`${course.courseName} (${course.remainingStrength} remaining students)`);
    });
}
