import React, { useState, useEffect, FC } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

interface DialogModalProps {
	title: string;
	text: string;
	modalOpen: boolean;
	onAknowledge: () => void;
}

export const DialogModal: FC<DialogModalProps> = ({ title, text, modalOpen = false, onAknowledge }) => {
	const [open, setOpen] = useState(modalOpen);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		setOpen(modalOpen);
	}, [modalOpen]);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
				style={{ borderRadius: 10 }}
			>
				<DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText>{text}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button style={{ marginRight: "auto", fontWeight: "bold" }} onClick={onAknowledge} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
