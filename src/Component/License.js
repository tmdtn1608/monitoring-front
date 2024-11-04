import React, { useEffect, useState, createContext } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import '../CSS/License.css'

function License() {
    // API 값 저장을 위한 State
    const [licenseList, setLicenseList] = useState(null);
    // 로딩 및 에러상태를 관리하기 위한 State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const paginationModel = { page: 0, pageSize: 25 };

    const columns = [
        { field: 'Idx', headerName: 'ID', width: 70 },
        { field: 'License', headerName: '라이센스', width: 330 },
        { field: 'CreatedAt', headerName: '생성일', width: 220 },
        {
            field: 'ExpiredAt', headerName: '만료일', width: 220,
            renderCell:(params) => (params.value === null ? '-' : params.value)
        },
        {
          field: 'IsExpired',
          headerName: '만료여부',
        //   description: 'This column has a value getter and is not sortable.',
        //   sortable: false,
          width: 120,
          renderCell: (params) => (params.value === 1 ? 'True' : 'False'),
        },
        {
            field: 'Action', // New field for the action column
            headerName: ' ', // Header for the new column
            width: 150,
            renderCell: (params) => (
                <Button onClick={() => delLicenseBtnClick(params.row)}>
                    라이센스 삭제
                </Button>
            ),
        },
    ];

    const delLicenseBtnClick = async (row) => {
        console.log(`Button clicked for ID: ${row.License}`);
        // TODO : 삭제하기 API 연동
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
            setLicenseList(response.data); // 응답값을 상태에 저장
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const addLicenseBtnClick = async () => {
        const res = await axios.post('http://localhost:5000/license');
        console.log(res);
        const response = await axios.get('http://localhost:5000/license');
        setLicenseList(response.data); // 응답값을 상태에 저장
    }
      

    useEffect(()=>{
        const getData = async () => {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/license');
            setLicenseList(response.data); // 응답값을 상태에 저장
        };
        getData();
    },[]);

    return (
        <div className='License-Table-container'>
            <div className='License-Button-container'><Button onClick={async() => addLicenseBtnClick()}>라이센스 추가</Button></div>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={licenseList}
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

export default License;