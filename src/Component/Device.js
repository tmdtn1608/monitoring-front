import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import EditModal from './DeviceEditModal';

function Device() {
    // API 값 저장을 위한 State
    const [deviceList, setDeviceList] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const paginationModel = { page: 0, pageSize: 25 };

    // modal control
    const [editShow, setEditShow] = useState(false);
    const handleEditShow = (row) => {
        setEditRow(row);
        setEditShow(true);
    }
    const handleEditClose = (reload) => {
        setEditRow(null);
        setEditShow(false);
        if(reload) {
            window.location.reload();
        }
    }

    const columns = [
        { field: 'Idx', headerName: 'ID', width: 70 },
        { field: 'mac', headerName: '디바이스(맥주소)', width: 160 },
        { field : 'Nick', headerName: '닉네임', width : 200 },
        { field: 'IsUsed', headerName: '라이센스 사용여부', width: 150,
            renderCell:(params) => (params.value === 1 ? '사용중' : '미사용')
        },
        {
            field: 'Action',
            headerName: ' ',
            width: 300,
            renderCell: (params) => (
                <>
                    <Button
                        className='Control-Btn'
                        onClick={() => handleEditShow(params.row)}>
                        디바이스 수정
                    </Button>
                    <Button className='Control-Btn' 
                        onClick={() => delDeviceBtnClick(params.row)}>
                        디바이스 삭제
                    </Button>
                </>
            ),
        },
        
    ];

    const delDeviceBtnClick = async (row) => {
        console.log(`Button clicked for ID: ${row.mac}`);
        let param = {"mac" : row.mac};
        axios.delete(process.env.REACT_APP_DEVICE_URL,{
            data: param,
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const response = await axios.get(process.env.REACT_APP_DEVICE_URL);
            setDeviceList(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            const response = await axios.get(process.env.REACT_APP_DEVICE_URL);
            setDeviceList(response.data);
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
            <EditModal data={editRow} show={editShow} close={handleEditClose} />
        </div>
    );
    
}

export default Device;