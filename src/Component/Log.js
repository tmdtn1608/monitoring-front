import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import '../CSS/Process.css'
import EditModal from './ProcessEditModal';
import AddModal from './ProcessAddModal';

function Log() {
    const [logList, setLogList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const paginationModel = { page: 0, pageSize: 25 };

    const columns = [
        { field : 'Idx', headerName : 'ID', width : 70},
        { field : 'Device', headerName : '장치', width : 180 },
        { field : 'ActType', headerName : '행동유형', width : 180 },
        { field : 'RegDate', headerName : '날짜', width : 220 },
        // {
        //     field: 'Action',
        //     headerName: ' ',
        //     width: 300,
        //     renderCell: (params) => (
        //         <>
        //             <Button 
        //                 className='Control-Btn'
        //                 onClick={() => delLog(params.row)}>
        //                 로그 삭제
        //             </Button>
        //         </>
        //     ),
        // },
    ];
/*
    {"idx" : -1 } 또는
    {"idx" : 1 }
*/
    const delLog = () => {

    };

    const delAllLog = () => {

    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await axios.get(process.env.REACT_APP_ALL_LOG_URL);
            setLogList(response.data);
        };
        getData();
    }, [])
    

    return (
        <div className='License-Table-container'>
            {/* <div className='License-Button-container'>
                <Button onClick={async() => delAllLog()}>프로세스 추가</Button>
            </div> */}
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={logList}
                    columns={columns}
                    getRowId={(row) => row.Idx}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 25, 50]}
                    sx={{ border: 0 }}
            />
            </Paper>
        </div>
    );
}

export default Log;