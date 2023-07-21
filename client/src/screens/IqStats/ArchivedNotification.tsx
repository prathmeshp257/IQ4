import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Flex, MultiSelect } from "../../components";
import Paper from "@material-ui/core/Paper";

import { AuthContext, SiteContext } from "../../context";
import { Formatter } from "../../utils";
import { DataTable, Button } from "../../components";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { PopUpAllNotification } from "./PopUpAllNotification";
import { ViewNotes } from "./ViewNotes";
import { AddNotes } from "./AddNotes";
import { ButtonGroup } from "@material-ui/core";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import { DeleteAllNotification } from "./DeleteAllNotification";
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  sites: Array<any>;
  mainSites: Array<any>;
  iqStatsActiveLabel: any;
  reloadData: boolean;
  setReloadData: any;
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

export const ArchivedNotifications: FC<Props> = ({ sites, mainSites, iqStatsActiveLabel, reloadData, setReloadData }) => {
  const classes = useStyles();

  const { sitesData } = useContext(SiteContext);
  const { userData } = useContext(AuthContext);
  const userLoginType = userData.userType;
  const email = userData.email;
  const iqStatSites = sites || [];
  const matchRateSites = userLoginType === "Admin" ? sites : userData.matchRateAlertAccessSites;
  const [loading, setLoading] = useState(false);
  const localSelectedSite = localStorage.getItem("iqStats-archivedNotification-selected-site")?.split(",");
  const [selectedSites, setSelectedSites] = useState<any>(mainSites.length > 0 ? mainSites : (localSelectedSite && localSelectedSite.length > 0) ? localSelectedSite : []);
  const [selectableSites, setSelectableSites] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const { enqueueSnackbar } = useSnackbar();
  const [count, setCount] = useState();
  const [archivedNotificationData, setarchivedNotificationData] = useState<any>(
    []
  );
  const [openViewAllNotification, setOpenViewAllNotification] =
    useState<boolean>(false);
  const [openViewNotes, setOpenViewNotes] = useState<boolean>(false);
  const [openAddNotes, setOpenAddNotes] = useState<boolean>(false);
  const [addNoteData, setaddNoteData] = useState<any>({});
  const [viewNoteData, setviewNoteData] = useState<any>({});
  const [deleteData, setDeleteData] = useState<any>({});
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [viewAllNotificationData, setViewAllNotificationData] = useState<any>(
    {}
  );
  const [formattedData, setFormattedData] = useState<any>([]);
  const localPriorityStatus = sessionStorage.getItem("iqStats-archivedNotification-selected-priorityStatus");
  const localSelectedPriorityStatus = localPriorityStatus ? [localPriorityStatus] : [];
  const [priorityStatus, setpriorityStatus] = useState<string[]>(localSelectedPriorityStatus);
  const localSortType = sessionStorage.getItem("iqStats-archivedNotification-selected-sortType");
  const localSelectedSortType = localSortType ? [localSortType] : ["Newest To Oldest"];
  const [sortType, setSortType] = useState<string[]>(localSelectedSortType);
  const [notificationTypes, setNotificationTypes] = useState<any[]>([]);
  const localSelectedNotificationType = localStorage.getItem("iqStats-archivedNotification-selected-notificationType")?.split(',');
  const [selectedNotificationType, setSelectedNotificationType] = useState<any>(localSelectedNotificationType ? localSelectedNotificationType : []);



  useEffect(() => {
    if (mainSites && mainSites[0]) {
      setSelectedSites([...mainSites])
    }
  }, [mainSites])

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

  useEffect(()=>{
    const iqAccess = userData.iqStatAccess && iqStatSites && iqStatSites[0];
    const matchAlertAccess = userData.matchRateAlertAccess && matchRateSites && matchRateSites[0];
    const types = [];
    const matchedIqSites = selectedSites[0] ? iqStatSites.filter((val: any) => selectedSites.includes(val)) : [];
    const matchedMatchRateSites = selectedSites[0] ? matchRateSites.filter((val: any) => selectedSites.includes(val)) : [];
    if (userLoginType === "Admin" ||
      (iqAccess &&
        selectedSites[0] &&
        selectedSites.length === matchedIqSites.length)
    ) {
      types.push(
        "Time Sync",
        "Heartbeat",
        "Frame Count",
        "Reboot Log",
        "VRM Count Notification",
        "Camera Api Alert"
      );
    }

    if (userLoginType === "Admin" ||
      (matchAlertAccess &&
        selectedSites[0] &&
        selectedSites.length === matchedMatchRateSites.length)
    ) {
      types.push("Match Rate Alert");
    }
    if (userLoginType === "Admin") {
      types.push("Occupancy24h Alert", "Basic Occupancy Alert", "Occupancy Pro Alert")
    } else {
      if (userData.basicOccupancyAccess) {
        types.push("Basic Occupancy Alert")
      }
      if (userData.occupancy24hAccess) {
        types.push("Occupancy24h Alert")
      }
      if (userData.occupancyProAccess) {
        types.push("Occupancy Pro Alert")
      }
    }
    setNotificationTypes(types);
      setSelectedNotificationType(types);
      localStorage.setItem("iqStats-archivedNotification-selected-notificationType", types.join())
      
  },[sitesData,selectedSites])

  const getarchivedNotificationData = async (page: any,) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/api/iqStats/allNotification`, { type: userLoginType, email: email, site: selectedSites.join(), page: page, perPage: rowsPerPage, status: "archived", sortType: sortType[0] ? sortType[0] : "", priorityStatus: priorityStatus[0] ? priorityStatus[0] : "", notificationType: selectedNotificationType.join() },
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      setarchivedNotificationData(data.data);
      setCount(data.totalCount);
      localStorage.setItem('iqStats-archivedNotification-selected-site', selectedSites.join())
      localStorage.setItem('iqStats-archivedNotification-selected-sortType', sortType[0] ? sortType[0] : '')
      localStorage.setItem('iqStats-archivedNotification-selected-priorityStatus', priorityStatus[0] ? priorityStatus[0] : '')
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Something Went Wrong",
        { variant: "error" }
      );
    }
    setLoading(false);
  };


  useEffect(() => {
    if (archivedNotificationData && archivedNotificationData[0]) {
      let dataArr = [];
      for (const eachData of archivedNotificationData) {
        dataArr.push({
          _id: eachData._id,
          Site: Formatter.capitalizeSite(eachData.site),
          "Date/Time": dayjs(eachData.when).tz("Europe/London").format("DD-MM-YYYY HH:mm"),
          "Camera Name": eachData.camera ? eachData.camera : "NA",
          "More Records":
            eachData.dates.length === 1 ? "0" : eachData.dates.length - 1,
          "Notification Type": eachData.type
            ? eachData.type
            : "MATCH RATE ALERT",
          "Sub Notificatoion Type": eachData.notificationType ? eachData.notificationType : "NA" ,
          "Snooze Days": eachData.daysToSnooze,
          "Snoozed On": dayjs(eachData.startTime).format("DD-MM-YYYY HH:mm"),
          endTime: eachData.endTime,
          Actions: getActions({
            _id: eachData.id,
            type: eachData.type ? eachData.type : "Match Rate Alert",
            notificationType: eachData.notificationType
            ? eachData.notificationType
            : "NA",
            site: eachData.site,
            camera: eachData.camera,
            endTime: eachData.endTime,
            startTime: eachData.startTime,
          }),
        });
      }
      setFormattedData(dataArr);
    } else {
      setFormattedData([]);
    }


  }, [archivedNotificationData]);

  useEffect(() => {
    if (selectedSites && selectedSites.length > 0) {
      setPage(0)
      getarchivedNotificationData(0)
    }
  }, [selectedSites, sortType, priorityStatus, selectedNotificationType])

  

 


  
 

  const getActions = (data: any) => {
    return (
      <ButtonGroup>
        <Button
          text="View All"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={() => {
            changeNotification("view", data);
          }}
        />
           <Button
          text="Add Notes"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={()=>{setOpenAddNotes(true);setaddNoteData(data)}}
        />
        <Button
          text="View Notes"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={()=>{setOpenViewNotes(true);setviewNoteData(data)}}
        />

        <Button
          text="Delete"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={() => { changeNotification("delete", data) }}
        />

      </ButtonGroup>
    );
  };

  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
    getarchivedNotificationData(newPage);
  };

  const changeNotification = (type: any, data: any) => {
    if(type==="view"){
      setOpenViewAllNotification(true);
      setViewAllNotificationData(data);
    }else if (type === "delete") {
      setOpenDelete(true);
      setDeleteData(data);
    }
  };

  const closeViwAllNotification = () => {
    setOpenViewAllNotification(false);
  };

  const closeViewNotesDialog = () => {
    setOpenViewNotes(false);
  };
  const closeAddNotesDialog = () => {
    setOpenAddNotes(false);
  };

  const closeDeleteDialog = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <Paper className={classes.root} elevation={0}>
        <div style={{ display: "flex", justifyContent: "end", flexWrap: 'wrap', marginBottom: '15px' }}>
          <Flex wrap="wrap">
            <MultiSelect
              placeholder="Select notification type"
              multiplePlaceholder="notification types selected"
              allPlaceholder="All notification types selected"
              multi={true}
              className="dashboard__refine-menu__multi-select --margin-bottom-large"
              style={{ marginRight: "10px" }}
              options={notificationTypes.map((type: string) => ({
                value: type,
                label: type,
              }))}
              values={selectedNotificationType}
              onChange={(values) => {
                setSelectedNotificationType(values);
                localStorage.setItem("iqStats-archivedNotification-selected-notificationType", values.join())

              }}
            />
            <MultiSelect
              disabled={formattedData && formattedData.length === 0}
              style={{ marginRight: "10px" }}
              className="dashboard__refine-menu__multi-select --margin-bottom-large"
              options={[
                "Newest To Oldest",
                "Oldest To Newest",
                "Number Of Notifications High",
                "Number Of Notifications Low",
              ].map((status: any) => ({
                value: status,
                label: status,
              }))}
              multi={false}
              placeholder="Select Sort Type"
              values={sortType}
              onChange={(values) => {
                setSortType(values);
              }}
            />
            <MultiSelect
              disabled={formattedData && formattedData.length === 0}
              style={{ marginRight: "10px" }}
              className="dashboard__refine-menu__multi-select --margin-bottom-large"
              options={[
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL",
              ].map((status: any) => ({
                value: status,
                label: status,
              }))}
              multi={false}
              placeholder="Select Priority Status"
              values={priorityStatus}
              onChange={(values) => {
                setpriorityStatus(values);
              }}
            />

            <MultiSelect
              className="dashboard__refine-menu__multi-select --margin-bottom-large"
              options={selectableSites.map((site: any) => ({
                value: Formatter.normalizeSite(site) || "",
                label: Formatter.capitalizeSite(site),
              }))}
              values={selectedSites}
              onChange={(values) => {
                const normalizedSites = Formatter.normalizeSites(values) || [];
                setSelectedSites(normalizedSites);
              }}
            />
          </Flex>
        </div>
        <DataTable
          columns={[
            "Site",
            "Notification Type",
            "Sub Notificatoion Type",
            "Camera Name",
            "Date/Time",
            "More Records",
            "Actions",
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
      <PopUpAllNotification
        status="archived"
        openViewAllNotification={openViewAllNotification}
        closeViwAllNotification={closeViwAllNotification}
        viewAllNotificationData={viewAllNotificationData}
        getNotificationData={getarchivedNotificationData}
        setViewAllNotificationData={setViewAllNotificationData}
        sites={selectedSites}
      />

      <DeleteAllNotification
        openDelete={openDelete}
        closeDeleteDialog={closeDeleteDialog}
        getNotification={getarchivedNotificationData}
        deleteData={deleteData}
      />
      <ViewNotes setviewNoteData={setviewNoteData} filterType= "multiple" closeDialog={closeViewNotesDialog} viewNoteData={viewNoteData} openDialog={openViewNotes}/>
      <AddNotes filterType= "multiple" closeDialog={closeAddNotesDialog} addNoteData={addNoteData} openDialog={openAddNotes}/>
    </>
  );
};
