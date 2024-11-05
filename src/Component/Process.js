import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import '../CSS/Process.css'
import EditModal from './EditModal';
import AddModal from './AddModal';


function Process() {
    // API 값 저장을 위한 State
    const [processList, setProcessList] = useState(null);
    // 로딩 및 에러상태를 관리하기 위한 State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // modal control
    const [editShow, setEditShow] = useState(false);
    const handleEditShow = () => setEditShow(true);
    const handleEditClose = () => setEditShow(false);
    
    const [addShow, setAddShow] = useState(false);
    const handleAddShow = () => setAddShow(true);
    const handleAddClose = () => setAddShow(false);


    const paginationModel = { page: 0, pageSize: 25 };
    
    const columns = [
        { field: 'Idx', headerName: 'ID', width: 70 },
        { field: 'ProcessName', headerName: '프로세스명', width: 330 },
        { field: 'IsBlack', headerName: '블랙/화이트', width: 220,
            renderCell:(params) => (params.value === 1 ? "블랙" : "화이트")
        },
        {
            field: 'RegDate', headerName: '등록일', width: 220,
            renderCell:(params) => (params.value === null ? '-' : params.value)
        },
        {
          field: 'IsAuto',
          headerName: '자동탐지',
        //   description: 'This column has a value getter and is not sortable.',
        //   sortable: false,
          width: 120,
          renderCell: (params) => (params.value === 1 ? '자동' : '수동'),
        },
        {
            field: 'Action', // New field for the action column
            headerName: ' ', // Header for the new column
            width: 300,
            renderCell: (params) => (
                <>
                    <Button className='Control-Btn' onClick={() => handleEditShow()}>
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
        console.log(`Button clicked for ID: ${row.License}`);
        let param = {"license" : row.License};
        // Add your desired functionality here
        axios.delete('http://localhost:5000/license',{
            data: param,
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            const response = await axios.get('http://localhost:5000/license');
            setProcessList(response.data); // 응답값을 상태에 저장
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const addProcessBtnClick = async () => {
        handleAddShow()
    }
      
    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/process');
            setProcessList(response.data); // 응답값을 상태에 저장
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
            <EditModal show={editShow} close={handleEditClose}/>
            <AddModal show={addShow} close={handleAddClose}/>
        </div>
    );

}

export default Process;