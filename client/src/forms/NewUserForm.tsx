import { useFormik } from "formik";
import React, { FC } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex } from "../components";
import { colors } from "../utils/constants";
import { UserSchema as schema } from "./UserSchema";

const Form = styled.form`
	width: 100%;
`;

const Label = styled.label`
	font-size: 12px;
	display: flex;
	margin-bottom: 4px;
	color: ${colors.darkGray};
`;

const Error = styled.label`
	font-size: 12px;
	color: red;
	display: ${(e) => (e ? "block" : "none")};
	margin-top: 10px;
`;

const InputText = styled.input`
	display: flex;
	height: 44px;
	width: 100%;
	min-width: ${isMobile ? "260px" : "285px"};
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
	margin-top: 40px;
	text-align: center;
`;

export const NewUserForm: FC = () => {
	// const { enqueueSnackbar } = useSnackbar();
	// const { reloadUserData } = useContext(AuthContext);
	// const [rawSites, setRawSites] = useState<any>([]);

	// const history = useHistory();

	// useEffect(() => {
	// 	const getRawSites = async () => {
	// 		reloadUserData();

	// 		const { data } = await axios.get("/api/sites/raw", {
	// 			headers: { authorization: "Bearer " + localStorage.getItem("token") }
	// 		});

	// 		setRawSites(data.sites);
	// 	};

	// 	getRawSites();
	// 	// eslint-disable-next-line
	// }, []);

	// const handleSubmit = async (values: FormikValues) => {
	// 	try {
	// 		await axios.post("/api/users", values, {
	// 			headers: { authorization: "Bearer " + localStorage.getItem("token") }
	// 		});

	// 		await reloadUserData();

	// 		enqueueSnackbar("Account created.");

	// 		history?.replace(PATHS.LIVE);
	// 	} catch (e) {
	// 		enqueueSnackbar("Failed to create account, please try again later.", { variant: "error" });
	// 	}
	// };

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			sites: [] as any
		},
		validationSchema: schema,
		onSubmit: () => {}
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
					<Label>First name</Label>
					<InputText
						id="firstName"
						name="firstName"
						type="text"
						autoComplete="nope"
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
						type="text"
						autoComplete="nope"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("lastName")}
						value={formik.values.lastName}
					/>
					{formik.touched.lastName && formik.errors.lastName && (
						<Error>{formik.touched.lastName && formik.errors.lastName}</Error>
					)}
					<br />
					<Label>Email address</Label>
					<InputText
						id="email"
						name="email"
						type="email"
						autoComplete="nope"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("email")}
						value={formik.values.email}
					/>
					{formik.touched.email && formik.errors.email && <Error>{formik.touched.email && formik.errors.email}</Error>}
					<br />
					<Label>Password</Label>
					<InputText
						id="password"
						name="password"
						type="password"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("password")}
						value={formik.values.password}
					/>
					{formik.touched.password && formik.errors.password && (
						<Error>{formik.touched.password && formik.errors.password}</Error>
					)}
					<br />
					<Label>Confirm password</Label>
					<InputText
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						onChange={formik.handleChange}
						onBlur={() => formik.setFieldTouched("confirmPassword")}
						value={formik.values.confirmPassword}
					/>
					{formik.touched.confirmPassword && formik.errors.confirmPassword && (
						<Error>{formik.touched.confirmPassword && formik.errors.confirmPassword}</Error>
					)}
				</div>
				<div>
					{/* {accessLevel > 1 && (
						<>
							<Label>Car parks</Label>
							<div
								style={{
									backgroundColor: "#f4f2f6",
									borderRadius: 10,
									padding: 8,
									boxShadow: "inset 1px 1px 2px #14141469"
								}}
							>
								{rawSites?.map((site: string) => (
									<Checkbox
										className="multi-select__menu-item"
										key={site}
										children={Formatter.capitalizeSite(site)}
										checked={[...formik.values.sites].includes(site)}
										value={Formatter.capitalizeSite(site)}
										onClick={() => {
											const alreadyIncludesSite = [...formik.values.sites].includes(site);
											if (alreadyIncludesSite) {
												formik.setFieldValue("sites", [
													...formik.values.sites.filter((formikSite: string) => formikSite !== site)
												]);
											} else {
												formik.setFieldValue("sites", [...formik.values.sites, site]);
											}
										}}
									/>
								))}
							</div>
							{formik.touched.sites && formik.errors.sites && (
								<Error>{formik.touched.sites && formik.errors.sites}</Error>
							)}
						</>
					)} */}
				</div>
			</Flex>

			<ButtonContainer>
				<Button text="Submit" type="submit" loading={formik.isSubmitting} onClick={() => formik.submitForm()} />
			</ButtonContainer>
		</Form>
	);
};
