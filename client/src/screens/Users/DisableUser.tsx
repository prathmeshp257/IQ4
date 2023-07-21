import React, { FC, useContext, useState } from "react";
import { Button, Flex } from "../../components";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context";

interface Props {
  disableOpen: any;
  closeDialog: any;
  userType: any;
  user: any;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    maxHeight: '75vh',
  },
}));

export const DisableUser: FC<Props> = ({ disableOpen, closeDialog, userType, user }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true)
    try {
      if ((userType === "Retailer" || userType === "Collaborator" || userType === "Customer") && (user.operator?.disableUser === true || user.retailer?.disableUser === true)) {
        if (userType === "Customer") {
          enqueueSnackbar("First Enable the Retailer", {
            variant: "error",
          })
        } else {
          enqueueSnackbar("First Enable the Operator", {
            variant: "error",
          })
        }
      } else if ((userType === "Retailer" && (user && user.operator && user.operator.disableUser? user.operator.disableUser === false : true))) {
        await axios.post(`/api/users/disableUser`, { userId: user._id, userType: userType, disableUser: user.disableUser === false || user.disableUser === undefined ? true : false }, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") }
        });
        enqueueSnackbar(`User account ${user.disableUser === false || user.disableUser === undefined ? "Disabled" : "Enabled"} successfully.`, {
          variant: "success",
        });
      } else if ((userType === "Customer" && (user && user.operator && user.operator.disableUser? user.operator.disableUser === false : true))) {
        await axios.post(`/api/users/disableUser`, { userId: user._id, userType: userType, disableUser: user.disableUser === false || user.disableUser === undefined ? true : false }, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") }
        });
        enqueueSnackbar(`User account ${user.disableUser === false || user.disableUser === undefined ? "Disabled" : "Enabled"} successfully.`, {
          variant: "success",
        });
      }
      else if (userType === "Operator" || userType === "Collaborator") {
        await axios.post(`/api/users/disableUser`, { userId: user._id, userType: userType === "Collaborator" ? "Operator" : userType, disableUser: user?.disableUser === true || user.operator?.disableUser === true ? false : true }, {
          headers: { authorization: "Bearer " + localStorage.getItem("token") }
        });
        enqueueSnackbar(`User account ${user.disableUser === false || user.disableUser === undefined ? "Disabled" : "Enabled"} successfully.`, {
          variant: "success",
        });
      }

      setLoading(false)

    } catch (e: any) {
      console.log(e);
      enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
      setLoading(false)
    }
    cancelDisable();
  };

  const cancelDisable = () => {
    closeDialog();
  }

  return (
    <Dialog open={disableOpen} onClose={() => cancelDisable()}
      fullWidth={true}
      classes={{ paper: classes.dialogPaper }}
      maxWidth={'sm'}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <DialogTitle>
          {`${user?.disableUser === true || user.operator?.disableUser === true || user.retailer?.disableUser === true ? "Enable" : "Disable"} ${userType}`}
        </DialogTitle>
        <DialogContent>
          <Flex direction="row" justify="space-between" wrap="wrap">
            <div className="--margin-bottom-large">
              {`Are you sure you want to ${user?.disableUser === true || user.operator?.disableUser === true || user.retailer?.disableUser === true ? "Enable" : "Disable"} user "${user.email}"`}
            </div>
          </Flex>
        </DialogContent>
        <DialogActions className="pr-4">
          <Button text="Cancel" onClick={() => cancelDisable()} color='secondary' />
          <Button text={user?.disableUser === true || user.operator?.disableUser === true || user.retailer?.disableUser === true ? "Enable" : "Disable"} type="submit" loading={loading} />
        </DialogActions>
      </form>
    </Dialog>
  );
};
