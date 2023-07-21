import { FormikValues, useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { EditSchema } from "../../validationScheemas/exludeVrmSchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";

interface Props {
	editOpen: boolean;
	closeDialog: any;
	list: any;
	reloadData: any;
}

const useStyles = makeStyles((theme) => ({
	dialogPaper: {
		maxHeight: '75vh',
	},
}));

const Form = styled.form`
	width: 100%;
    text-align: center;
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
	min-width: ${isMobile ? "260px" : "455px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "455px"};
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

const TextArea = styled.textarea`
	display: flex;
	width: 100%;
	min-width: ${isMobile ? "260px" : "455px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "455px"};
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

export const EditList: FC<Props> = ({ editOpen, closeDialog, reloadData, list }) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [selectedStats, setSelectedStats] = useState<any>(list.statsExcluded || []);

	const handleSubmit = async (values: FormikValues) => {
		try {
			values.id = list._id
			values.site = Formatter.normalizeSite(values.site);
			values.vrms = values.vrms ? ((values.vrms).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			await axios.put("/api/excludeVrm", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			enqueueSnackbar("List edited successfully.");
			reloadData();

		} catch (e: any) {
			enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", { variant: "error" });
		}
		cancelEdit();
	};

	const cancelEdit = () => {
		formik.resetForm();
		closeDialog();
	}

	const formik = useFormik({
		initialValues: {
			name: "",
			site: "",
			statsExcluded: [],
			vrms: "",
		},
		validationSchema: EditSchema,
		onSubmit: handleSubmit
	});

	useEffect(() => {
		formik.setValues({
			name: list.name || "",
			site: Formatter.capitalizeSite(list.site) || "",
			statsExcluded: list.statsExcluded || [],
			vrms: list.vrms && list.vrms.length > 0 ? list.vrms.join() : "",
		})
		setSelectedStats(list.statsExcluded || [])
		// eslint-disable-next-line
	},[list])

	return (
		<Dialog open={editOpen} onClose={() => cancelEdit()}
			fullWidth={true}
			classes={{ paper: classes.dialogPaper }}
			maxWidth={'sm'}>
			<Form onSubmit={formik.handleSubmit}>
				<DialogTitle>
					{`Edit List`}
				</DialogTitle>
				<DialogContent>
					<Flex direction="row" justify="center" wrap="wrap">
						<div className="--margin-bottom-large">
							<Label>Name</Label>
							<InputText
								id="name"
								name="name"
								type="text"
								autoComplete="nope"
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("name")}
								value={formik.values.name}
							/>
							{formik.touched.name && formik.errors.name && (
								<Error>{formik.touched.name && formik.errors.name}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>Site</Label>
							<InputText
								id="site"
								name="site"
								type="text"
								autoComplete="nope"
								style={{cursor:'not-allowed'}}
								disabled
								onChange={formik.handleChange}
								onBlur={() => formik.setFieldTouched("site")}
								value={formik.values.site}
							/>
							{formik.touched.site && formik.errors.site && (
								<Error>{formik.touched.site && formik.errors.site}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>Stats To Exclude</Label>
							<MultiSelect
								style={{ width: `${isMobile ? "260px" : "455px"}`, height: '44px' }}
								placeholder="Please select stats"
								multiplePlaceholder="stats selcted"
								allPlaceholder="All stats selected"
								options={['DWELL AVERAGE', 'DWELL BY HOUR', 'REPEAT ENTRY TIME', 'TOTAL VISITS','BASIC OCCUPANCY','OCCUPANCY 24H','OCCUPANCY PRO'].map((stat: string) => ({ value: stat, label: (stat).toUpperCase() }))}
								values={selectedStats}
								onChange={async (values: any) => {
									await setSelectedStats(values);
									formik.setFieldValue("statsExcluded", values)
								}}
							/>
							{formik.touched.statsExcluded && formik.errors.statsExcluded && (
								<Error>{formik.touched.statsExcluded && formik.errors.statsExcluded}</Error>
							)}
						</div>
						<div className="--margin-bottom-large">
							<Label>VRM's</Label>
							<TextArea
								id="vrms"
								name="vrms"
								rows={3}
								autoComplete="nope"
								onChange={(e:any) => {
									const re = /^[0-9A-Z,\b]+$/;					
									if (e.target.value === '' || re.test(e.target.value)) {
										formik.handleChange(e);
									}
									else{
										formik.setFieldError('vrms', 'Only numbers, capital letters and comma are acceptable')
									}
								}}
								onBlur={() => formik.setFieldTouched("vrms")}
								value={formik.values.vrms}
							/>
							{formik.touched.vrms && formik.errors.vrms && (
								<Error>{formik.touched.vrms && formik.errors.vrms}</Error>
							)}
						</div>
					</Flex>

				</DialogContent>

				<Flex direction="row" justify="center" wrap="wrap">
					<DialogActions>
						<Button text="Cancel" onClick={() => cancelEdit()} color='secondary' />
						<Button text="Submit" type="submit" loading={formik.isSubmitting} />
					</DialogActions>
				</Flex>
			</Form>
		</Dialog>
	);
};
