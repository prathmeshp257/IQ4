import React, { FC, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

interface ConfirmModalProps {
	title: string;
	text?: string;
	modalOpen?: boolean;
	onConfirm?: () => void;
	onDisagree: () => void;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({ title, text, modalOpen = false, onConfirm, onDisagree }) => {
	const [open, setOpen] = useState(modalOpen);
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		setOpen(modalOpen);
	}, [modalOpen]);

	const handleClose = () => {
		onDisagree();
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
					<Button style={{ fontWeight: "bold" }} onClick={onConfirm} color="primary" autoFocus>
						Agree
					</Button>
					<Button
						style={{ marginRight: "auto", color: "#414454", fontWeight: "bold" }}
						autoFocus
						onClick={handleClose}
						color="inherit"
					>
						Disagree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
