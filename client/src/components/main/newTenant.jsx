import * as React from "react";
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

// function createData(loginId, name, villaNumber, carNumber, phoneNumber) {
//   return { loginId, name, villaNumber, carNumber, phoneNumber };
// }

const NewTenant = () => {
  const [loading, setLoading] = React.useState(true);
  const villaIdNumber = useSelector((state) => state.webInfo.villaIdNumber);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    newTenantList();
  }, []);

  async function newTenantList() {
    await http
      .get(`/tenant/new/${villaIdNumber}`)
      .then((response) => {
        // API 응답 데이터를 rows 배열에 추가
        setRows(response.data.response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
        setLoading(false);
      });
  }

  const handleApproveClick = (row) => {
    // 승인 눌렀을때
    http.get(`/tenant/${row.loginId}/APPROVE`).then((response) => {
      console.log(response.data);
      const newData = rows.filter((item) => item.loginId !== row.loginId);
      setRows(newData);
    });
  };

  const handleDeclineClick = (row) => {
    // 거절 눌렀을때
    http.get(`/tenant/${row.loginId}/DECLINE`).then((response) => {
      console.log(response.data);
      const newData = rows.filter((item) => item.loginId !== row.loginId);
      setRows(newData);
    });
  };
  if (loading) {
    return <CircularProgress color="inherit" />;
  }
  return (
    <TableContainer sx={{ width: "80%" }} component={Paper}>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <Typography style={{ fontSize: "20px" }}>신규 세입자 신청 목록</Typography>
      </Toolbar>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">아이디</StyledTableCell>
            <StyledTableCell align="center">이름</StyledTableCell>
            <StyledTableCell align="center">호수</StyledTableCell>
            <StyledTableCell align="center">차번호</StyledTableCell>
            <StyledTableCell align="center">핸드폰번호</StyledTableCell>
            <StyledTableCell align="center">승인여부</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.loginId}>
              <StyledTableCell component="th" scope="row">
                {row.loginId}
              </StyledTableCell>
              <StyledTableCell align="center">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.villaNumber}</StyledTableCell>
              <StyledTableCell align="center">{row.carNumber}</StyledTableCell>
              <StyledTableCell align="center">{row.phoneNumber}</StyledTableCell>
              <StyledTableCell align="center">
                <Button onClick={() => handleApproveClick(row)}>승인</Button>|
                <Button onClick={() => handleDeclineClick(row)}>거부</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NewTenant;
