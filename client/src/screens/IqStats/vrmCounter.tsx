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
import { isMobile } from "react-device-detect";
import { Flex, MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import TablePagination from "@material-ui/core/TablePagination";
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

export const VrmCounter: FC<Props> = ({ sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData}) => {
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const userType = userData.userType;
  const vrmValidator = userData.vrmValidator || "";
  const vrmValidatorSites = userData.vrmValidatorSites || "";
  const sessionVRMCounterSite =
    localStorage.getItem("iqStats-vrm-count-selected-site") || undefined;
    const [selectedSites, setSelectedSites] = useState<string[]>(
      mainSite[0] ? mainSite : sessionVRMCounterSite ? [sessionVRMCounterSite] : []
    );
    
    const sessionSelectedCamera =
    localStorage.getItem("iqStats-vrm-count-selected-camera") || undefined;
  const [selectedCamera, setSelectedCamera] = useState<any>(sessionSelectedCamera?[sessionSelectedCamera]:[]);

    
  const today = dayjs().format("DD/MM/YYYY");
  const sessionVRMCounterData =
    sessionStorage.getItem(
      `${today}-${sessionVRMCounterSite}-iqStats-vrm-count-data-${sessionSelectedCamera}`
    ) || undefined;
    
  const classes = useStyles();
 
  const [allCamera, setAllCamera] = useState<string[]>([]);
  const [iqStatsVrmCountData, setiqStatsVrmCountData] = useState<any>(
    sessionVRMCounterData ? JSON.parse(sessionVRMCounterData) : [{}]
  );
  const { email } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [allSites, setAllSites] = useState<any>([]);

  const [slicedData, setSlicedData] = useState([]);

  const [count, setCount] = useState(0);

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

  const getCamera = async () => {
    setLoading(true);
    
    try {
      const { data } = await axios.get(
        `/api/iqStats/getCamera?type=${userType}&email=${email}&site=${selectedSites[0]}`,
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      
      setAllCamera(data);
    } catch (e) {
      console.log("error-iqstats-cluster-data", e);
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  const getVRMData = async () => {
    setSlicedData([])
    setLoading(true)
    try {
      if (selectedSites[0] && selectedCamera[0]) {
        const sessionVRMCountData = sessionStorage.getItem(
          `${today}-${selectedSites[0]}-iqStats-vrm-count-data-${selectedCamera[0]}`
        );
        if (sessionVRMCountData) {
          
          JSON.parse(sessionVRMCountData).sort((a: any, b: any) => {
            return dayjs(a.date).isAfter(dayjs(b.date));
          });
          setCount(JSON.parse(sessionVRMCountData).length * 24);
  
          const datArray = [] as any;
  
          JSON.parse(sessionVRMCountData).map((values: any) => {
            values.data.map((time: any) => {
              datArray.push({
                camera: values.camera,
                date: values.date,
                time: time.hour,
                count: time.count,
              });
            });
          });
          setiqStatsVrmCountData(datArray);

          setSlicedData(datArray.slice(0, 50));
          localStorage.setItem(
            "iqStats-vrm-count-selected-site",
            selectedSites[0]
          );
          localStorage.setItem(
            "iqStats-vrm-count-selected-camera",
            selectedCamera[0]
          );
        }else{
        const { data } = await axios.post(
          `/api/iqStats/getVrmCount?type=${userType}&email=${email}&site=site-${selectedSites[0]}&camera=${selectedCamera[0]}`,
          {
            type: userType,
            email,
            site: `site-${selectedSites[0]}`,
            camera: selectedCamera[0],
          },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        data.sort((a: any, b: any) => {
          return dayjs(a.date).isAfter(dayjs(b.date));
        });
        setCount(data.length * 24);

        const datArray = [] as any;

        data.map((values: any) => {
          values.data.map((time: any) => {
            datArray.push({
              camera: values.camera,
              date: values.date,
              time: time.hour,
              count: time.count,
            });
          });
        });
        

        setiqStatsVrmCountData(datArray);

        setSlicedData(datArray.slice(0, 50));
        localStorage.setItem(
          "iqStats-vrm-count-selected-site",
          selectedSites[0]
        );
        localStorage.setItem(
          "iqStats-vrm-count-selected-camera",
          selectedCamera[0]
        );
        sessionStorage.setItem(
          `${today}-${selectedSites[0]}-iqStats-vrm-count-data-${selectedCamera[0]}`,
          JSON.stringify(data)
        );
      }
      }
    } catch (e) {
      console.log("error-iqstats-vrm-count-data", e);
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false)
  };

  const handleChangePage = async (event: any, newPage: number) => {
    let startIndex = newPage * 50;
    let lastIndex = startIndex + 50;
    setSlicedData(iqStatsVrmCountData.slice(startIndex, lastIndex));

    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const getData = async () => {
      setPage(0);
      getCamera();
    };

    if (!loading && selectedSites[0]) {
      getData();
    } else {
      setAllCamera([]);
    }

    // eslint-disable-next-line
  }, [selectedSites]);


  useEffect(() => {
    if(selectedCamera[0]){
    getVRMData();
  }
  }, [selectedCamera]);

  useEffect(() => {
    if(selectedCamera[0] && iqStatsActiveLabel === "VRM Counter" && reloadData){
    getVRMData();
    setReloadData(false)
  }
  }, [reloadData]);

  return (
    <Paper className={classes.root} elevation={0}>
    
    <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',marginBottom: "15px" }}>
        
      <h3 style={{ marginBottom: "15px"}}>
        VRM Counter Of Site '{Formatter.capitalizeSites(selectedSites)}'
      </h3>
      
      <Flex  wrap="wrap">
         <MultiSelect
          fullWidth={!!isMobile}
          multi={false}
          style={{ marginRight: "10px" }}
          className="insights__refine-menu__multi-select"
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
         <MultiSelect
          fullWidth={!!isMobile}
          placeholder="Please select camera"
          multi={false}
          className="insights__refine-menu__multi-select"
          options={
            allCamera.map((camera: any) => ({
              value: camera._id.camera,
              label: camera._id.camera,
            })) || []
          }
          values={selectedCamera}
          onChange={(values) => {
            setSelectedCamera(values);
          }}
          />
    
        </Flex>
        </div>
    
     
      <React.Fragment>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Camera Name</TableCell>
                <TableCell>Time</TableCell>

                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      (vrmValidator &&
                        vrmValidator &&
                        vrmValidatorSites &&
                        vrmValidatorSites.includes(selectedSites[0])) ||
                      userType === "Admin"
                        ? 11
                        : 7
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
                slicedData.map((values: any) => {
                  return (
                    <TableRow>
                      <TableCell>{values.date}</TableCell>
                      <TableCell>{values.camera}</TableCell>

                      <TableCell>{values.time}</TableCell>
                      <TableCell>{values.count}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={loading ? { disabled: true } : undefined}
          nextIconButtonProps={loading ? { disabled: true } : undefined}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage=""
          rowsPerPageOptions={[]}
        />
      </React.Fragment>
    </Paper>
  );
};
