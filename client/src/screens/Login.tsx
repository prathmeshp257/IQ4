import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { FC, useContext, useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import Logo from "../assets/images/logo.png";
import { UserContext, AuthContext, SiteContext } from "../context";
import { LoginForm } from "../forms";
import { Token } from "../utils"

const Background = styled.div`
	background-color: #424455 !important;
	height: 100vh;
	width: 100%;
`;

const useStyles = makeStyles((theme) => ({
	paper: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	title: {
		color: theme.palette.common.white,
		fontWeight: 600,
		fontSize: 30,
		letterSpacing: 0.92,
		marginTop: 50,
		marginBottom: 0,
		marginLeft: "auto",
		marginRight: "auto",
		textAlign: "center",
		position: "relative"
	},
	user: {
		color: theme.palette.common.black,
		fontWeight: 600,
		fontSize: 28,
		height: 86,
		letterSpacing: 0.92,
		textAlign: "center",
		position: "relative"
	}
}));

export const Login: FC = () => {
	const { resetUserContext } = useContext(UserContext);
	const { resetSiteContext } = useContext(SiteContext);
	const { userData } = useContext(AuthContext);
	const classes = useStyles();
	const [prevToken, setPrevToken] = useState<any>("");
	const [prevEmail, setPrevEmail] = useState<any>("");
	const [prevType, setPrevType] = useState<any>("");

	useEffect(() =>{
		const localToken = localStorage.getItem("token") || "";
		const localType = userData.userType;
		if(localToken){
			const email = Token.user(localToken).email;
			setPrevToken(localToken);
			setPrevEmail(email);
			setPrevType(localType);
		}
		localStorage.clear();
		sessionStorage.clear();
		resetUserContext();
		resetSiteContext();
		// eslint-disable-next-line
	}, []);

	return (
		<Background>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Fade in={true} timeout={1700}>
						<Typography component="h1" variant="h5" className={classes.title}></Typography>
					</Fade>
					<div
						style={{
							marginTop: 50,
							minWidth: isMobile ? 340 : 440,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							background: "white",
							borderRadius: 10,
							padding: 32,
							boxShadow: "#272626 5px 8px 17px"
						}}
					>
						<img src={Logo} alt="Logo" width={68} height={68} style={{ marginTop: 5 }} />
						<LoginForm prevToken={prevToken} prevType={prevType} prevEmail={prevEmail} />
					</div>
				</div>
			</Container>
		</Background>
	);
};
