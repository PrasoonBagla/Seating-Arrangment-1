const fs = require('fs');
const nodes = ["A", "C", "D", "CC", "LT12", "LT34"];
const path = require('path');
const dataFilePath = path.join(__dirname, 'data1.json'); // Path to the data file
const TargetDatafromExcel = require('./excel')
let securityPersonnel = {};
let invigilators = {};
let weights = {};
let distances = {};
let capacities = {};
let Asidedistances = {};
let ASoftsidecapacities = {};
let AHardsidecapacities = {};
let CSoftsidecapacities = {};
let CHardsidecapacities = {};
let Csidedistances = {};

const Node = async (entriesCount) => {
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
        const data = await fs.promises.readFile(filePath, { encoding: 'utf8' });
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
                    case 'Csidedistances':
                        Csidedistances = parseValueList(valueList);
                        break;
                    case 'AHardsidecapacities':
                        AHardsidecapacities = parseValueList(valueList);
                        break;
                    case 'CSoftsidecapacities':
                        CSoftsidecapacities = parseValueList(valueList);
                        break;
                    case 'CHardsidecapacities':
                        CHardsidecapacities = parseValueList(valueList);
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
    let nodeAssignments = {}; // Tr
    let adjMatrix = Array(nodes.length).fill().map(() => Array(nodes.length).fill(INF));

    for (let i = 0; i < nodes.length; i++) {
        adjMatrix[i][i] = 0;
    }

    for (let key in distances) {
        let [node1, node2] = key.split("_");
        let index1 = nodes.indexOf(node1);
        let index2 = nodes.indexOf(node2);
        adjMatrix[index1][index2] = distances[key];
        adjMatrix[index2][index1] = distances[key];
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
    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            let v_ij = ((capacities[nodes[i]] + capacities[nodes[j]]) / (invigilators[nodes[i]] + invigilators[nodes[j]]));
            let s_ij = (securityPersonnel[nodes[i]] + securityPersonnel[nodes[j]]);
            adjMatrix[i][j] = weights[0] * adjMatrix[i][j] + weights[1] * v_ij + weights[2] * s_ij;
            adjMatrix[i][j] = adjMatrix[i][j].toPrecision(3);
        }
    }

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

    const calculateTotalCapacity = (combination) => {
        return combination.reduce((sum, node) => sum + capacities[node], 0);
    };

    const updateSubsetInfo = () => {
        subsetInfo = allCombinations.map(combination => {
            let totalCapacity = calculateTotalCapacity(combination);

            let maxDistanceInSubset = 0;
            for (let i = 0; i < combination.length; i++) {
                for (let j = i + 1; j < combination.length; j++) {
                    let index1 = nodes.indexOf(combination[i]);
                    let index2 = nodes.indexOf(combination[j]);
                    maxDistanceInSubset = Math.max(maxDistanceInSubset, adjMatrix[index1][index2]);
                }
            }
            return {
                subset: combination,
                totalCapacity: totalCapacity,
                distance: maxDistanceInSubset
            };
        });
    };

    const targetStudentsArray = [];
    const courseName = [];
    // console.log(entriesCount);
   updateSubsetInfo(); // Initial update
    // console.log(ans);
    // console.log(TargetDatafromExcel.entriesCount['ECON F212']);
    for( x in entriesCount)
    {
        // console.log(x);
        courseName.push(x);
        targetStudentsArray.push(entriesCount[x]);
        // console.log(entriesCount[x]);
    }
    let indices = Array.from(targetStudentsArray.keys());

    // Sort the indices array based on the values in targetStudentsArray in decreasing order
    indices.sort((a, b) => targetStudentsArray[b] - targetStudentsArray[a]);
    
    // Use the sorted indices to reorder both targetStudentsArray and courseName
    let sortedTargetStudentsArray = indices.map(i => targetStudentsArray[i]);
    let sortedCourseName = indices.map(i => courseName[i]);
    
    // If you want to replace the original arrays with the sorted ones
    targetStudentsArray.splice(0, targetStudentsArray.length, ...sortedTargetStudentsArray);
    courseName.splice(0, courseName.length, ...sortedCourseName);
    let optimalSubset;
    let i = 0;
    let results = [];
    let data_to_send = [];
    for ( let targetStudents of targetStudentsArray) {
        let validSubsets = subsetInfo.filter(info => info.totalCapacity >= targetStudents);
        validSubsets.sort((a, b) => {
            if (a.distance !== b.distance) {
                return a.distance - b.distance;
            } else {
                return b.totalCapacity - a.totalCapacity;
            }
        });
        validSubsets.sort((a, b) => a.totalCapacity - b.totalCapacity);
        optimalSubset = validSubsets[0];
        //  for(let i = 0;i<3;i++)
        //  {
        //     if(validSubsets[i].distance == 0)
        //     {
        //         optimalSubset = validSubsets[i];
        //         break;
        //     }
        //  }
        //  console.log(validSubsets);
        // console.log(optimalSubset);
        if(targetStudents == 412){
        // console.log(`Optimal subset for validSubsets ${targetStudents} students:`, validSubsets);
        // console.log(`Optimal subset for validSubsets[1] ${targetStudents} students:`, validSubsets[1]);
        // console.log(`Optimal subset for validSubsets[2] ${targetStudents} students:`, validSubsets[2]);
        // console.log(`Optimal subset for optimalSubset ${targetStudents} students:`, capacities);
        }
        let data_to_return = {targetStudents,optimalSubset};
        results.push(data_to_return);
        let excessCapacity = optimalSubset.totalCapacity - targetStudents;
        // console.log(`Excess capacity: ${excessCapacity}`);
        let maxCapNode = optimalSubset.subset.reduce((maxNode, node) => capacities[node] >= capacities[maxNode] ? node : maxNode, optimalSubset.subset[0]);
        // console.log("MAXICAPNODE",maxCapNode);
        // Update the capacities
        let final_output = [];

        optimalSubset.subset.forEach(node => {
            let temp = capacities[node];
            // console.log("NODE TEMP",node,temp);
            final_output.push({node,temp});
            if (node === maxCapNode) {
                // final_output.push({node,capacities[node]});
                // console.log("NODE IS",node);
                // console.log("CAPACITY IS",capacities[node]);
                capacities[node] = Math.max(0,  excessCapacity);
            } else {
                // console.log("NODE IS",node);
                // console.log("CAPACITY IS",capacities[node]);
                capacities[node] = 0;
            }
        });
        // if(targetStudents == 412){
        // console.log("Updated capacities:", capacities);
        // console.log("Course with capacity",targetStudents);
        // console.log("CourseName is ",courseName[i]);
        // console.log("subset is",optimalSubset.subset);}
    //    
        final_output.sort((a,b) => a.temp-b.temp);
        // console.log("FinalOutput",final_output);
        let capaci = targetStudents;
        // console.log("CAPACI",capaci);
        let temp1;
        let courseName1 = courseName[i];
        for(let j = 0;j<final_output.length;j++)
        {
            // console.log("CAPACI",capaci);
            let Class_filled_capacity = final_output[j].temp;
            // console.log("Class_filled_capacity",Class_filled_capacity);
            let ClassRoom = final_output[j].node;
            // console.log("classroom",ClassRoom)
            if(final_output[j].temp < capaci)
            {
                temp1 = Class_filled_capacity
                let z = {courseName1,temp1}
                data_to_send.push({ClassRoom,z});
                capaci = capaci-Class_filled_capacity;
            }
            else
            {   temp1 = capaci;
                 let z = {courseName1,temp1}
                data_to_send.push({ClassRoom,z});
                capaci = capaci-Class_filled_capacity;
            }
        }
        // console.log('  ');
        console.log("datatosend",data_to_send);
        i++;
        updateSubsetInfo(); // Update for next iteration
        // console.log("Capacities",capacities);
    }
    // console.log(capacities["A"]);
    // console.log(capacities["C"]);
    ASIDE = capacities["A"];
    CSIDE = capacities["C"];
    // console.log("HEFHBAWF" + CSIDE);
    // results.push(data_to_return);

   
    data_to_send.push({ASIDE,CSIDE});
      results.push({ASIDE,CSIDE});
    //   console.log(results);
    // console.log(data_to_send);
    return data_to_send;
};
  return processFile();
}
module.exports = Node;  