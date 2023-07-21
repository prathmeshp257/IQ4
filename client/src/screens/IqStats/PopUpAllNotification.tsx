import React, { FC, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button} from "../../components";

import { useSnackbar } from "notistack";
import Paper from "@material-ui/core/Paper";
import { DataTable } from "../../components";
import { Formatter } from "../../utils";
import { ButtonGroup } from "@material-ui/core";
import dayjs from "dayjs";
import { MoveHistoric } from "./MoveHistoric";
import { MoveSnooze } from "./MoveSnooz";
import { ViewNotes } from "./ViewNotes";
import { AddNotes } from "./AddNotes";
import { DeleteAllNotification } from "./DeleteAllNotification";


interface ViewAllNotificationProps {
  openViewAllNotification: boolean;
  closeViwAllNotification: any;
  viewAllNotificationData: any;
  setViewAllNotificationData:any;
  getNotificationData: any;
  sites: any;
  status: any;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  dialogPaper: {
    maxHeight: "75vh",
  },
});


export const PopUpAllNotification: FC<ViewAllNotificationProps> = ({
  openViewAllNotification,
  closeViwAllNotification,
  viewAllNotificationData,
  getNotificationData,
  setViewAllNotificationData,
  sites, status
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50;
  const [count, setCount] = useState();
  const [popData, setPopData] = useState<any>([]);
  const [formattedData, setFormattedData] = useState<any>([]);
  const [actionTakenOpen, setActionTakenOpen] = useState<boolean>(false);
  const [openSnooze, setOpenSnooze] = useState<boolean>(false);
  const [openViewNotes, setOpenViewNotes] = useState<boolean>(false);
  const [openAddNotes, setOpenAddNotes] = useState<boolean>(false);
  const [moveHistoricData, setmoveHistoricData] = useState<any>({});
  const [moveSnoozeData, setmoveSnoozeData] = useState<any>({});
  const [addNoteData, setaddNoteData] = useState<any>({});
  const [viewNoteData, setviewNoteData] = useState<any>({});
  const [deleteData, setDeleteData] = useState<any>({});
  const [openDelete, setOpenDelete] = useState<boolean>(false);


  const close = () => {
    closeViwAllNotification();
    setViewAllNotificationData({});
    setPage(0);
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
  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
    getPopUpNotificationData(newPage, rowsPerPage);
  };
  
  const getPopUpNotificationData = async (page: any, rowsPerPage: any) => {
    setLoading(true)
    try {
      const { site, camera, type, notificationType } = viewAllNotificationData;
      const { data } = await axios.get(
        `/api/iqStats/popAllNotification?site=${site}&page=${page}&perPage=${rowsPerPage}&status=${status}&camera=${camera ? camera.replace("&","%26") : ""
        }&notificationType=${type}&subNotification=${notificationType}`,
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setPopData(data.allData);
      setCount(data.totalCount);
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Something Went Wrong", { variant: "error" });
    }
    setLoading(false);
  };

  const changeNotification = (type: any, data: any) => {
    if (type === "historic") {
      setActionTakenOpen(true);
      setmoveHistoricData(data);
    } else if(type === "snooze") {
      setOpenSnooze(true);
      setmoveSnoozeData(data);
    } else if(type === "delete"){
      setOpenDelete(true);
      setDeleteData(data);
    }
  };
  

  const getActions = (data: any) => {
    return (
      <ButtonGroup>
       { (status !== "historic" && status !=='archived') && <Button
          text="Action Taken"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={() => {
            changeNotification("historic", data);
          }}
        />}
        {(!data.endTime || dayjs(data.endTime).isBefore(dayjs())) && (status !== "historic" && status !=='archived') && 
          <Button
            text="Snooze"
            variant="outline"
            buttonStyle={{ padding: "8px 20px" }}
            onClick={() => {
              changeNotification("snooze", data);
            }}
          />
        }
          <Button
          text="Add Note"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={()=>{setOpenAddNotes(true);setaddNoteData(data)}}
        />
        <Button
          text="View Note"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={()=>{setOpenViewNotes(true);setviewNoteData(data)}}
        />
        <Button
          text="Delete"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={()=>{changeNotification("delete", data)}}
        />
      </ButtonGroup>
    );
  };

  useEffect(() => {
    setPage(0);
    if(Object.keys(viewAllNotificationData).length>0){
    getPopUpNotificationData(page, rowsPerPage);}
  }, [viewAllNotificationData]);

  useEffect(() => {
    if (popData) {
      const dataArr = [];
      for (const eachData of popData) {
        dataArr.push({
          _id: eachData._id,
          Site: Formatter.capitalizeSite(eachData.site),
          "Date/Time": dayjs(eachData.when).tz("Europe/London").format("DD-MM-YYYY HH:mm"),
          "Camera Name": eachData.camera ? eachData.camera : "NA",
          "Notification Type": eachData.type
            ? eachData.type
            : "Match Rate Alert",
          "Sub Notification Type": eachData.notificationType
          ? eachData.notificationType
          : "NA",
          "Snoozed Days": eachData.daysToSnooze,
          "Snoozed On": dayjs(eachData.startTime).tz("Europe/London").format("DD-MM-YYYY HH:mm"),
          Actions: getActions(eachData),
        });
      }
      setFormattedData(dataArr);
    }
  }, [popData]);

  const closeActionTakenDialog = () => {
    setActionTakenOpen(false);
  };
  const closeSnoozeDialog = () => {
    setOpenSnooze(false);
  };

  return (
    <>
      <Dialog
        open={openViewAllNotification}
        onClose={() => close()}
        fullWidth={true}
        classes={{ paper: classes.dialogPaper }}
        maxWidth={"md"}
      >
        <DialogTitle>{`All Records (Site - ${Formatter.capitalize(
          viewAllNotificationData.site
        )} , Type - ${viewAllNotificationData.type} ${viewAllNotificationData.camera
            ? ", Camera - " + viewAllNotificationData.camera
            : ""
          })`}</DialogTitle>
        <DialogContent>
          <Paper className={classes.root} elevation={0}>
            <DataTable
              columns={status === "live" ? [
                "Site",
                "Notification Type",
                "Sub Notification Type",
                "Camera Name",
                "Date/Time",
                "Actions",
              ] : status === "snooze" ? [
                "Site",
                "Notification Type",
                "Sub Notification Type",
                "Camera Name",
                "Date/Time",
                "Snoozed On",
                "Snoozed Days",
                "Actions",
              ] : [
                "Site",
                "Notification Type",
                "Sub Notification Type",
                "Camera Name",
                "Date/Time",
                "Actions"
              ]}
              data={formattedData || []}
              loading={loading}
              pagination={true}
              count={count || 0}
              handleChangePage={async (page: any) =>
                await handleChangePage(page)
              }
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Paper>

          <br />
        </DialogContent>
        <DialogActions className="pr-4">
          <Button text="Close" onClick={() => close()} color="secondary" />
        </DialogActions>
      </Dialog>
      <MoveHistoric
        type="viewAllNotification"
        closeViwAllNotification={closeViwAllNotification}
        actionTakenOpen={actionTakenOpen}
        closeDialog={closeActionTakenDialog}
        historicData={moveHistoricData}
        getNotificationData={getNotificationData}
        sites={sites}
      />
    
      <MoveSnooze
        type="viewAllNotification"
        closeViwAllNotification={closeViwAllNotification}
        openSnooze={openSnooze}
        closeDialogSnooze={closeSnoozeDialog}
        snoozeData={moveSnoozeData}
        getNotificationData={getNotificationData}
        sites={sites}
      />
      <DeleteAllNotification
        place="viewAllNotification"
        closeViwAllNotification={closeViwAllNotification}
        openDelete={openDelete}
        closeDeleteDialog={closeDeleteDialog}
        getNotification = {getNotificationData}
        deleteData={deleteData}
      />
       <ViewNotes setviewNoteData={setviewNoteData} filterType= "single" closeDialog={closeViewNotesDialog} viewNoteData={viewNoteData} openDialog={openViewNotes}/>
      <AddNotes filterType= "single" closeDialog={closeAddNotesDialog} addNoteData={addNoteData} openDialog={openAddNotes}/>
    </>
  );
};
