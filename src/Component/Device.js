import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

function Device() {
    // API 값 저장을 위한 State
    const [deviceList, setDeviceList] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paginationModel = { page: 0, pageSize: 25 };

    const columns = [
        { field: 'Idx', headerName: 'ID', width: 70 },
        { field: 'mac', headerName: '디바이스(맥주소)', width: 330 },
        { field: 'IsUsed', headerName: '라이센스 사용여부', width: 330,
            renderCell:(params) => (params.value === 1 ? '사용중' : '미사용')
        },
        {
            field: 'Action', // New field for the action column
            headerName: ' ', // Header for the new column
            width: 150,
            renderCell: (params) => (
                <Button onClick={() => delDeviceBtnClick(params.row)}>
                    디바이스 삭제
                </Button>
            ),
        },
        
    ];

    const delDeviceBtnClick = async (row) => {
        console.log(`Button clicked for ID: ${row.mac}`);
        let param = {"mac" : row.mac};
        // Add your desired functionality here
        axios.delete('http://localhost:5000/device',{
            data: param,
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const response = await axios.get('http://localhost:5000/device');
            setDeviceList(response.data); // 응답값을 상태에 저장
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/device');
            setDeviceList(response.data); // 응답값을 상태에 저장
        };
        getData();
    },[]);

    return (
        <div className='License-Table-container'>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={deviceList}
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

export default Device;