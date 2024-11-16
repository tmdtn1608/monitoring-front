import React, { useEffect, useState, createContext, useRef } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import '../CSS/Realtime.css'
import AddModal from './RealtimeAddModal';
import TerminateModal from './ProcessTerminateModal';

function RealTime() {

    // API 값 저장을 위한 State
    const [alive,setAlive] = useState([]);
    const [device, setDevice] = useState('');
    const [historyList, setHistoryList] = useState(null);
    // 로딩 및 에러상태를 관리하기 위한 State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const paginationModel = { page: 0, pageSize: 25 };

    const [addShow, setAddShow] = useState(false);
    const [terminateShow, setTerminateShow] = useState(false);

    const [addRow, setAddrow] = useState({"device" :"","row": ""});
    const [terminateRow, setTerminateRow] = useState({"device" :"","row": ""});

    const [dataInterval, setDataInterval] = useState(-1);

    const deviceListRef = useRef(null);

    useEffect(() => {
        const getData = async () => {
            try {
              const response = await axios.get(process.env.REACT_APP_ALIVE_URL);
              setAlive(response.data.map(item => item.Device));
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false); // 데이터 로딩 완료 후 false로 설정
            }
        };

        const startInterval = () => {
            getData(); // 첫 번째 요청을 보냄
            setTimeout(startInterval, 10000); // 5초 후에 다시 호출
        };

          startInterval();
    }, []);

    useEffect(() => {
        if(device !== '' && !alive.includes(device)) {
            window.location.reload();
        }
    },[alive]);

    useEffect(() => {
        console.log(`current device ${device}`);
        console.log(`current dataInterval ${dataInterval}`);
        if (!loading && device) {
            let intervalId = 0;
            console.log(`device chk : ${device === ''}`)
            let param = {"device" : device };
            const getData = async () => {
                axios.get(process.env.REACT_APP_LOG_URL,param)
                .then((res) => {
                    let arr = res.data.map(item => item.Process);
                    setHistoryList(arr[0].process);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
            const startInterval = () => {
                getData(); // 첫 번째 요청을 보냄
                intervalId = setTimeout(startInterval, 10000); // 5초 후에 다시 호출
            };
            setDataInterval(intervalId);
    
            startInterval();
        } else {
            // TODO : 인터벌 초기화
        }

    },[device,loading]);
    
/*
{
    "pid":1,
    "name":"launchd"
    ,"status":"running",
    "cpu_percent":null,
    "memory_percent":null},
*/

      const columns = [
        { field: 'pid', headerName: 'PID', width: 100 },
        { field: 'name', headerName: '프로세스명', width: 330 },
        { field: 'status', headerName: '상태', width : 120 },
        { field: 'cpu_percent', headerName: 'cpu 사용률', width: 120},
        { field: 'memory_percent', headerName: 'memory 사용률', width: 120},
        {
            field: 'Action',
            headerName: ' ',
            width: 300,
            renderCell: (params) => (
                <>
                    <Button
                        className='Control-Btn'
                        onClick={() => handleAddShow(device, params.row)}>
                        프로세스 등록
                    </Button>
                    <Button className='Control-Btn' 
                        onClick={() => handleTerminateProcess(device, params.row)}>
                        프로세스 종료
                    </Button>
                </>
            ),
        },
        
    ];

    const handleAddShow = (device, row) => {
        setAddrow({"device" : device,"row":row});
        setAddShow(true);
    }
    const handleAddClose = (reload) => {
        setAddShow(false);
        if(reload) {
            window.location.reload();
        }
    }

    const handleTerminateProcess = (device, row) => {
        setTerminateRow({"device" : device,"row":row});
        setTerminateShow(true);
    };

    const ChangeAlive = (event) => {
        const selectedItem = event.target.value;
        if (selectedItem && selectedItem !== device) {
            setDevice(selectedItem);
        }
    }
    
    return (
        <div className='Table-container'>
            <div className='License-Button-container'>
                <Form.Select
                    ref={deviceListRef}
                    className='live-list'
                    value={device}
                    onChange={ChangeAlive}>
                    <option value={''}></option>
                    {alive.map((device, index) => (
                        <option key={index} value={device}>
                            {device}
                        </option>
                    ))}
                </Form.Select>
            </div>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={historyList}
                    columns={columns}
                    getRowId={(row) => row.pid}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 25, 50]}
                    sx={{ border: 0 }}
            />
            </Paper>
            <AddModal data={addRow} show={addShow} close={handleAddClose}/>
            <TerminateModal 
                data={terminateRow} show={terminateShow} close={handleAddClose}/>
        </div>
    );

}

export default RealTime;