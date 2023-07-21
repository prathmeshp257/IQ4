import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import axios from "axios";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import dayjs from "dayjs";
import { Formatter } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { isMobile } from "react-device-detect";
import { MultiSelect,Button } from "../../components";
import ProgressBar from "../Reports/ProgressBar";
import CSVIcon from "@material-ui/icons/Assessment";
import { CSVLink, CSVDownload } from "react-csv";

interface Props {
  site: Array<any>;
  setDate:any;
  isOverLayed:boolean;
  
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    minHeight: 200,
    maxHeight: 400,
    overFlowY: "scroll",
  },
});

export const OccupancyTable: FC<Props> = ({site,isOverLayed,setDate}) => {
  const { userData } = useContext(AuthContext);
  const userType = userData.userType;
  const [occupancyData,setOccupancyData] = useState<any>([])
 
  const { email } = useContext(UserContext);
  const occupancyTableAccessSites = userData.occupancyTableAccessSites
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const classes =  useStyles();
  const [occupancyProSiteIncludes,setOccupancyProSiteIncludes] = useState(false)
  const [occupancy24hSiteIncludes,setOccupancy24hSiteIncludes] = useState(false)
  const [basicOccupancySiteIncludes,setBasicOccupancySiteIncludes] = useState(false)
  const [selectedSites,setSelectedSites] = useState<any>(!isOverLayed ? site:[])
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  const DATE_FORMAT = "DD MMMM";

  const getOccupancyData = async (sites:any) => {
    setLoading(true)
    try {
        const { data } = await axios.post(
          `/api/dashboard/dashboardOccupancyTable`,{type:userType,email:email,site:sites},
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            }
          }
        );


        const fromDate = dayjs().toDate()
        const HOURS = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
        const dataArray = [] as any;
        for(const site of Object.keys(data)){
          const arr = Array(31).entries() as any;
          const tday = dayjs().format(DATE_FORMAT);
          let lastDate ; 
          if(data[site].occupancyData[0]){
            lastDate = dayjs(data[site].occupancyData[0]&&data[site].occupancyData[data[site].occupancyData.length-1].date).format(DATE_FORMAT);
          }else if(data[site].basicOccupancyData[0]){
            lastDate = dayjs(data[site].basicOccupancyData[0] && data[site].basicOccupancyData[data[site].basicOccupancyData.length-1].date).format(DATE_FORMAT);
          }else{
            lastDate = dayjs(data[site].occupancy24hData[0]&&data[site].occupancy24hData[data[site].occupancy24hData.length-1].date).format(DATE_FORMAT);

          }
        
           
          setDate(`${lastDate}-${tday}`)
          for (const [index] of arr){
            let formatdate = dayjs(fromDate).subtract(index, 'days').format('YYYY-MM-DD')
            for (const hour of HOURS){
              let occupancyDataFilter = await data[site].occupancyData.filter((v:any) => (v.date === formatdate && v.hour === hour));
              let basicOccupancyDataFilter = await data[site].basicOccupancyData.filter((v:any) => (v.date === formatdate && v.hour === hour));
              let occupancy24hDataFilter = await data[site].occupancy24hData.filter((v:any) => (v.date === formatdate && v.hour === hour));
              
              dataArray.push({
                site:site,
                date:formatdate,
                hour,
                occupancy: occupancyDataFilter[0] && occupancyDataFilter[0].occupancy ? Math.round(occupancyDataFilter[0].occupancy) : 0,
                basicOccupancy: basicOccupancyDataFilter[0] && basicOccupancyDataFilter[0].basicOccupancy ? Math.round(basicOccupancyDataFilter[0].basicOccupancy) : 0,
                occupancy24h: occupancy24hDataFilter[0] && occupancy24hDataFilter[0].occupancy24h ? Math.round(occupancy24hDataFilter[0].occupancy24h) : 0,
              })
            }
          }
        }



        
        


    setOccupancyData(dataArray);
    } catch (e) {
      console.log("error-Dashboard-occupancy-table-data", e);
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false)
  };

 

  useEffect(()=>{
    if((site && site[0]) && !isOverLayed){
      getOccupancyData(site)
    }
  },[site])

  useEffect(()=>{
    setOccupancy24hSiteIncludes(false)
    setBasicOccupancySiteIncludes(false)
    setOccupancyProSiteIncludes(false)
    selectedSites.map((sites:any)=>{
      
      if(userData.occupancy24hAccessSites.includes(sites)){
        setOccupancy24hSiteIncludes(true)
      }
      if(userData.basicOccupancyAccessSites.includes(sites)){
        setBasicOccupancySiteIncludes(true)
      }
      if(userData.occupancyProAccessSites.includes(sites)){
        setOccupancyProSiteIncludes(true)
      }
    })
    
  },[selectedSites])




  return (
    <Paper className={classes.root} elevation={0}>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "15px" }}
      >   
          <CSVLink data={occupancyData} filename={"OccupancyData.csv"} ><Button
              className="--margin-bottom-large"
              text="CSV"
              variant="filled"
              disabled={selectedSites.length === 0}
              icon={<CSVIcon />}
              loading={downloadingCSV}
              buttonStyle={{ minWidth: 80, maxWidth: 80,marginRight: 8}}
            />
           </CSVLink>
            {isOverLayed && <MultiSelect
              type="dashboard"
              fullWidth={!!isMobile}
              style={{ marginRight: 8 }}
              className="insights__refine-menu__multi-select"
              options={
                occupancyTableAccessSites.sort().map((site: any) => ({
                  value: Formatter.normalizeSite(site),
                  label: Formatter.capitalizeSite(site),
                })) || []
              }
              values={selectedSites}
              onChange={(values) => {
                const normalizedSites = Formatter.normalizeSites(values) || [];
                setSelectedSites(normalizedSites)
                getOccupancyData(normalizedSites)
              }}
            />}
      </div>
      <React.Fragment>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Site</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Hour</TableCell>
                {(userType === 'Admin' || (userData.occupancyProAccess && occupancyProSiteIncludes)) && <TableCell>Occupancy Pro</TableCell>}
                {(userType === 'Admin' ||( userData.basicOccupancyAccess && basicOccupancySiteIncludes )) && <TableCell>Basic Occupancy</TableCell>}
                {(userType === 'Admin' || (userData.occupancy24hAccess && occupancy24hSiteIncludes )) && <TableCell>Occupancy 24h</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      6
                      
                    }
                  >
                    <div
                      style={{
                        height: "300px",
                        width: "100%",
                        textAlign: "center",
                        padding: "auto",
                      }}
                    >
                      {" "}
                      <ProgressBar />{" "}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (

                
                occupancyData.map((values: any) => {
                  return (
                    <TableRow>
                      <TableCell>{Formatter.capitalizeSite(values.site)}</TableCell>
                      <TableCell>{values.date}</TableCell>

                      <TableCell>{values.hour}</TableCell>
                      {(userType === 'Admin' || (userData.occupancyProAccess && occupancyProSiteIncludes)) && <TableCell>{ userData.occupancyProAccessSites.includes(values.site.replace("site-",""))?values.occupancy:'Not Accessible'}</TableCell>}
                      {(userType === 'Admin' || (userData.basicOccupancyAccess && basicOccupancySiteIncludes)) && <TableCell>{userData.basicOccupancyAccessSites.includes(values.site.replace("site-",""))?values.basicOccupancy:'Not Accessible'}</TableCell>}
                      {(userType === 'Admin' || (userData.occupancy24hAccess && occupancy24hSiteIncludes)) && <TableCell>{userData.occupancy24hAccessSites.includes(values.site.replace("site-",""))?values.occupancy24h:'Not Accessible'}</TableCell>}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    </Paper>
  );
};
