import React, { useEffect, useState, createContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../CSS/Process.css'


function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                    >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                    History
                    </Typography>
                    <Table size="small" aria-label="purchases">
                    <TableHead>
                        <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Total price ($)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {row.history.map((historyRow) => (
                            <TableRow key={historyRow.date}>
                            <TableCell component="th" scope="row">
                            {historyRow.date}
                            </TableCell>
                            <TableCell>{historyRow.customerId}</TableCell>
                            <TableCell align="right">{historyRow.amount}</TableCell>
                            <TableCell align="right">
                            {Math.round(historyRow.amount * row.price * 100) / 100}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Box>
                </Collapse>
            </TableCell>
            </TableRow>
      </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};



function RealTime() {

    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // 웹소켓 연결
        const ws = new WebSocket('ws://localhost:5000/ws');
    
        // 웹소켓이 열렸을 때
        ws.onopen = () => {
          console.log('Connected to the WebSocket server');
          ws.send('Hello Server!');  // 서버로 메시지 전송
        };
    
        // 웹소켓이 메시지를 수신했을 때
        ws.onmessage = (event) => {
            try {
                // client에서 던저진 데이터는 blob으로 온다.
                if(typeof event.data == 'object') {
                    // 가능한 경우 JSON 파싱 시도
                    const blob = event.data;
    
                    // Blob을 텍스트로 변환
                    const reader = new FileReader();
                    
                    reader.onloadend = function() {
                        const jsonString = reader.result;
                        const parsedData = JSON.parse(jsonString);
                        console.log('Received parsed data:', parsedData);

                        for (const element of parsedData.process) {
                            if (element.name === "KakaoTalk") {
                                console.log("Found It!");
                            }
                        }
                    };
                    reader.readAsText(blob);  // Blob을 텍스트로 변환
                    // setMessages((prevMessages) => [...prevMessages, event.data]);
                } 
                else if (typeof event.data == 'string') {
                    console.log(`Connected. ${event.data}`);
                }
            } catch (error) {
                // JSON 형식이 아닐 경우 예외 처리 (즉, 단순 문자열 메시지)
                console.error('Error parsing JSON:', error);
            }
           
        };
    
        // 웹소켓이 닫혔을 때
        ws.onclose = () => {
          console.log('Disconnected from the WebSocket server');
        };
    
        // 웹소켓이 에러를 발생했을 때
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
    
        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => {
          ws.close();
        };
      }, []);
    
    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
        createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
        createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
        createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
    ];

    function createData(name, calories, fat, carbs, protein, price) {
        return {
            name,
            calories,
            fat,
            carbs,
            protein,
            price,
            history: [
                {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
                },
                {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
                },
            ],
        };
    }
    
    return (
        <div className='Table-container'>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat&nbsp;(g)</TableCell>
                            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                            <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );

}

export default RealTime;