import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import dayjs from "dayjs";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Formatter } from "../../utils";
import { Flex, MultiSelect } from "../../components";
import { AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";

interface Props {
  sites: Array<any>;
  mainSite: Array<any>;
  iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
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

export const AverageMatchRate: FC<Props> = ({ sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData }) => {
  const { userData } = useContext(AuthContext);
  const today = dayjs().format("DD/MM/YYYY");
  const { sitesData } = useContext(SiteContext);
  const userLoginType = userData.userType;
  const { email } = userData;
  
  const localSelectedSite = localStorage.getItem('iqStats-match-data-average-match-selected-site')?.split(",")
  
  const localFilterType = localStorage.getItem('iqStats-match-data-average-match-selected-filterType')
  const [selectedSites, setSelectedSites] = useState<any>(mainSite.length>0 ? mainSite : (localSelectedSite && localSelectedSite.length>0) ? localSelectedSite :[]);
  
  const [selectableSites, setSelectableSites] = useState<string[]>([]);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [filterType, setFilterType] = useState<string[]>(localFilterType?[localFilterType]:[]);
  const [loading, setLoading] = useState(false);
  const [showHeaderRow, setShowHeaderRow] = useState(true);
  const [averageMatchRateData, setAverageMatchRateData] = useState<string[]>(
    []
  );
  const [lastWeekDate,setLastWeekDate] = useState("")
  const [previousWeekDate,setPreviousWeekDate] = useState("")


  useEffect(() => {
    let accessSites = sites;
    if (userData.userType !== "Admin") {
      for (const eachSite of sites) {
        const foundSite = sitesData.filter(
          (val: any) => val.id === Formatter.normalizeSite(eachSite)
        );
        if (foundSite[0] && foundSite[0].contractExpired) {
          accessSites = accessSites.filter((val: any) => val !== eachSite);
        }
      }
    }

    
    setSelectableSites(accessSites);
    
  }, [sitesData]);
  const getAverageMatchRateData = async () => {
    setLoading(true);
    try {

      const sessionAverageMatchRate = sessionStorage.getItem(
        `${today}-${selectedSites}-iqStats-match-data-average-match-rate-${filterType.join()}`
      );
      if (sessionAverageMatchRate) {
        let data = JSON.parse(sessionAverageMatchRate)
        const lastDate = data[0].lastWeekDate
        let formattedLastDate = dayjs(lastDate).format("DD/MM/YYYY")
        await setLastWeekDate(formattedLastDate + " - " + today)
        const previousDate = data[0].previousWeekDate
      let formattedPreviousDate = dayjs(previousDate).format("DD/MM/YYYY")
      await setPreviousWeekDate(formattedPreviousDate + " - " + formattedLastDate)
        setAverageMatchRateData(JSON.parse(sessionAverageMatchRate));
        
        localStorage.setItem(
          "iqStats-match-data-average-match-selected-site", selectedSites.join());
          localStorage.setItem(
            "iqStats-match-data-average-match-selected-filterType", filterType.join());

      } else{ 
      const { data } = await axios.get(
        `/api/iqStats/averageMatchRate?email=${email}&userType=${userLoginType}&site=${selectedSites}&filterType=${
          !filterType[0]
            ? ""
            : filterType[0].split(" ")[0].replace("+", "%2B")
        }&type=${
          !filterType[0]
            ? ""
            : filterType[0] === "Select Filter Type"
            ? ""
            : filterType[0].split(" ")[1]
        }`,
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );



      const dataArray = [] as any;
      data.map((eachData:any) => {
        Object.keys(eachData).map((site,index)=>{
             dataArray.push({
          site: Formatter.capitalizeSite(site),
          exactMatchAverage: eachData[site].exactMatchAverage
            ? eachData[site].exactMatchAverage + "%"
            : "0%",
          exactMatchBefore7DaysAverage: eachData[site]
            .exactMatchBefore7DaysAverage
            ? eachData[site].exactMatchBefore7DaysAverage + "%"
            : "0%",
          clusterMatchAverage: eachData[site].clusterMatchAverage
            ? eachData[site].clusterMatchAverage + "%"
            : "0%",
          clusterMatchBefore7DaysAverage: eachData[site]
            .clusterMatchBefore7DaysAverage
            ? eachData[site].clusterMatchBefore7DaysAverage + "%"
            : "0%",
          approxMatchAverage: eachData[site].approxMatchAverage
            ? eachData[site].approxMatchAverage + "%"
            : "0%",
          approxMatchBefore7DaysAverage: eachData[site]
            .approxMatchBefore7DaysAverage
            ? eachData[site].approxMatchBefore7DaysAverage + "%"
            : "0%",
          exactClusterMatchAverage: eachData[site].exactClusterMatchAverage
            ? eachData[site].exactClusterMatchAverage + "%"
            : "0%",
          exactClusterMatchBefore7DaysAverage: eachData[site]
            .exactClusterMatchBefore7DaysAverage
            ? eachData[site].exactClusterMatchBefore7DaysAverage + "%"
            : "0%",
          lastWeekDate: eachData[site].before7Days ? eachData[site].before7Days : "0",
          previousWeekDate: eachData[site].before14Days ? eachData[site].before14Days : "0"


        });
        })
      });
      setAverageMatchRateData(dataArray);
      
      localStorage.setItem('iqStats-match-data-average-match-selected-site', selectedSites.join())
      localStorage.setItem('iqStats-match-data-average-match-selected-filterType',filterType.join())

      sessionStorage.setItem(`${today}-${selectedSites}-iqStats-match-data-average-match-rate-${filterType.join()}`, JSON.stringify(dataArray))
      
    }
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Something Went Wrong",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  useEffect(()=>{
    if(selectedSites[0]){
    getAverageMatchRateData()
    }
  },[selectedSites,filterType,lastWeekDate])

  useEffect(()=>{
    if(selectedSites[0] && iqStatsActiveLabel==="Average Match Rate" && reloadData){
    getAverageMatchRateData()
    setReloadData(false)
    }
  },[reloadData])

  useEffect(()=>{
    if(selectedSites[0]){
      
    getAverageMatchRateData()
    }
  },[])

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
    <Paper className={classes.root} elevation={0}>
      <div  style={{ display:"flex",justifyContent:"end", flexWrap:'wrap',marginBottom:'15px'}}>
        <Flex wrap="wrap">
          <MultiSelect
            style={{ marginRight: 8 }}
            className="dashboard__refine-menu__multi-select --margin-bottom-large"
            options={[
              "Exact High",
              "Exact Low",
              "Exact+Cluster High",
              "Exact+Cluster Low",
              "Cluster High",
              "Cluster Low",
              "Approx High",
              "Approx Low",
            ].map((status: any) => ({
              value: status,
              label: status,
            }))}
            multi={false}
            placeholder="Select Filter Type"
            values={filterType}
            onChange={(values) => {
              setFilterType(values);
            }}
          />
          <MultiSelect
          style={{ marginRight: 8 }}
            className="dashboard__refine-menu__multi-select --margin-bottom-large"
            options={selectableSites.map((site: any) => ({
              value: Formatter.normalizeSite(site) || "",
              label: Formatter.capitalizeSite(site),
            }))}
            multi={true}
            values={selectedSites}
            onChange={(values) => {
              const normalizedSites = Formatter.normalizeSites(values) || [];
              setSelectedSites(normalizedSites);
            }}
          />
        </Flex>
      </div>
      <React.Fragment>
        <TableContainer className={classes.container} id="table">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              {showHeaderRow && (
                <TableRow>
                  <TableCell rowSpan={2}>Sites</TableCell>
                  <TableCell colSpan={4}>{lastWeekDate}</TableCell>
                  <TableCell colSpan={4}>{previousWeekDate}</TableCell>
                </TableRow>
              )}
              <TableRow>
                {!showHeaderRow && <TableCell>Sites</TableCell>}
                <TableCell>Exact</TableCell>
                <TableCell>Cluster</TableCell>
                <TableCell>Approx</TableCell>
                <TableCell>Exact+Cluster</TableCell>
                <TableCell>Exact</TableCell>
                <TableCell>Cluster</TableCell>
                <TableCell>Approx</TableCell>
                <TableCell>Exact+Cluster</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9}>
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
                averageMatchRateData.map((data: any) => {
                  return (
                    <TableRow>
                      <TableCell>{data.site}</TableCell>
                      <TableCell>{data.exactMatchAverage}</TableCell>
                      <TableCell>{data.clusterMatchAverage}</TableCell>
                      <TableCell>{data.approxMatchAverage}</TableCell>
                      <TableCell>{data.exactClusterMatchAverage}</TableCell>
                      <TableCell>{data.exactMatchBefore7DaysAverage}</TableCell>
                      <TableCell>
                        {data.clusterMatchBefore7DaysAverage}
                      </TableCell>
                      <TableCell>
                        {data.approxMatchBefore7DaysAverage}
                      </TableCell>
                      <TableCell>
                        {data.exactClusterMatchBefore7DaysAverage}
                      </TableCell>
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
