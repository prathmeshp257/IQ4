import { FormikValues, useFormik } from "formik";
import React, { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { AddRemoveSchema } from "../../validationScheemas/VOISchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import { useSnackbar } from "notistack";
import { Formatter } from "../../utils";

interface Props {
	addRemoveVehicleOpen:any;
	closeDialog:any;
	listData:any;
	refreshData:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));

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

const TextArea = styled.textarea`
	display: flex;
	width: 100%;
	min-width: ${isMobile ? "260px" : "285px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "285px"};
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

export const AddOrRemoveVehicle: FC<Props> = ({addRemoveVehicleOpen, closeDialog, listData = [], refreshData}) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const [selectedLists, setSelectedLists] = useState<any>([]);

	const handleSubmit = async (values: FormikValues) => {
		try {
			const vrmArr = values.vrms.split(',').filter((val: any) => val !== '')
			values.vrms = vrmArr;
			await axios.post('/api/voi/addRemoveVehicle', values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			})
			let msg = "Vehicles added to the selected lists successfully."
			if(values.type === 'Remove'){
				msg = "Vehicles removed from the selected lists successfully."
			}
			enqueueSnackbar(msg);
			refreshData();

		} catch (e:any) {
			console.log("Error in add voi list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
		}
		addRemoveCancel();
	};

	const formik = useFormik({
		initialValues: {
			lists: [] as any,
			vrms: "",
			type: "Add"
		},
		validationSchema: AddRemoveSchema,
		onSubmit: handleSubmit
	});

	const addRemoveCancel = () => {
		formik.resetForm();
		setSelectedLists([])
		closeDialog();
	}

	return (
        <Dialog open={addRemoveVehicleOpen} onClose={addRemoveCancel}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'sm'}>
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
				{`Add Or Remove Vehicles`}
            </DialogTitle>
            <DialogContent>
			<Flex direction="row" justify="space-between" wrap="wrap">
				<div className="--margin-bottom-large">
                    <Label>Type</Label>
					<div style={{marginLeft:"0", width:"270px", marginTop:"15px"}} role="group" 
						onChange={(e:any) => {
							formik.handleChange(e);
						}} 
					>
						<label style={{cursor:"pointer"}}>
							<input type="radio" defaultChecked={true} name="type" value="Add" id="Add" style={{marginRight:"5px"}} />
							Add 
						</label>
						<label style={{cursor:"pointer"}}>
							<input style={{marginLeft:"50px", marginRight:"5px"}} type="radio" name="type" value="Remove" id="Remove" />
							Remove 
						</label>
					</div>
					{formik.touched.type && formik.errors.type && (
						<Error>{formik.touched.type && formik.errors.type}</Error>
					)}
				</div>
				<div className="--margin-bottom-large">
                    <Label>Select Lists</Label>
					<MultiSelect
						placeholder='Please select VOI lists'
						allPlaceholder= 'All VOI Lists Selected'
						multiplePlaceholder= 'VOI Lists Selected'
						multi={true}
						style={{width:"270px", height:'44px'}}
						options={listData.map((list:any) => ({ value: list._id, label: `${list.listName}(${Formatter.capitalizeSite(list.site)})` }))}
						values={selectedLists}
						onChange={async(values) => {
							await setSelectedLists(values);
							formik.setFieldValue("lists",values)
						}}
					/>
					{formik.touched.lists && formik.errors.lists && (
						<Error>{formik.touched.lists && formik.errors.lists}</Error>
					)}
				</div>
				<div className="--margin-bottom-large" style={{width:'100%'}}>
					<Label>VRM List</Label>
					<TextArea
						rows={3}
						id="vrms"
						name="vrms"
						style={{display:'block',width:'100%', minWidth:'none', maxWidth:'none'}}
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

            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={addRemoveCancel} color='secondary' />
				<Button text="Submit" type="submit" loading={formik.isSubmitting} />
            </DialogActions>
          </Form>
        </Dialog>
	);
};
