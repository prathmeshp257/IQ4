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
import {isMobile } from "react-device-detect";
import { MultiSelect, Button, Flex } from "../../components";
import { Formatter } from "../../utils";
import CSVIcon from "@material-ui/icons/Assessment";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { Switch } from "antd";
import ProgressBar from "../Reports/ProgressBar";
import { truncate } from "fs";

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
  },
});

export const MatchingData: FC<Props> = ({ sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData }) => {
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const userType = userData.userType;
  const classes = useStyles();
  const today = dayjs().format("DD/MM/YYYY");
  const sessionHistorySite =
    localStorage.getItem("iqStats-history-selected-site") || undefined;
  const sessionStatsHistory =
    sessionStorage.getItem(`${today}-${sessionHistorySite}-iqStats-history`) ||
    undefined;
  const [selectedSites, setSelectedSites] = useState<string[]>(
    mainSite[0] ? mainSite : sessionHistorySite ? [sessionHistorySite] : []
  );
  const [iqStatsHistory, setIqStatsHistory] = useState<any>(
    sessionStatsHistory ? JSON.parse(sessionStatsHistory) : {}
  );
  const { email } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [allSites, setAllSites] = useState<any>([]);
  const [showSyntaxColumns, setShowSyntaxColumns] = useState(false);
  const [showModifiedColumns, setShowModifiedColumns] = useState(false);
  const [possiblyModifiedColumns, setPossiblyModifiedColumns] = useState(false);

  const [downloadingCSV, setDownloadingCSV] = useState(false);

  useEffect(() => {
    if (mainSite && mainSite[0]) {
      setSelectedSites([...mainSite]);
    }
  }, [mainSite]);

  useEffect(() => {
    if (userType !== "Admin" && userType) {
      let accessSites = sites;
      for (const eachSite of sites) {
        const expired = sitesData.filter(
          (val: any) => val.id === eachSite && val.contractExpired
        );
        if (expired[0]) {
          accessSites = accessSites.filter((val: any) => val !== eachSite);
        }
      }
      setAllSites(accessSites);
    } else if (userType === "Admin") {
      setAllSites(sites);
    } else {
      setAllSites([]);
    }
    // eslint-disable-next-line
  }, [sitesData]);

  const getHistory = async () => {
    setLoading(true);
    try {
      const sessionStatsHistory = sessionStorage.getItem(
        `${today}-${selectedSites[0]}-iqStats-history`
      );
      if (sessionStatsHistory) {
        setIqStatsHistory(JSON.parse(sessionStatsHistory));
        localStorage.setItem(
          "iqStats-history-selected-site",
          selectedSites[0]
        );
      } else {
        const { data } = await axios.get(
          `/api/iqStats/history?type=${userType}&email=${email}&site=${selectedSites[0]}`,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setIqStatsHistory(data);

        localStorage.setItem(
          "iqStats-history-selected-site",
          selectedSites[0]
        );
        sessionStorage.setItem(
          `${today}-${selectedSites[0]}-iqStats-history`,
          JSON.stringify(data)
        );     
      }    
    } catch (e) {
      console.log("error-iqstats-history-data", e);
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    
    if (!loading && selectedSites[0]) {
      getHistory();
    } else {
      setIqStatsHistory({});
    }
    // eslint-disable-next-line
  }, [selectedSites]);

  useEffect(() => {
    if(iqStatsHistory[selectedSites[0]]){
      for(let eachDate of  Object.keys(iqStatsHistory[selectedSites[0]])){
        if(iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedIn == 0  && iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedOut == 0  &&  iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedClusterIn == 0  && 
          iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedClusterOut == 0  &&  iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedExact == 0  &&  iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedApproxIn == 0  &&  
          iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedApproxOut == 0  && iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedNoneIn == 0  && iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedNoneOut == 0 ){
            setPossiblyModifiedColumns(true)
          }
          else{
            setPossiblyModifiedColumns(false);
            break;
          }
      }
    } 

  },[iqStatsHistory])

  useEffect(() => {
    
    if (!loading && selectedSites[0] && iqStatsActiveLabel==="Matching Data" && reloadData) {
      getHistory();
      setReloadData(false)
    } 

    // eslint-disable-next-line
  }, [reloadData]);

  console.log(possiblyModifiedColumns , showModifiedColumns)
 

  
  const createDownloadLink = (data: any, fileName: string) => {
    let link = document.createElement("a");
    let url = window.URL.createObjectURL(new Blob([data]));
    link.href = url;
    link.setAttribute(
      "download",
      `${fileName}_${dayjs().format("DD_MM_YYYY")}.zip`
    );
    document.body.appendChild(link);
    link.click();
  };

  const downloadCSV = async () => {
    setDownloadingCSV(true);
    try {
      const { data: matchingData } = await axios.get(
        `/api/iqStats/history?type=${userType}&responseType=csv&email=${email}&site=${selectedSites[0]}`,
        {
          responseType: "blob",
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      createDownloadLink(matchingData, "matching_data");
    } catch (e) {
      console.log("Error download csv matching data: \n", e);
    }
    setDownloadingCSV(false);
  };
  return (
    <React.Fragment>
      <Paper className={classes.root} elevation={0}>
        <div style={{ display:"flex",justifyContent:"space-between", flexWrap:'wrap',marginBottom:'15px'}}>
        <h3 style={{ marginBottom: "15px"}}>
          Last 30 Days IQ Stats History Of Site '
          {Formatter.capitalizeSites(selectedSites)}'
        </h3>
          <Flex wrap="wrap">
            <MultiSelect
              fullWidth={!!isMobile}
              multi={false}
              style={{ marginRight: 8 }}
              className="insights__refine-menu__multi-select --margin-bottom-large"
              options={
                allSites.map((site: any) => ({
                  value: Formatter.normalizeSite(site),
                  label: Formatter.capitalizeSite(site),
                })) || []
              }
              values={selectedSites}
              onChange={(values) => {
                const normalizedSites = Formatter.normalizeSites(values) || [];
                setSelectedSites(normalizedSites);
              }}
            />
            <Button
            className="--margin-bottom-large"
              text="CSV"
              variant="filled"
              disabled={selectedSites.length === 0}
              icon={<CSVIcon />}
              loading={downloadingCSV}
              buttonStyle={{ minWidth: 80, maxWidth: 80,marginRight: 8}}
              onClick={downloadCSV}
            />

            <Switch
              style={{ marginRight: 8 }}
              className="reports__refine-menu__switch --margin-bottom-large"
              checkedChildren={<span><div>Show</div> <div style={{marginTop:"-5px"}}>Syntax</div></span>}
              unCheckedChildren={<span><div>Hide</div> <div style={{marginTop:"-5px"}}>Syntax</div></span>}
              checked={showSyntaxColumns}
            
              onChange={(val) => {
                if(val == true){
                  setShowModifiedColumns(false)
                  setShowSyntaxColumns(true)
                }
                else{
                setShowSyntaxColumns(!showSyntaxColumns);
                }    
              }}
            />
            <Switch
              style={{ marginRight: 8 }}
              className="reports__refine-menu__switch --margin-bottom-large"
              checkedChildren={<span><div>Show</div> <div style={{marginTop:"-5px"}}>Modified</div></span>}
              unCheckedChildren={<span><div>Hide</div> <div style={{marginTop:"-5px"}}>Modified</div></span>}
              checked={showModifiedColumns}
              onChange={() => {
                setShowModifiedColumns(!showModifiedColumns);
              }}
            />
          </Flex>
        </div>
       {possiblyModifiedColumns && showModifiedColumns ?
       <h4 style={{textAlign:"center"}}>No data found - contact your distributor</h4>
       : showModifiedColumns ? 
        <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
            <TableCell className="date-format">Date</TableCell>
              <TableCell>In's/Possibly Modified True</TableCell>
              <TableCell>Out's/Possibly Modified True</TableCell>
              <TableCell>Cluster In/Syntax True/False</TableCell>
              <TableCell>Cluster Out/Syntax True/False</TableCell>
              <TableCell>Exact</TableCell>
              <TableCell>Approx In/Syntax True/False</TableCell>
              <TableCell>Approx Out/Syntax True/False</TableCell>
              <TableCell>None In/Syntax True/False</TableCell>
              <TableCell>None Out/Syntax True/False</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {loading ? (
                <TableRow>
                <TableCell colSpan={12}>
                    <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar /> </div>
                </TableCell>
            </TableRow>
              ) : (
                iqStatsHistory[selectedSites[0]] &&
                Object.keys(iqStatsHistory[selectedSites[0]]).map(
                  (eachDate) => {
                    return (
                      <TableRow>
                        <TableCell className="date">{eachDate}</TableCell>
                        <TableCell>
                            {iqStatsHistory[selectedSites[0]][eachDate].totalIns}/{ iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedIn }
                          </TableCell> 
                          <TableCell>
                            {iqStatsHistory[selectedSites[0]][eachDate].totalOuts}/{ iqStatsHistory[selectedSites[0]][eachDate].possiblyModifiedOut}
                          </TableCell>
                          <TableCell>
                                {
                                  iqStatsHistory[selectedSites[0]][eachDate]
                                    .clusterMatch
                                }/
                                {
                                    iqStatsHistory[selectedSites[0]][eachDate]
                                    .possiblyModifiedClusterIn 
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  iqStatsHistory[selectedSites[0]][eachDate]
                                    .clusterMatchOut
                                }/
                                {
                                   iqStatsHistory[selectedSites[0]][eachDate]
                                    .possiblyModifiedClusterOut 
                                    
                                }
                              </TableCell>
                              <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .exactMatch
                            }/
                            {
                              
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .possiblyModifiedExact 
                                
                            }
                          </TableCell>
                          <TableCell>
                          {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatch
                              }/
                              {
                                
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .possiblyModifiedApproxIn 
                                  
                              }
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatchOut
                              }/
                              {
                                
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .possiblyModifiedApproxOut 
                                  
                              }
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatch
                              }/
                              {
                               
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .possiblyModifiedNoneIn 
                                  
                              }
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOut
                              }/
                              {
                                
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .possiblyModifiedNoneOut 
                                  
                              }
                            </TableCell>
                            </TableRow>
                    )}))}
                            </TableBody>
        </Table>
      </TableContainer> :
      
       

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className="date-format">Date</TableCell>
                <TableCell>In's</TableCell>
                <TableCell>Out's</TableCell>
                {showSyntaxColumns ? (
                  <>
                    <TableCell>Cluster In/Syntax True/False</TableCell>
                    <TableCell>Cluster Out/Syntax True/False</TableCell>
                  </>
                ) :  (
                  <>
                  <TableCell>Cluster In</TableCell>
                  <TableCell>Cluster Out</TableCell>
                </>
                )}
                <TableCell>Exact</TableCell>
                {showSyntaxColumns ? (
                  <>
                    <TableCell>Approx In/Syntax True/False</TableCell>
                    <TableCell>Approx Out/Syntax True/False</TableCell>
                    <TableCell>None In/Syntax True/False</TableCell>
                    <TableCell>None Out/Syntax True/False</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Approx In</TableCell>
                    <TableCell>Approx Out</TableCell>
                    <TableCell>None In</TableCell>
                    <TableCell>None Out</TableCell>
                  </>
                )}
                <TableCell>Pending</TableCell>
                <TableCell>Invalid</TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                <TableCell colSpan={12}>
                    <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar /> </div>
                </TableCell>
            </TableRow>
              ) : (
                iqStatsHistory[selectedSites[0]] &&
                Object.keys(iqStatsHistory[selectedSites[0]]).map(
                  (eachDate) => {
                    return (
                      <TableRow>
                        <TableCell className="date">{eachDate}</TableCell>
                        
                          <TableCell>
                            {iqStatsHistory[selectedSites[0]][eachDate].totalIns}
                          </TableCell>
                        
                      
                          <TableCell>
                            {iqStatsHistory[selectedSites[0]][eachDate].totalOuts}
                          </TableCell>
                        
                        
                        {showSyntaxColumns ? (
                          <>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatch
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterInSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterInSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterInSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterInSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchOut
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchOutPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterOutSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterOutSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterOutSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterOutSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatch
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchPer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchOut
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .clusterMatchOutPer
                              }
                              %)
                            </TableCell>
                          </>
                        )}
                        
                          <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .exactMatch
                            }
                            (
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .exactMatchPer
                            }
                            %)
                          </TableCell>
                        
                        
                        

                        {showSyntaxColumns ? (
                          <>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatch
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatchPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxInSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxInSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxInSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxInSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatchOut
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxMatchOutPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxOutSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxOutSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxOutSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .approxOutSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatch
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchInSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchInSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchInSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchInSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOut
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOutPer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOutSyntaxTrue
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOutSyntaxTruePer
                              }
                              %)/
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOutSyntaxFalse
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .noMatchOutSyntaxFalsePer
                              }
                              %)
                            </TableCell>
                          </>
                        ) : (
                          <>
                          <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .approxMatch
                            }
                            (
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .approxMatchPer
                            }
                            %)
                          </TableCell>
                          <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .approxMatchOut
                            }
                            (
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .approxMatchOutPer
                            }
                            %)
                          </TableCell>
                          <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .noMatch
                            }
                            (
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .noMatchPer
                            }
                            %)
                          </TableCell>
                          <TableCell>
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .noMatchOut
                            }
                            (
                            {
                              iqStatsHistory[selectedSites[0]][eachDate]
                                .noMatchOutPer
                            }
                            %)
                          </TableCell>
                        </>
                        )}
                        
                            <TableCell>
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .pendingMatch
                              }
                              (
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .pendingMatchPer
                              }
                              %)
                            </TableCell>
                            <TableCell>
                              {iqStatsHistory[selectedSites[0]][eachDate].invalid}(
                              {
                                iqStatsHistory[selectedSites[0]][eachDate]
                                  .invalidPer
                              }
                              %)
                            </TableCell>
                         
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
}
      </Paper>
    </React.Fragment>
  );
};
