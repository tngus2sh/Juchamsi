import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import http from "../../axios/http";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2D4356",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ParkingLotHistory = () => {
  const identification = useSelector((state) => state.webInfo.identification);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    parkingHistory();
  }, []);

  async function parkingHistory() {
    await http
      .get(`/parking/lot/${identification}`)
      .then((response) => {
        // API 응답 데이터를 rows 배열에 추가
        console.log(response.data.response);
        setRows(response.data.response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
        setLoading(false);
      });
  }
  if (loading) {
    return <CircularProgress color="inherit" />;
  }
  return (
    <TableContainer sx={{ width: "80%" }} component={Paper}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography style={{ fontSize: "20px" }}>주차 히스토리</Typography>
      </Toolbar>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">아이디</StyledTableCell>
            <StyledTableCell align="center">주차자리</StyledTableCell>
            <StyledTableCell align="center">차번호</StyledTableCell>
            <StyledTableCell align="center">예상출차시간</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row" align="center">
                {row.userId}
              </StyledTableCell>
              <StyledTableCell align="center">{row.seatNumber}</StyledTableCell>
              <StyledTableCell align="center">{row.carNumber}</StyledTableCell>
              <StyledTableCell align="center">{row.outTime}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ParkingLotHistory;
