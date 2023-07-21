import React, { FC, useState } from "react";
import { Button, Flex } from "../../components";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { useSnackbar } from "notistack";

interface Props {
  deleteOpen:any;
  closeDialog:any;
  site:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));

export const DeleteSite: FC<Props> = ({deleteOpen, closeDialog, site}) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event:any) => {
        event.preventDefault();
		setLoading(true)
        try{
			await axios.delete(`/api/sites?site=${site._id}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Site deleted successfully.");
			setLoading(false)

		} catch (e:any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
			setLoading(false)
		}
		cancelDelete();
	};

	const cancelDelete = () => {
		closeDialog(); 
	}

	return (
        <Dialog open={deleteOpen} onClose={ () => cancelDelete()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'sm'}>
		  <form onSubmit={(e) => handleSubmit(e)}>
            <DialogTitle>
				{`Delete Site`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    {`Are you sure you want to delete site "${site.name}"`}
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
