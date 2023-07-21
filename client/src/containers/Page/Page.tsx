import React, { FC, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Footer, Navbar } from "../../components";
import { PATHS } from "../../constants";
import { AuthContext } from "../../context";
import { Token } from "../../utils";

interface PageProps {
	children: JSX.Element | React.ReactFragment;
}

export const Page: FC<PageProps> = ({ children }) => {
	const {
		reloadUserData,
		userData: { email }
	} = useContext(AuthContext);
	const history = useHistory();

	useEffect(() => {
		const reload = async () => {
			await reloadUserData();
		};

		reload();
		// eslint-disable-next-line
	}, [window.location.pathname, location]);

	useEffect(() => {
		const checkForTokenValidity = async () => {
			const isValidToken = await Token.isValid();
			if (!isValidToken) {
				history.replace(PATHS.LOGIN);
			}
		};

		checkForTokenValidity();

		// eslint-disable-next-line
	}, [history, window.location.pathname]);

	return (
		<div className="page">
			{email && (
				<>
					<Navbar />
					{children}
					<Footer />
				</>
			)}
		</div>
	);
};
