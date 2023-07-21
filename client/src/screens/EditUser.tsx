import React, { FC, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Shell } from "../containers";
import { UserContext } from "../context";
import { EditUserForm } from "../forms";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	sites: any;
}

export const EditUser: FC = () => {
	const location = useLocation();
	const context = useContext(UserContext);

	const { firstName, lastName, email, sites } = (location.state as UserData) || context;

	return (
		<Shell title="" subtitle="">
			<div
				style={{
					maxWidth: 460,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					background: "white",
					borderRadius: 10,
					padding: 24,
					boxShadow: "2px 3px 7px #a8a8a871",
					margin: "auto"
				}}
			>
				<EditUserForm initialValues={{ firstName, lastName, email, sites }} />
			</div>
		</Shell>
	);
};
