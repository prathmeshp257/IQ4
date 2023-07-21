import { Link, MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import { FormikValues, useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, DialogModal } from "../components";
import { PATHS } from "../constants/paths";
import { Token } from "../utils";
import { colors } from "../utils/constants";
import { Formatter } from "../utils/Formatter";
import { LoginFormSchema } from "./LoginFormSchema";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#414454"
		}
	}
});

const Container = styled.div`
	width: 100%;
	max-width: 300px;
	display: flex;
	flex-direction: column;
`;

const Label = styled.label`
	font-size: 14px;
	font-weight: bold;
	display: flex;
	margin-top: 20px;
	margin-bottom: 4px;
	color: ${colors.dark};
`;

const Error = styled.label`
	font-size: 12px;
	color: red;
	margin-top: 8px;
`;

const InputText = styled.input`
	display: flex;
	height: 44px;
	width: 100%;
	padding: 10px;
	margin: 2px 0;
	max-width: 880px;
	box-shadow: inset 1px 1px 2px #14141469;
	border-radius: 10px;
	border: none;
	font-size: 13px;
	letter-spacing: 1.1px;
	align-items: center;
	background-color: #f4f2f6;
	-webkit-appearance: none;
	:focus {
		outline-color: ${colors.primary};
	}
`;

const ButtonContainer = styled.div`
	display: block;
	margin-top: 30px;
	text-align: center;
`;

interface Props {
	prevToken: any;
	prevType: any;
	prevEmail: any;
}

