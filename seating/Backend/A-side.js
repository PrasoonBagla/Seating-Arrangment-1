const fs = require('fs').promises;
const path = require('path');
const nodes = ["A501", "A502", "A503", "A505", "A506", "A507", "A508", "A601", "A602", "A603", "A604", "A605"];
// const Asidecapacities1 = require('./Nodes')
let securityPersonnel = {};
let invigilators = {};
let weights = {};
let distances = {};
let capacities = {};
let Asidedistances = {};
let ASoftsidecapacities = {};
let AHardsidecapacities = {};
let Csidedistances = {};
let CSoftsidecapacities = {};
let CHardsidecapacities = {};
let DSoftsidecapacities = {};
let DHardsidecapacities = {};
let LTSoftsidecapacities = {};
let LTHardsidecapacities = {};
let CCSoftsidecapacities = {};
let CCHardsidecapacities = {};
const Aside = async (data_from_Nodes) => {
    const parseValueList = (list, isWeight = false) => {
        if (isWeight) {
            return list.map(Number);
        }

        const result = {};
        list.forEach(item => {
            const [key, value] = item.split(' ');
            result[key] = Number(value);
        });
        return result;
    };
    const processFile = async () => {
        const filePath = path.join(__dirname, '../Backend/data.txt');
        try {
            const data = await fs.readFile(filePath, { encoding: 'utf8' });
            const lines = data.split('\n');

            lines.forEach(line => {
                if (line.trim()) {
                    const [key, valueString] = line.split(' = ');
                    const valueList = valueString.split(',').map(value => value.trim());

                    switch (key) {
                        case 'securityPersonnel':
                            securityPersonnel = parseValueList(valueList);
                            break;
                        case 'invigilators':
                            invigilators = parseValueList(valueList);
                            break;
                        case 'w1, w2, w3':
                            weights = parseValueList(valueList, true);
                            break;
                        case 'distances':
                            distances = parseValueList(valueList);
                            break;
                        case 'capacities':
                            capacities = parseValueList(valueList);
                            break;
                        case 'Asidedistances':
                            Asidedistances = parseValueList(valueList);
                            break;
                        case 'ASoftsidecapacities':
                            ASoftsidecapacities = parseValueList(valueList);
                            break;
                        case 'AHardsidecapacities':
                            AHardsidecapacities = parseValueList(valueList);
                            break;
                        case 'Csidedistances':
                            Csidedistances = parseValueList(valueList);
                            break;
                        case 'CSoftsidecapacities':
                            CSoftsidecapacities = parseValueList(valueList);
                            break;
                        case 'CHardsidecapacities':
                            CHardsidecapacities = parseValueList(valueList);
                            break;
                        case 'DSoftsidecapacities':
                            DSoftsidecapacities = parseValueList(valueList);
                            break;
                        case 'DHardsidecapacities':
                            DHardsidecapacities = parseValueList(valueList);
                            break;
                        case 'LTSoftsidecapacities':
                            LTSoftsidecapacities = parseValueList(valueList);
                            break;
                        case 'LTHardsidecapacities':
                            LTHardsidecapacities = parseValueList(valueList);
                            break;
                        case 'CCSoftsidecapacities':
                            CCSoftsidecapacities = parseValueList(valueList);
                            break;
                        case 'CCHardsidecapacities':
                            CCHardsidecapacities = parseValueList(valueList);
                            break;
                        default:
                        // console.log(`Unrecognized key: ${key}`);
                    }
                }
            });
            return performCalculations();
        } catch (err) {
            console.error("Error reading the file:", err);
        }
    };

    const performCalculations = () => {
        const INF = 1e9;
        let adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(INF));

        for (let i = 0; i < nodes.length; i++) {
            adjMatrix[i][i] = 0;
        }

        for (let key in Asidedistances) {
            let [node1, node2] = key.split("_");
            let index1 = nodes.indexOf(node1);
            let index2 = nodes.indexOf(node2);
            adjMatrix[index1][index2] = Asidedistances[key];
            adjMatrix[index2][index1] = Asidedistances[key];
        }
        for (let k = 0; k < nodes.length; k++) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = 0; j < nodes.length; j++) {
                    if (adjMatrix[i][j] > adjMatrix[i][k] + adjMatrix[k][j]) {
                        adjMatrix[i][j] = adjMatrix[i][k] + adjMatrix[k][j];
                    }
                }
            }
        }

        function printMatrix(matrix, nodes) {
            console.log('\t' + nodes.join('\t'));

            matrix.forEach((row, index) => {
                console.log(nodes[index] + '\t' + row.map(n => n === INF ? 'INF' : n.toFixed(3)).join('\t'));
            });
        }


        // printMatrix(adjMatrix, nodes);



        function getCombinations(array) {
            let result = [];
            let f = function (prefix, array) {
                for (let i = 0; i < array.length; i++) {
                    result.push(prefix.concat(array[i]));
                    f(prefix.concat(array[i]), array.slice(i + 1));
                }
            }
            f([], array);
            return result;
        }

        let allCombinations = getCombinations(nodes);

        let subsetInfo = [];

        for (let combination of allCombinations) {
            let totalCapacity = combination.reduce((sum, node) => sum + ASoftsidecapacities[node], 0);

            let maxDistanceInSubset = 0; // Initialize to 0
            for (let i = 0; i < combination.length; i++) {
                for (let j = i + 1; j < combination.length; j++) {
                    let index1 = nodes.indexOf(combination[i]);
                    let index2 = nodes.indexOf(combination[j]);
                    maxDistanceInSubset = Math.max(maxDistanceInSubset, adjMatrix[index1][index2]);
                }
            }
            subsetInfo.push({
                subset: combination,
                totalCapacity: totalCapacity,
                distance: maxDistanceInSubset
            });
        }

        subsetInfo.sort((a, b) => b.totalCapacity - a.totalCapacity);
        // console.log(Asidecapacities1);
        const targetStudentsArray = [capacities['A'] - data_from_Nodes[data_from_Nodes.length - 1].ASIDE];
        // console.log(targetStudentsArray)
        let results;

        for (let targetStudents of targetStudentsArray) {
            let validSubsets = subsetInfo.filter(info => info.totalCapacity >= targetStudents);
            // console.log(targetStudents);

            validSubsets.sort((a, b) => {
                if (a.subset.length !== b.subset.length) {
                    return a.subset.length - b.subset.length;
                }
                if (a.distance !== b.distance) {
                    return a.distance - b.distance;
                }
                return b.totalCapacity - a.totalCapacity;
            });

            let optimalSubset = validSubsets;

            let distance1 = optimalSubset.distance;
            if (targetStudents >= 184) {
                for (let x of validSubsets) {
                    if (x.distance == distance1 && x.subset.includes("601") && x.subset.includes("602") && x.subset.includes("603") && x.subset.includes("604") && x.subset.includes("605")) {
                        optimalSubset = x;
                        break;
                    }
                }
            }
            optimalSubset.sort((a, b) => a.totalCapacity - b.totalCapacity);
            // console.log(`Optimal subset for ${targetStudents} students with minimum rooms:`, optimalSubset[0]);
            let ASubset = [];
            for (let i = 0; i < data_from_Nodes.length - 1; i++) {
                if (data_from_Nodes[i].ClassRoom == 'A') {
                    ASubset.push(data_from_Nodes[i].z);
                }
            }
            ASubset.sort((a, b) => b.temp1 - a.temp1);
            // console.log(ASubset);
            // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const sortedRooms = optimalSubset[0].subset.sort((a, b) => ASoftsidecapacities[b] - ASoftsidecapacities[a]);

            // Function to allocate courses to rooms
            function allocateCoursesToRooms(data, sortedRooms, capacity) {
                let allocation = {}; // Tracks room allocations
                sortedRooms.forEach(room => allocation[room] = []);

                while (data.length > 0) {
                    let course = data.shift(); // Get the course with the highest number of students
                    let allocated = false;

                    for (let room of sortedRooms) {
                        if (course.temp1 <= capacity[room]) {
                            allocation[room].push({ ...course, temp1: course.temp1 });
                            capacity[room] -= course.temp1; // Update room capacity
                            allocated = true;
                            break;
                        }
                    }

                    if (!allocated) {
                        // If the course couldn't be fully allocated to one room
                        let roomForAllocation = sortedRooms.find(room => capacity[room] > 0);
                        if (roomForAllocation) {
                            let allocatableStudents = capacity[roomForAllocation];
                            allocation[roomForAllocation].push({ courseName1: course.courseName1, temp1: allocatableStudents });
                            course.temp1 -= allocatableStudents; // Update remaining students
                            capacity[roomForAllocation] = 0; // Update room capacity

                            // Insert the course back into data array in sorted order
                            let index = data.findIndex(item => item.temp1 < course.temp1);
                            if (index === -1) {
                                data.push(course);
                            } else {
                                data.splice(index, 0, course);
                            }
                        }
                    }
                }

                return allocation;
            }
            // function allocateCoursesToRooms(data, sortedRooms, softCapacity, hardCapacity) {
            //     let allocation = {}; // Tracks room allocations
            //     sortedRooms.forEach(room => allocation[room] = []);
            
            //     while (data.length > 0) {
            //         let course = data.shift(); // Get the course with the highest number of students
            //         let allocated = false;
            
            //         for (let room of sortedRooms) {
            //             // If either capacity is zero, skip this room
            //             if (softCapacity[room] === 0 || hardCapacity[room] === 0) {
            //                 softCapacity[room] = 0; // Ensure both capacities are set to zero
            //                 hardCapacity[room] = 0;
            //                 continue; // Skip to the next room
            //             }
            
            //             if (course.temp1 <= softCapacity[room]) {
            //                 // Allocate within soft capacity
            //                 allocation[room].push({...course, temp1: course.temp1});
            //                 softCapacity[room] -= course.temp1;
            //                 hardCapacity[room] -= course.temp1; // Deduct from hard capacity as well
            //                 allocated = true;
            //                 break;
            //             } else if (course.temp1 <= hardCapacity[room]) {
            //                 // Allocate within hard capacity if soft capacity exceeded
            //                 allocation[room].push({...course, temp1: course.temp1});
            //                 hardCapacity[room] -= course.temp1; // Only deduct from hard capacity
            //                 allocated = true;
            //                 break;
            //             }
            //         }
            
            //         if (!allocated) {
            //             // Attempt to find a room for partial allocation based on remaining hard capacity
            //             for (let room of sortedRooms) {
            //                 if (hardCapacity[room] > 0) { // There's some capacity left
            //                     let allocatableStudents = Math.min(course.temp1, hardCapacity[room]);
            //                     allocation[room].push({courseName1: course.courseName1, temp1: allocatableStudents});
            //                     course.temp1 -= allocatableStudents;
            //                     hardCapacity[room] -= allocatableStudents;
            
            //                     // Ensure both capacities are zero if one reaches zero
            //                     if (softCapacity[room] === 0 || hardCapacity[room] === 0) {
            //                         softCapacity[room] = 0;
            //                         hardCapacity[room] = 0;
            //                     }
            
            //                     if (course.temp1 > 0) {
            //                         // If there are still unallocated students, reinsert the course with remaining students
            //                         let index = data.findIndex(item => item.temp1 < course.temp1);
            //                         if (index === -1) {
            //                             data.push(course);
            //                         } else {
            //                             data.splice(index, 0, course);
            //                         }
            //                     }
            //                     break; // Exit the loop after partial allocation
            //                 }
            //             }
            //         }
            //     }
            
            //     return allocation;
            // }
            // const allocationResult = allocateCoursesToRooms(ASubset, sortedRooms, ASoftsidecapacities,AHardsidecapacities);
            const allocationResult = allocateCoursesToRooms(ASubset, sortedRooms, ASoftsidecapacities);
            // console.log(allocationResult);


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            optimalSubset = optimalSubset[0];
            let data_to_return = { targetStudents, optimalSubset };
            results = allocationResult;
        }
        return results;
    };
    return processFile();
}
module.exports = Aside;