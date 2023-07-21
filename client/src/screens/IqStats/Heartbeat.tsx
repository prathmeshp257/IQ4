import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { Formatter, DateUtils } from "../../utils";
import { AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { DataTable } from "../../components";
import CSVIcon from "@material-ui/icons/Assessment";
import { MultiSelect, Flex, Button } from "../../components";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

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

export const Heartbeat: FC<Props> = ({ sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData }) => {
  const { userData } = useContext(AuthContext);
  const { sitesData } = useContext(SiteContext);
  const classes = useStyles();
  const userType = userData.userType;
  const localSelectedSite = localStorage.getItem(
    "iqStats-heartbeat-selected-site"
  );
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [allSites, setAllSites] = useState<any>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>(
    mainSite[0] ? mainSite : localSelectedSite ? [localSelectedSite] : []
  );
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [heartbeatData, setHeartbeatData] = useState<any>({});
  const [formattedData, setFormattedData] = useState<any>([]);
  const rowsPerPage = 50;
  const [count, setCount] = useState<any>(0);

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

  const getHeartbeatData = async (currPage: number) => {
    setLoading(true);
    try {
      const today = dayjs().format("DD-MM-YYYY");
      const sessionHeartbeatData = sessionStorage.getItem(
        `${today}-${selectedSites[0]}-iqStats-heartbeat-data-${currPage}`
      );

      
      if (sessionHeartbeatData) {
        setHeartbeatData(JSON.parse(sessionHeartbeatData).data);
        localStorage.setItem(
          "iqStats-heartbeat-selected-site",
          selectedSites[0]
        );
        setCount(JSON.parse(sessionHeartbeatData).count);
    
      } else {
        const { data } = await axios.get(
          `/api/iqStats/heartbeat?site=${selectedSites[0]}&page=${currPage}&perPage=${rowsPerPage}&userType=${userType}&email=${userData.email}`,
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setHeartbeatData(data.data);
        setCount(data.count);

        localStorage.setItem(
          "iqStats-heartbeat-selected-site",
          selectedSites[0]
        );
        sessionStorage.setItem(
          `${today}-${selectedSites[0]}-iqStats-heartbeat-data-${currPage}`,
          JSON.stringify(data)
        );
      
      }
    } catch (e) {
      enqueueSnackbar(
        "Could not load data at this time. Please try again later",
        { variant: "error" }
      );
    }
    setLoading(false);
  };

  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
    getHeartbeatData(newPage);
  };

  useEffect(() => {
    if (selectedSites[0]) {
      setPage(0);
      getHeartbeatData(0);
    } else {
      setHeartbeatData({});
    }
    // eslint-disable-next-line
  }, [selectedSites]);

  useEffect(() => {
    if (selectedSites[0] && iqStatsActiveLabel==="Heartbeat" && reloadData) {
      setPage(0);
      getHeartbeatData(0);
      setReloadData(false)
    } 
    // eslint-disable-next-line
  }, [reloadData]);


  const formatData = async () => {
    if (heartbeatData && heartbeatData[0]) {
      let dataArr = [];
      let i = 0;
      for (const eachData of heartbeatData) {
        const prevRecordWithSameCam = await heartbeatData.filter(
          (value: any) =>
            value.camera === eachData.camera &&
            new Date(value.when) < new Date(eachData.when)
        );
        let prevRecordData = [];
        if (prevRecordWithSameCam[0]) {
          prevRecordData = prevRecordWithSameCam;
        }

        let diff = prevRecordData[0]
          ? DateUtils.getTimeDifference(prevRecordData[0].when, eachData.when)
          : "0";
        let receiveDiff =
          eachData.when && eachData.receivedTime
            ? DateUtils.getTimeDifference(eachData.when, eachData.receivedTime)
            : "0";
        dataArr.push({
          Site: Formatter.capitalizeSite(selectedSites[0]),
          "Camera Name": eachData.camera,
          "Date/Time": dayjs(eachData.when)
            .tz("Europe/London")
            .format("DD-MM-YYYY HH:mm:ss"),
          Difference: diff,
          when: eachData.localTime,
          "Received Time": eachData.receivedTime
            ? dayjs(eachData.receivedTime)
                .tz("Europe/London")
                .format("DD-MM-YYYY HH:mm:ss")
            : "NA",
          "Received Difference": receiveDiff ? receiveDiff : "0",
        });
        i++;
        if (i === 50) break;
      }
      setFormattedData(dataArr);
    } else {
      setFormattedData([]);
    }
  };

  useEffect(() => {
    formatData();
  }, [heartbeatData]);

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
      const { data: heartbeatCSVData } = await axios.get(
        `/api/iqStats/heartbeat?site=${selectedSites[0]}&page=${page}&perPage=${rowsPerPage}&userType=${userType}&responseType=csv&email=${userData.email}`,
        {
          responseType: "blob",
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      createDownloadLink(heartbeatCSVData, "heartbeat_data");
    } catch (e) {
      console.log("Error download csv heartbeat: \n", e);
    }
    setDownloadingCSV(false);
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <div style={{display:"flex",justifyContent:"space-between", flexWrap:'wrap',marginBottom:'15px'}}>
      <h3 style={{marginBottom:"15px"}}>
                Last 30 Days Reboot Log Data Of Site '{Formatter.capitalizeSite(selectedSites[0])}'
            </h3>
        <Flex wrap="wrap">
          <MultiSelect
            fullWidth={!!isMobile}
            style={{ marginRight: 10 }}
            multi={false}
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
            text="CSV"
            variant="filled"
            disabled={selectedSites.length === 0}
            icon={<CSVIcon />}
            loading={downloadingCSV}
            buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
            onClick={downloadCSV}
          />
        </Flex>
      </div>
   
      <DataTable
        columns={[
          "Site",
          "Camera Name",
          "Date/Time",
          "Difference",
          "Received Time",
          "Received Difference",
        ]}
        data={formattedData || []}
        loading={loading}
        pagination={true}
        count={count || 0}
        handleChangePage={async (page: any) => await handleChangePage(page)}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </Paper>
  );
};
