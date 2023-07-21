import AddIcon from "@material-ui/icons/Add";
import Axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, UsersTable } from "../components";
import { PATHS } from "../constants/paths";
import { Shell } from "../containers";
import { AuthContext } from "../context";

export const Settings: FC = () => {
	const history = useHistory();
	const [users, setUsers] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { reloadUserData } = useContext(AuthContext);

	useEffect(() => {
		getUsers();
		reloadUserData();
		// eslint-disable-next-line
	}, []);

	const getUsers = async () => {
		setLoading(true);
		setError(false);
		try {
			const { data } = await Axios.get("/api/users", {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setUsers(data);
		} catch (e) {
			setError(true);
		}
		setLoading(false);
	};

	const EndSlot = () => {
		return <Button icon={<AddIcon />} iconPosition="before" text="User" onClick={() => history.push(PATHS.NEW_USER)} />;
	};

	return (
		<Shell title="Settings" subtitle={"Manage your account"} loading={loading} error={error} endSlot={<EndSlot />}>
			{users && <UsersTable users={users} />}
		</Shell>
	);
};
