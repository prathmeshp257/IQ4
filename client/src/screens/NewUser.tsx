import React, { FC } from "react";
import { Shell } from "../containers";
import { NewUserForm } from "../forms/NewUserForm";

export const NewUser: FC = () => {
	return (
		<Shell title="Account" subtitle="Setup a new retailer or admin account">
			<div
				style={{
					maxWidth: 740,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					background: "white",
					borderRadius: 10,
					padding: 24,
					boxShadow: "2px 3px 7px #a8a8a871"
				}}
			>
				<NewUserForm />
			</div>
		</Shell>
	);
};
