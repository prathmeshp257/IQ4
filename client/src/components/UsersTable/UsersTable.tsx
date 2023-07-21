import { createMuiTheme, IconButton, MuiThemeProvider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import { ConfirmModal } from "..";
import { PATHS } from "../../constants/paths";
import { Formatter } from "../../utils";
import { colors } from "../../utils/constants";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: colors.danger
		},
		secondary: {
			main: colors.primary
		}
	}
});

const cellStyle = { fontSize: isMobile ? 10 : 14 };

interface UsersTableProps {
	users?: {
		firstName: string;
		lastName: string;
		email: string;
		sites?: string[];
	}[];
}

export const UsersTable: FC<UsersTableProps> = ({ users }) => {
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const [usersList, setUsersList] = useState(users);
	const [modalOpen, setModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState("");

	const handleDeleteUser = (email: string) => {
		setUserToDelete(email);
		setModalOpen(true);
	};

	const handleConfirmDeleteUser = async (email: string) => {
		try {
			await axios.delete(`/api/users?email=${escape(email)}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			const filteredUsers = usersList?.filter(({ email }) => userToDelete !== email);
			setUsersList(filteredUsers);
			enqueueSnackbar(`${email} has been deleted.`);
		} catch (e) {
			enqueueSnackbar(`Failed to delete ${email}`, { variant: "error" });
		}
		setModalOpen(false);
	};

	return (
		<TableContainer component={Paper} style={{ borderRadius: 10 }}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell align="left" key="Email" style={cellStyle}>
							Email
						</TableCell>
						<TableCell align="left" key="Type" style={cellStyle}>
							Type
						</TableCell>
						<TableCell align="left" key="Sites" style={cellStyle}>
							Sites
						</TableCell>
						<TableCell align="center" key="Actions" style={cellStyle}>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{usersList &&
						usersList.map(({ firstName, lastName, email, sites }) => {
							return (
								<TableRow key={email}>
									<TableCell align="left" key="Email" style={cellStyle}>
										{email}
									</TableCell>
									<TableCell align="left" key="Sites" style={cellStyle}>
										{sites?.sort()?.map((site) => {
											return (
												<p key={site} style={{ margin: 2 }}>
													{Formatter.capitalizeSite(site)}
												</p>
											);
										})}
									</TableCell>
									<TableCell align="center" key="Actions" style={cellStyle}>
										<IconButton
											key="edit"
											onClick={() =>
												history?.push(PATHS.EDIT_USER, {
													firstName,
													lastName,
													email,
													sites
												})
											}
										>
											<EditIcon style={{ fontSize: isMobile ? 20 : 22 }} />
										</IconButton>
										<IconButton key="delete" onClick={() => handleDeleteUser(email)}>
											<DeleteIcon style={{ fontSize: isMobile ? 20 : 22 }} />
										</IconButton>
									</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
			<MuiThemeProvider theme={theme}>
				<ConfirmModal
					title="Are you sure?"
					text={`${userToDelete} will be permanently deleted and will no longer have access to the portal. Please confirm whether you intend to proceed.`}
					onConfirm={() => handleConfirmDeleteUser(userToDelete)}
					onDisagree={() => setModalOpen(false)}
					modalOpen={modalOpen}
				/>
			</MuiThemeProvider>
		</TableContainer>
	);
};
