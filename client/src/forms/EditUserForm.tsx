import axios from "axios";
import { FormikValues, useFormik } from "formik";
import { useSnackbar } from "notistack";
import React, { FC, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button, Flex } from "../components";
import { PATHS } from "../constants/paths";
import { AuthContext } from "../context";
import { Formatter } from "../utils";
import { colors } from "../utils/constants";
import { EditUserSchema as schema } from "./EditUserSchema";

const Form = styled.form`
	width: 100%;
`;

const Label = styled.label`
	font-size: 14px;
	display: flex;
	margin-bottom: 4px;
	font-weight: bold;
	color: ${colors.dark};
`;

const Error = styled.label`
	font-size: 12px;
	color: red;
	font-weight: 500;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
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
	margin-top: 16px;
	text-align: center;
`;
interface EditUserFormProps {
	initialValues: {
		firstName: string;
		lastName: string;
		email: string;
		sites: any;
	};
}

export const EditUserForm: FC<EditUserFormProps> = ({ initialValues }) => {
	const { enqueueSnackbar } = useSnackbar();
	const {
		userData: { email: currentLoggedInEmail, userType },
		reloadUserData
	} = useContext(AuthContext);

	const history = useHistory();
	const [userData, setUserData] = useState<any>({});

	useEffect(() => {
		const getOperators = async () => {
			if(userType === 'Retailer'){
				const { data } = await axios.get(`/api/users?email=${currentLoggedInEmail}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setUserData(data[0])
			}
			if(userType === 'Customer'){
				const { data } = await axios.get(`/api/users/customers?email=${currentLoggedInEmail}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				setUserData(data[0])
			}
		}
		getOperators()
		// eslint-disable-next-line
	}, [userType]);

	const handleSubmit = async (values: FormikValues) => {

		values.sites = Formatter.normalizeSites(values.sites);

		try {
			if(userType === 'Retailer'){
				values.retailer = values.email;
				values.operator = userData?.operatorId?.email
				await axios.put("/api/users/retailer", values, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
			}
			
			if(userType === 'Operator'){
				await axios.put("/api/users/operator", values, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
			}
			
			if(userType === 'Customer'){
				values.retailer = userData?.retailerId?.email
				await axios.put("/api/users/customer", values, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
			}
			
			if(userType === 'Admin'){
				await axios.put("/api/users/admin", values, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
			}

			if (currentLoggedInEmail === formik.values.email) {
				await reloadUserData({ email: formik.values.email, password: formik.values.newPassword ? formik.values.newPassword : formik.values.oldPassword});
			}

			enqueueSnackbar("Account details have been amended.");

			history?.replace(PATHS.LIVE);
		} catch (e) {
			enqueueSnackbar("Failed to amend account details, please try again later.", { variant: "error" });
		}
	};

	const formik = useFormik({
		initialValues: {
			firstName: initialValues.firstName,
			lastName: initialValues.lastName,
			email: initialValues.email,
			oldPassword: "",
			newPassword: "",
			sites: initialValues.sites || []
		},
		validationSchema: schema,
		onSubmit: handleSubmit
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div style={{ minWidth: "100%" }}>
					<Flex align="center">
						<div>
							<h4 style={{ margin: 0, fontWeight: 400 }}>
								<b style={{ fontSize: 18 }}>
									{formik.values.firstName} {formik.values.lastName}
								</b>
							</h4>
						</div>
					</Flex>
					<br />
					<Label>Email</Label>
					<InputText
						style={{ color: "darkgray", cursor: "not-allowed" }}
						id="email"
						name="email"
						type="text"
						disabled
						autoComplete="nope"
						value={formik.values.email}
					/>
					<br />
					<Label>First name</Label>
					<InputText
						id="firstName"
						name="firstName"
						type="text"
						autoComplete="nope"
						maxLength={20}
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("firstName")}
						value={formik.values.firstName}
					/>
					{formik.touched.firstName && formik.errors.firstName && (
						<Error>{formik.touched.firstName && formik.errors.firstName}</Error>
					)}
					<br />
					<Label>Last name</Label>
					<InputText
						id="lastName"
						name="lastName"
						maxLength={20}
						type="text"
						autoComplete="new-password"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("lastName")}
						value={formik.values.lastName}
					/>
					{formik.touched.lastName && formik.errors.lastName && (
						<Error>{formik.touched.lastName && formik.errors.lastName}</Error>
					)}
					<br />
					<Label>Password</Label>
					<InputText
						id="oldPassword"
						name="oldPassword"
						type="password"
						autoComplete="new-password"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("oldPassword")}
						value={formik.values.oldPassword}
					/>
					<Error>{formik.touched.oldPassword && formik.errors.oldPassword}</Error>
					<br />
					<Label>New Password</Label>
					<InputText
						id="newPassword"
						name="newPassword"
						type="password"
						autoComplete="new-password"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("newPassword")}
						value={formik.values.newPassword}
					/>
					<Error>{formik.touched.newPassword && formik.errors.newPassword}</Error>
				</div>
			</Flex>

			<ButtonContainer>
				<Button text="Save Profile" type="submit" loading={formik.isSubmitting} onClick={() => formik.submitForm()} />
			</ButtonContainer>
		</Form>
	);
};
