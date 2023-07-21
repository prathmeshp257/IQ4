import React, { FC, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import dayjs from "dayjs";
import ProgressBar from "../Reports/ProgressBar";

interface Props {
  data:Array<any>;
  count:number;
  loading:Boolean;
  notRequested: number;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: 10,
    borderRadius: '10px'
  },
  container: {
    minHeight: 200,
    maxHeight: 400,
  },
});

export const VrmDataTable: FC<Props> = ({data, count, loading, notRequested}) => {
  const classes = useStyles();
  const [showHeaderRow,setShowHeaderRow] = useState(true);

  const table = document.getElementById("table");

  table?.addEventListener(
    "scroll",
    function () {
      var st = table.scrollTop;
      if (st === 0) {
        setShowHeaderRow(true);
      } else if (st > 0) {
        setShowHeaderRow(false);
      }
    },
    false
  );

  return (
    <React.Fragment>
    <Paper className={classes.root}>
      <h1 style={{marginBottom:"20px", marginTop:"20px"}}>
          Todays VRM Count : {count ? count : 0}
      </h1>
      <h2 style={{marginBottom:"10px", marginTop:"10px"}}>
        Not Requested VRM Count : {notRequested ? notRequested : 0}
      </h2>
      <h3 style={{marginBottom:"15px"}}>
          Last 30 Days VRM History 
      </h3>
      {loading ? <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar /> </div>:
      <TableContainer className={classes.container} id="table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
          { showHeaderRow && <TableRow>
                <TableCell rowSpan={2}>Date</TableCell>
                <TableCell rowSpan={2}>VRM Count</TableCell>
                <TableCell colSpan={3}>MMC Data</TableCell>
                <TableCell colSpan={3}>CO2 Data</TableCell>
                <TableCell rowSpan={2}>Not Requested VRM's</TableCell>
            </TableRow>}
            <TableRow>
                {!showHeaderRow && <TableCell >Date</TableCell>}
                {!showHeaderRow&& <TableCell>VRM Count</TableCell>}
                <TableCell>Database</TableCell>
                <TableCell>API Success</TableCell>
                <TableCell>API Failed</TableCell>
                <TableCell>Database</TableCell>
                <TableCell>API Success</TableCell>
                <TableCell>API Failed</TableCell>
                {!showHeaderRow && <TableCell>Not Requested VRM's</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.map(eachData => {
                return <TableRow>
                    <TableCell>{dayjs(eachData?.when).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{eachData?.vrmCount}</TableCell>
                    <TableCell>{eachData?.overAllMotData?.mot_db_success || 0}</TableCell>
                    <TableCell>{eachData?.overAllMotData?.mot_api_success || 0}</TableCell>
                    <TableCell>{eachData?.overAllMotData?.mot_api_failed || 0}</TableCell>
                    <TableCell>{eachData?.overAllCo2Data?.co2_db_success || 0}</TableCell>
                    <TableCell>{eachData?.overAllCo2Data?.co2_api_success || 0}</TableCell>
                    <TableCell>{eachData?.overAllCo2Data?.co2_api_failed || 0}</TableCell>
                    <TableCell>{eachData?.not_requested || 0}</TableCell>
                </TableRow>
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    }
    </Paper>
    </React.Fragment>
  );
}