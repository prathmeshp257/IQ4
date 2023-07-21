import React, { FC, useState } from "react";
import { Button, Flex } from "../../components";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';


interface Props {
    viewOpen:any;
  closeDialog:any;
  response:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));

export const ViewURLResponse: FC<Props> = ({viewOpen, closeDialog, response}) => {
	const classes = useStyles();

	const closeView = () => {
		closeDialog(); 
	}

	return (
        <Dialog open={viewOpen} onClose={ () => closeView()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'md'}>
		  
            <DialogTitle>
				{`URL Response`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    { (response === 404 || !response || (response && response.length===0) || (response && response.versions && response.versions.length === 0) || Object.keys(response).length === 0) ? "No response received" : JSON.stringify(response)}
				</div>
			</Flex>
            </DialogContent>
            <DialogActions className="pr-4">
				<Button text="Close" onClick={ () => closeView() } color='secondary' />
            </DialogActions>
         
        </Dialog>
	);
};
