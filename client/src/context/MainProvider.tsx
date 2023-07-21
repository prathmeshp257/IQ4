import { SnackbarProvider } from "notistack";
import React, { FC } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { SiteProvider } from "./SitesContext";

export const MainProvider: FC = ({ children}) => {
	return (
		<AuthProvider>
			<UserProvider>
				<SiteProvider>
					<SnackbarProvider
						classes={{
							variantError: "snackbar-error",
							variantInfo: "snackbar-info",
							variantSuccess: "snackbar-success",
							variantWarning: "snackbar-warning"
						}}
						maxSnack={5}
					>
						{children}
					</SnackbarProvider>
				</SiteProvider>
			</UserProvider>
		</AuthProvider>
	);
};