export const LoginForm: FC<Props> = ({prevToken, prevType, prevEmail}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const handleSubmit = async (values: FormikValues) => {
		try {
			const {data: userData} = await axios.get("https://ipapi.co/json/");
			
			if(userData){
				values.ip = userData.ip || "";
				values.country = userData.country_name || "";
				values.city = userData.city || "";
				values.postal = userData.postal || "";
				values.org = userData.org || "";
				values.prevToken = prevToken;
				values.prevType = prevType;
				values.prevEmail = prevEmail;
			}

			let data ;
			if(history?.location?.pathname === PATHS.ADMIN_LOGIN){
				const {data:data1} = await axios.post(`/api/auth/adminLogin`, values);
				data = data1
				localStorage.setItem("userType", "Admin");
				localStorage.setItem("adminLogo", data.userLogo);
				localStorage.setItem("profile-img", data.profileImg);
			}
			else{
				const {data:data1} = await axios.post(`/api/auth/login`, values);
				data = data1
				localStorage.setItem("userType", data.userType);
				if(data.userType === "Operator"){
					localStorage.setItem("operatorLogo", data.userLogo);
					localStorage.setItem("profile-img", data.profileImg);
				}else if(data.userType === "Retailer"){
					localStorage.setItem("retailerLogo", data.userLogo);
					localStorage.setItem("profile-img", data.profileImg);
				}
				else if(data.userType === "Customer"){
					localStorage.setItem("customerLogo", data.userLogo);
					localStorage.setItem("profile-img", data.profileImg);
				}
			}
			let siteData = {} as any
			if(history?.location?.pathname != PATHS.ADMIN_LOGIN){
				const { data : data1 } = await axios.post("api/users/retailers/getSites",{token: data.token },
					{headers: { authorization: "Bearer " + data.token  }}
				);
				siteData = data1;
			}

			const userToken = Token.user(data.token)
			const email = userToken.email;
			const userLoginType = userToken.userType;
			const sites = userToken ? userToken.sites : [];
			const insightAccess = userLoginType == 'Admin'? true : siteData ? siteData.insightAccess : false;
			const insightAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.insightAccessSites : [];
			const iqStatAccess = userLoginType == 'Admin'? true : siteData ? siteData.iqStatAccess : false;
			const iqStatAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.iqStatAccessSites : [];
			const goNeutralAccess = userLoginType == 'Admin'? true : siteData ? siteData.goNeutralAccess : false;
			const goNeutralAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.goNeutralAccessSites : [];
			const voiSettingAccess = userLoginType == 'Admin'? true : siteData ? siteData.voiSettingAccess : false;
			const voiViewOnlyAccess = userLoginType == 'Admin'? true : siteData ? siteData.voiViewOnlyAccess : false;
			const voiSettingAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.voiSettingAccessSites : [];
			const voiViewOnlyAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.voiViewOnlyAccessSites : [];
			const voiPrivateAccess = userLoginType == 'Admin'? true : siteData ? siteData.voiPrivateAccess : false;
			const voiPrivateAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.voiPrivateAccessSites : [];
			const vehicleSearchAccess = userLoginType == 'Admin'? true : siteData ? siteData.vehicleSearchAccess : false;
			const vehicleSearchAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.vehicleSearchAccessSites : [];
			const matchRateAlertAccess = userLoginType == 'Admin'? true : siteData ? siteData.matchRateAlertAccess : false;
			const matchRateAlertAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.matchRateAlertAccessSites : [];
			const dashboardAccess = userLoginType == 'Admin'? true : siteData ? siteData.dashboardAccess : false;
			const dashboardAccessSites = userLoginType == 'Admin'? sites : siteData ? siteData.dashboardAccessSites : [];

			localStorage.setItem("token", data.token);
		
		
			const hasAccessToInsights = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites[0] !== "");
			const hasAccessToIqStats = userLoginType === "Admin" || 
				((userLoginType === "Retailer" || userLoginType === "Operator") && iqStatAccess && iqStatAccessSites.length > 0 && iqStatAccessSites[0] !== "") || 
				((userLoginType === "Retailer" || userLoginType === "Operator") && matchRateAlertAccess && matchRateAlertAccessSites.length > 0 && matchRateAlertAccessSites[0] !== "");
			const hasAccessToGoNeutral = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && goNeutralAccess && goNeutralAccessSites.length > 0 && goNeutralAccessSites[0] !== "");
			const hasVoiAccess = userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && ((voiSettingAccess && voiSettingAccessSites.length > 0 && voiSettingAccessSites[0] !== "") ||
				(voiViewOnlyAccess && voiViewOnlyAccessSites.length > 0 && voiViewOnlyAccessSites[0] !== "") ||
				(voiPrivateAccess && voiPrivateAccessSites.length > 0 && voiPrivateAccessSites[0] !== "") ||
				(vehicleSearchAccess && vehicleSearchAccessSites.length > 0 && vehicleSearchAccessSites[0] !== "")));
			const hasAccessToDashboard = userLoginType === "Admin" || userLoginType === "Customer" || ((userLoginType === "Retailer" || userLoginType === "Operator") && dashboardAccess && dashboardAccessSites.length > 0 && dashboardAccessSites[0] !== "");

			const path = hasAccessToDashboard ? PATHS.DASHBOARD : hasAccessToInsights ? PATHS.INSIGHTS : hasAccessToIqStats ? PATHS.IQ_STATS : hasAccessToGoNeutral ? PATHS.VRM_CORRECTION : hasVoiAccess ? PATHS.VOI : userLoginType === 'Customer' ? PATHS.EDIT_USER : PATHS.USERS
			history.replace(path);
		} catch (e:any) {
			if(e.response.data.message){
				enqueueSnackbar(e.response.data.message, { variant: "error" });
			}else if(e.message){
				enqueueSnackbar(e.message, { variant: "error" });
			}else{
				enqueueSnackbar("Something went wrong, please try again at a later moment", { variant: "error" });
			}
		}
	};

	const formik = useFormik({
		initialValues: { email: "", password: "" },
		validationSchema: LoginFormSchema,
		onSubmit: handleSubmit
	});

	const handleForgotPassword = () => {
		setModalOpen(true);
	};

	return (
		<Container>
			<form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
				<br />
				<Label>Email address</Label>
				<InputText
					id="email"
					name="email"
					type="text"
					onChange={formik.handleChange}
					onBlur={() => formik.setFieldTouched("email")}
					value={formik.values.email}
				/>
				<Error>{formik.touched.email && formik.errors.email}</Error>
				<Label>Password</Label>
				<InputText
					id="password"
					name="password"
					type="password"
					onChange={formik.handleChange}
					onBlur={() => formik.setFieldTouched("password")}
					value={formik.values.password}
				/>
				<Error>{formik.touched.password && formik.errors.password}</Error>

				<ButtonContainer>
					<Button type="submit" text="Login" loading={formik.isSubmitting} />
				</ButtonContainer>
				<Link
					style={{ marginTop: 16, fontSize: 11, marginLeft: 2, color: "#414454" }}
					href="#"
					onClick={handleForgotPassword}
				>
					Forgot password?
				</Link>
			</form>
			<MuiThemeProvider theme={theme}>
				<DialogModal
					title="Forgot password?"
					text={"Please contact the system administrator."}
					onAknowledge={() => setModalOpen(false)}
					modalOpen={modalOpen}
				/>
			</MuiThemeProvider>
		</Container>
	);
};
