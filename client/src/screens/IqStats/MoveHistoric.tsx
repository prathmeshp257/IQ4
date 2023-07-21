import React, { FC,useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button } from "../../components";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import { AuthContext} from "../../context";

import { useSnackbar } from "notistack";

interface MoveHistoricProps {
  actionTakenOpen: boolean;
  closeDialog: any;
  historicData: any;
  getNotificationData?: any;
  sites?: any;
  closeViwAllNotification?: any;
  type?: any;
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
  dialogPaper: {
    maxHeight: "75vh",
  },
});

const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;

export const MoveHistoric: FC<MoveHistoricProps> = ({
  actionTakenOpen,
  closeDialog,
  historicData,
  getNotificationData,
  sites,
  closeViwAllNotification,
  type,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { userData } = useContext(AuthContext);
  const userType = userData.userType;
  const email = userData.email;

  const moveToHistoric = async () => {
    const response = await axios.post(
      "/api/iqStats/allNotificationActionTaken",
      {
        status: "historic",
        notification_id: historicData._id,
        userType: userType,
        createdBy:email,
        notificationType: historicData.type?historicData.type:'Match Rate Alert',
        subNotification: historicData.notificationType ? historicData.notificationType : "NA",
        camera: historicData.camera,
      },
      {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      }
    );


    getNotificationData(0);

    enqueueSnackbar("Notification moved to historic successfully.");
    closeDialog();
    if (type === "viewAllNotification") {
      closeViwAllNotification();
    }
  };

  return (
    <Dialog
      open={actionTakenOpen}
      onClose={() => closeDialog()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={"sm"}
    >
      <Form>
        <DialogTitle>{`Move to historic IQ Stats Notification`}</DialogTitle>
        <DialogContent>
          <Label style={{ fontSize: "18px" }}>
            {`Are you sure you want to move this particular notification to historic?`}
          </Label>
        </DialogContent>
        <DialogActions>
          <Button text="Yes" onClick={moveToHistoric} color="secondary" />
          <Button text="No" onClick={() => closeDialog()} color="secondary" />
        </DialogActions>
      </Form>
    </Dialog>
  );
};
