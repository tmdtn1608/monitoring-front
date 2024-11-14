import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import '../CSS/Process.css'
import EditModal from './ProcessEditModal';
import AddModal from './ProcessAddModal';


function Process() {
    // API 값 저장을 위한 State
    const [processList, setProcessList] = useState(null);
    // 로딩 및 에러상태를 관리하기 위한 State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editRow, setEditRow] = useState(null);
    // modal control
    const [editShow, setEditShow] = useState(false);
    const [addShow, setAddShow] = useState(false);
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
    
    const handleAddShow = () => setAddShow(true);
    const handleAddClose = (reload) => {
        setAddShow(false);
        if(reload) {
            window.location.reload();
        }
    }

    const paginationModel = { page: 0, pageSize: 25 };
    
    const columns = [
        { field: 'Idx', headerName: 'ID', width: 70 },
        { field: 'ProcessName', headerName: '프로세스명', width: 200 },
        { field :'Device', headerName:'디바이스', width:160 },
        { field: 'IsBlack', headerName: '블랙/화이트', width: 100,
            renderCell:(params) => (params.value === 1 ? "블랙" : "화이트")
        },
        {
            field:"Memo",
            headerName: "메모",
            width : 250,
            renderCell: (params) => (params.value === null ? '' : params.value),
        },
        {
            field: 'IsAuto',
            headerName: '자동탐지',
            //   description: 'This column has a value getter and is not sortable.',
            //   sortable: false,
            width: 100,
            renderCell: (params) => (params.value === 1 ? '자동' : '수동'),
        },
        {
            field: 'RegDate', headerName: '등록일', width: 220,
            renderCell:(params) => (params.value === null ? '-' : params.value)
        },
        {
            field: 'Action',
            headerName: ' ',
            width: 300,
            renderCell: (params) => (
                <>
                    <Button className='Control-Btn' onClick={() => handleEditShow(params.row)}>
                        프로세스 수정
                    </Button>
                    <Button 
                        className='Control-Btn'
                        onClick={() => delProcessBtnClick(params.row)}>
                        프로세스 삭제
                    </Button>
                </>
            ),
        },
    ];

    const delProcessBtnClick = async (row) => {
        console.log(`Button clicked for ID: ${row.ProcessName}`);
        let param = {"ProcessName" : row.ProcessName};
        axios.delete('http://localhost:5000/process',{
            data: param,
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            console.log('delete confirm');
            const response = await axios.get('http://localhost:5000/process');
            setProcessList(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const addProcessBtnClick = async () => {
        handleAddShow();
    }
      
    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/process');
            setProcessList(response.data);
        };
        getData();
    },[]);
    
    return (
        <div className='License-Table-container'>
            <div className='License-Button-container'>
                <Button onClick={async() => addProcessBtnClick()}>프로세스 추가</Button>
            </div>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={processList}
                    columns={columns}
                    getRowId={(row) => row.Idx}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[15, 25, 50]}
                    sx={{ border: 0 }}
            />
            </Paper>
            <EditModal data={editRow} show={editShow} close={handleEditClose}/>
            <AddModal show={addShow} close={handleAddClose}/>
        </div>
    );

}

export default Process;