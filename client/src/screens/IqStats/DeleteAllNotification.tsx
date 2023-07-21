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
	openDelete:any;
	closeDeleteDialog:any;
	deleteData:any;
	getNotification:any;
	closeViwAllNotification?:any;
	place?:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));
 


export const DeleteAllNotification: FC<Props> = ({openDelete, closeDeleteDialog, deleteData, getNotification, place, closeViwAllNotification}) => {
	const classes = useStyles();
	const {userData} = useContext(AuthContext);
	const userType = userData.userType;
	const email = userData.email;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event:any) => {
        event.preventDefault();
		setLoading(true)
		try {
			const { site, type,_id, notificationType } = deleteData;
		
            await axios.post("/api/iqStats/allNotificationDeleteAction", {
				email,
				type:userType,
				site,
				status:'archived',
				notification_id:_id,
				notificationType:type,
				subNotification: notificationType ? notificationType : "NA",
			}, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
              }
			  );

                enqueueSnackbar("Notification deleted successfully.",{
                    variant: "success",
                });

				getNotification(0)
			    setLoading(false)
				if (place === "viewAllNotification") {
					closeViwAllNotification();
				  }

		} catch (e:any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
			setLoading(false)
		}
		cancelDelete();
		
	};

	const cancelDelete = () => {
		closeDeleteDialog(); 
	}

	return (
        <Dialog open={openDelete} onClose={ () => cancelDelete()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'sm'}>
		  <form onSubmit={(e) => handleSubmit(e)}>
            <DialogTitle>
				{`Delete Notification`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    {`Are you sure you want to delete Notification ?`}
				</div>
			</Flex>
            </DialogContent>
            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={ () => cancelDelete() } color='secondary' />
				<Button text="Delete" type="submit" loading={loading} />
            </DialogActions>
          </form>
        </Dialog>
	);
};
