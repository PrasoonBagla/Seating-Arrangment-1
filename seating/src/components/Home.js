import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Box from '@mui/material/Box';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});
const Entries = styled('div')({
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    gap: '20px'

});
const DownloadButton = styled(Button)({

    gap: '20px',

});
const TBody = styled('tbody')({
    // Keeping padding here won't affect cells directly, might consider styling rows or cells instead
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center'
});

const Tableheading = styled('thead')({
    // Text alignment and font styling can go here, flex properties are not effective for thead
    display:'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center'
});

const TableheadingTR = styled('th')({
    padding: '10px',
    border: '2px solid black', // Add border to header cells
    textAlign: 'center', // Ensure text is centered if that's desired
});

const Table = styled('table')({
    // display: 'flex',
    marginLeft: '20%',
    width: '50%', // Adjust as needed
    borderCollapse: 'separate', // Use 'separate' to apply spacing between cells
    borderSpacing: '2px', // This adds space between cells, simulating a border effect
    // Removed flex properties as they don't apply well to table elements
});

// Additional styles for table rows and data cells
const TR = styled('tr')({
    // Style for table row, if needed
    textAlign: 'center',
    alignContent: 'center',
    paddingLeft: '10px',
    justifyContent: 'center',
    alignContent: 'center'
    
});
const TR1 = styled('tr')({
    // Style for table row, if needed
    textAlign: 'center',
    alignContent: 'center',
    display: 'flex',
    gap:'80px',
    paddingLeft: '10px',
    marginBottom: '10px',
    marginTop: '10px',
    justifyContent: 'center',
    alignContent: 'center'
    
});
const Data = styled('div')({
    // Style for table row, if needed
    display: 'flex',
    flexDirection:'column',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center'
    
});
const TD = styled('td')({
    padding: '10px',
    paddingLeft: '10px',
    border: '2px solid black', // Ensure cells have borders
    textAlign: 'center', // Center the content
});
const TD1 = styled('td')({
    padding: '10px',
    paddingLeft: '10px',
    // border: '2px solid black', // Ensure cells have borders
    textAlign: 'center', // Center the content
});
const Home = () => {
    const [file, setFile] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [dataFromAside, setDataFromAside] = useState(''); // State
    const [dataFromCside, setDataFromCside] = useState(''); // State
    const [dataFromLT12side, setDataFromLT12side] = useState(''); // State
    const [dataFromLT34side, setDataFromLT34side] = useState(''); // State
    const [dataFromCCside, setDataFromCCside] = useState(''); // State
    const [dataFromDside, setDataFromDside] = useState(''); // State
    const [dataFromNodes, setDataFromNodes] = useState(''); // State
    const [dataFromExcel, setDataFromExcel] = useState(''); // State
    const [uniqueDates, setUniqueDates] = useState(JSON.parse(localStorage.getItem('uniqueDates')) || []);
    const [uniqueTimes, setUniqueTimes] = useState(JSON.parse(localStorage.getItem('uniqueTimes')) || []);
    const data = { ...dataFromAside, ...dataFromCside, ...dataFromDside, ...dataFromCCside, ...dataFromLT12side, ...dataFromLT34side };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const dates = extractUniqueDates(data);
            const times = extractUniqueTimes(data);
            setUniqueDates(dates);
            setUniqueTimes(times);
            localStorage.setItem('uniqueDates', JSON.stringify(dates));
            localStorage.setItem('uniqueTimes', JSON.stringify(times));
        };
        const formData = new FormData();
        formData.append('file', file); // Append the original file

        try {
            // Adjust the URL to your backend endpoint as needed
            const response = await axios.post('http://localhost:9000/uploaddataexcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        reader.readAsBinaryString(file);
    };
    const handleDataUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file); // Append the original file

        try {
            // Adjust the URL to your backend endpoint as needed
            const response = await axios.post('http://localhost:9000/uploaddata', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
   
    // Function to extract unique dates from data
    const extractUniqueDates = (data) => {
        const dates = new Set();
        data.forEach(item => {
            if (item['Date']) {
                dates.add(item['Date'].toString());
            }
        });
        return Array.from(dates);
    };

    // Function to extract unique times from data
    const extractUniqueTimes = (data) => {
        const times = new Set();
        data.forEach(item => {
            if (item['Time']) {
                times.add(item['Time'].toString());
            }
        });
        return Array.from(times);
    };
    // const runBackendScript = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:9000/run-script');
    //         console.log('Script output:', response.data);
    //     } catch (error) {
    //         console.error('Error running script:', error);
    //     }
    // };
    const Aside = () => {
        let ans = dataFromAside[0].targetStudents;
        if (ans == 0)
            return "A side is not used";
        else
            return "Room used are " + JSON.stringify(dataFromAside[0].optimalSubset.subset);
        // console.log(dataFromAside);
    }
    // const Cside = () => {
    //     let ans = dataFromCside[0].targetStudents;
    //     if (ans == 0)
    //         return "C side is not used";
    //     else
    //         return "Room used are " + JSON.stringify(dataFromCside[0].optimalSubset.subset) + " with Total capacity " + JSON.stringify(dataFromCside[0].optimalSubset.totalCapacity);
    //     // console.log(dataFromAside);

    // }
    const Nodes = () => {
        // console.log(dataFromNodes);
        let ans;
        let finalans = [];
        for (let i = 0; i < dataFromNodes.length - 1; i++) {
            let k = dataFromNodes[i].z;

            ans = JSON.stringify(dataFromNodes[i].ClassRoom) + " will have Course " + JSON.stringify(k.courseName1) + " with total Capacity " + JSON.stringify(k.temp1) + "\n";
            finalans.push(ans);
        }
        // return JSON.stringify(dataFromNodes);
        return finalans;
        // console.log(dataFromAside);
    }
    // const Nodes1 = () => {
    //     let ans;
    //     let finalans = [];
    //     for (let i = 0; i < dataFromNodes.length - 1; i++) {
    //         let k = dataFromNodes[i].optimalSubset;

    //         ans = JSON.stringify(dataFromNodes[i].targetStudents) + " students " + "will be in classrooms "  +JSON.stringify(k.subset)  + "\n";
    //         finalans.push(ans);
    //     }
    //     return finalans;
    // }
    const handleSearch = async () => {
        const dataToSend = {
            date: date,
            time: time
        };
        axios.post('http://localhost:9000/', dataToSend)
            .then(response => {
                // console.log('Response from server:', response.data.data_from_Nodes);
                setDataFromAside(response.data.data_from_Aside);
                setDataFromCside(response.data.data_from_Cside.CFinal);
                setDataFromDside(response.data.data_from_Cside.DFinal);
                setDataFromLT12side(response.data.data_from_Cside.LT12Final);
                setDataFromLT34side(response.data.data_from_Cside.LT34Final);
                setDataFromCCside(response.data.data_from_Cside.CCFinal);
                setDataFromDside(response.data.data_from_Cside.DFinal);
                // console.log(response.data.data_from_Cside);
                setDataFromNodes(response.data.data_from_Nodes);
                setDataFromExcel(response.data.data_from_excel);
                // Handle the response here
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Handle the error here
            });
        // runBackendScript();
    };
    const downloadroomwise = async () => {
         const ispressed = {uniqueDates,uniqueTimes};
        axios.post('http://localhost:9000/downloadroomwise', ispressed)
            .then(response => {
                console.log('Response from server:', response.data);
                
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Handle the error here
            });
        // runBackendScript();
    };
    const downloadcoursewise = async () => {
        const ispressed = {uniqueDates,uniqueTimes};
        axios.post('http://localhost:9000/downloadcoursewise', ispressed)
            .then(response => {
                console.log('Response from server:', response.data);
                
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Handle the error here
            });
        // runBackendScript();
    };
    const matrixwise = async () => {
        const ispressed = {uniqueDates,uniqueTimes};
        axios.post('http://localhost:9000/matrixwise', ispressed)
            .then(response => {
                console.log('Response from server:', response.data);
                
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Handle the error here
            });
        // runBackendScript();
    };
    const coursesData = Object.entries(dataFromCCside).reduce((acc, [room, courses]) => {
        courses.forEach(({ courseName1, temp1 }) => {
            if (!acc[courseName1]) {
                acc[courseName1] = [];
            }
            acc[courseName1].push(`${room} (${temp1})`);
        });
        return acc;
    }, {});
    return (
        <div>
            <h1>Seating Arrangement</h1>
            <Entries>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} style={{ marginBottom: '8px' }}>
                    Upload Excel Sheet
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileUpload}
                    />
                </Button>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} style={{ marginBottom: '8px' }}>
                    Upload Data Text File
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleDataUpload}
                    />
                </Button>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="demo-select-small-date-label">Date</InputLabel>
                    <Select
                        labelId="demo-select-small-date-label"
                        id="demo-select-small-date"
                        value={date}
                        label="Date"
                        onChange={handleDateChange}
                    >
                        {uniqueDates.map((uniqueDate, index) => (
                            <MenuItem key={index} value={uniqueDate}>{uniqueDate}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="demo-select-small-time-label">Time</InputLabel>
                    <Select
                        labelId="demo-select-small-time-label"
                        id="demo-select-small-time"
                        value={time}
                        label="Time"
                        onChange={handleTimeChange}
                    >
                        {uniqueTimes.map((uniqueTime, index) => (
                            <MenuItem key={index} value={uniqueTime}>{uniqueTime}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ '& button': { m: 1 } }}>
                    <Button variant="contained" size="medium" onClick={handleSearch}>
                        Search
                    </Button>
                </Box>
            </Entries>
            <DownloadButton>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>}
                    onClick={downloadroomwise}
                >
                    Room wise data
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={downloadcoursewise}
                    startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>}
                >
                    Course wise data
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>}
                    onClick={matrixwise}
                >
                    Matrix wise data
                </Button>
            </DownloadButton>
            <Data>
            <Tableheading>
                <TR1>
                    <TD1>Room</TD1>
                    <TD1>Course Name</TD1>
                    <TD1>Number of Students</TD1>
                </TR1>
            </Tableheading>
            <Table>
                <TBody>
                    {Object.entries(data).map(([room, courses]) => (
                        courses.map((course, index) => (
                            <TR key={`${room}-${index}`}>
                                {index === 0 && <td rowSpan={courses.length}>{room}</td>}
                                <TD>{course.courseName1}</TD>
                                <TD>{course.temp1}</TD>
                            </TR>
                        ))
                    ))}
                </TBody>
            </Table>
            </Data>
        </div>
    );
};
export default Home;
