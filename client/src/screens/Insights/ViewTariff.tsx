import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import { VOISchema } from "../../validationScheemas/VOISchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext, AuthContext } from "../../context";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import { TextField } from "@material-ui/core";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { date } from "yup";
import dayjs from "dayjs";
import { LabelledComponent } from "../../components/LabelledComponent";

interface Props {
	editOpen: any;
	closeDialog: any;
	viewData: any;
	refreshData: any;
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

const InputText = styled.input`
	display: flex;
	height: 44px;
	width: 100%;
	min-width: ${isMobile ? "200px" : "260px"};
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

export const ViewTariff: FC<Props> = ({ editOpen, closeDialog, viewData, refreshData }) => {
	const [tariffLists, setTariffLists] = useState<any>({});
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const cancelView = () => {
		closeDialog();
		refreshData()
	}

	return (
		<Dialog open={editOpen} onClose={() => cancelView()}
			fullWidth={true}
			classes={{ paper: classes.dialogPaper }}
			maxWidth={'sm'}>
			<Form >
				<DialogTitle>
					{viewData.tariffName}
				</DialogTitle>
				<DialogContent>
				<Flex>

					<LabelledComponent label="Sites" style={{ marginTop: "30px", width: "175px" }}>
							<p style={{}}>{viewData.sites && (viewData.sites).length > 0 ? (Formatter.capitalizeSites(viewData.sites)).join(",") : []}</p>
					</LabelledComponent>
					<LabelledComponent label="Tariff Type" style={{ marginTop: "30px", width: "175px",marginLeft:"" }}>					
							<span>{ viewData.selectedCase && viewData.selectedCase == 'Case1' ? 'Pay per hour' : viewData.selectedCase == 'Case2' ? 'Pay with reducing' : viewData.selectedCase == 'Case3' ? 'Pay as per entry time' : viewData.selectedCase == 'Case4' ? 'Flat payment as per Duration of stay' : ''}</span>					
					</LabelledComponent>
					<LabelledComponent label="Free minutes in minute" style={{ marginLeft:"", marginTop: "30px", width: "175px" }}>
							<span>{viewData.freeMinutes}</span>
					</LabelledComponent>
					</Flex>
                    <Flex>
					<LabelledComponent label="No return (in minutes)" style={{ marginLeft:"", marginTop: "55px", width: "175px"}}>
							<span>{viewData.noReturn}</span>
					</LabelledComponent>
					<LabelledComponent label="Grace Period" style={{ marginLeft:"", marginTop: "55px", width: "175px"}}>
							<span>{viewData.gracePeriod}</span>
					</LabelledComponent>
					<LabelledComponent label="Tariff Card" style={{marginTop:"30px", width: "175px"}}>
						<Flex>
						<LabelledComponent label="Start Date" style={{ marginTop: "1px", marginLeft: "" }}>
								<span>{dayjs(viewData.startDate).format("DD-MM-YYYY")}</span>
						</LabelledComponent>
						<LabelledComponent label="End Date" style={{ marginTop: "1px", marginLeft: "20px" }}>
								<span>{dayjs(viewData.endDate).format("DD-MM-YYYY")}</span>
						</LabelledComponent>
						</Flex>
					</LabelledComponent>
					</Flex>
					<Flex>
					
					{viewData.overnight == true ?
						<>
						<Flex>
							<LabelledComponent label="Duration of Overnight" style={{marginTop:"30px", width: "175px",marginLeft: ""}}>
								<Flex>
								<LabelledComponent label="From" style={{ marginTop: "1px", marginLeft: "" }}>
										<span>{viewData.overnightEntryTime}</span>
								</LabelledComponent>
								<LabelledComponent label="To" style={{ marginTop: "1px", marginLeft: "20px" }}>
										<span>{viewData.overnightExpiryTime}</span>
								</LabelledComponent>
								</Flex>
							</LabelledComponent>
						</Flex>

						</> : <></>
					}
					<LabelledComponent label="Overnight Charges" style={{ marginTop: "55px", width: "175px"}}>
							<span>{viewData.overnightChargesNormal}</span>
					</LabelledComponent>
					<LabelledComponent label="Overnight EV Charges" style={{ marginTop: "55px", width: "175px", marginLeft: ""  }}>
							<span>{viewData && viewData.overnightChargesEV ? viewData.overnightChargesEV : viewData.overnightChargesNormal}</span>
					</LabelledComponent>	
					</Flex>
					
					<Flex>
					
					</Flex>
					{viewData.selectedCase == 'Case1' ?
						<>
						<Flex>
							<LabelledComponent label="Charge per hour for normal" style={{ marginTop: "52px", width: "175px" }}>
									<span>{viewData.chargePerHourForNormal}</span>
							</LabelledComponent>
							{viewData.EvType == true ?
								<LabelledComponent label="Charge per hour for EV" style={{ marginTop: "52px", width: "175px" }}>
										<span>{viewData.chargePerHourForEV}</span>
								</LabelledComponent>
								: <></>}
							</Flex>

								
						</>
						: <></>}
                    {/* {viewData.selectedCase == 'Case2' ?
					<>
					{viewData.payWithReducing.map((val:any)=>{	
						return(
						<>
	                 <Flex>
					<LabelledComponent label="Duration" style={{marginTop:"30px",width: "233px"}}>
						<Flex>
						<LabelledComponent label="From" style={{ marginTop: "", marginLeft: "" }}>
								<span>{val.from}</span>
						</LabelledComponent>
						<LabelledComponent label="To" style={{ marginTop: "", marginLeft: "20px" }}>
								<span>{val.to}</span>
						</LabelledComponent>
						</Flex>
					</LabelledComponent>
					<LabelledComponent label="Charges for normal" style={{ marginTop: "53px", width: "200px" }}>
								<span>{val.chargeNormal}</span>
						</LabelledComponent>
					<LabelledComponent label="Charges for EV" style={{ marginTop: "53px",width: "200px", marginLeft:"10px" }}>
								<span>{val.chargeEV}</span>
						</LabelledComponent>
						</Flex></>)})}
				</>:<></>}
				{viewData.selectedCase == 'Case3' ?
					<>
					{viewData.payPerTime.map((val:any)=>{	
						return(
						<>
					<LabelledComponent label="Duration" style={{marginTop:"30px"}}>
						<Flex>
						<LabelledComponent label="From" style={{ marginTop: "", marginLeft: "" }}>
							<InputText
								id="from"
								name="from"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.from}
							/>
						</LabelledComponent>
						<LabelledComponent label="To" style={{ marginTop: "", marginLeft: "20px" }}>
							<InputText
								id="to"
								name="to"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.to}
							/>
						</LabelledComponent>
						</Flex>
					</LabelledComponent>
					<Flex>
					<LabelledComponent label="Charges for normal" style={{ marginTop: "30px", marginLeft: "" }}>
							<InputText
								id="chargeNormal"
								name="chargeNormal"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.chargeNormal}
							/>
						</LabelledComponent>
					<LabelledComponent label="Charges for EV" style={{ marginTop: "30px", marginLeft: "" }}>
							<InputText
								id="chargelEV"
								name="chargeEV"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.chargeEV}
							/>
						</LabelledComponent>
						</Flex></>)})}
				</>:<></>}     */}
				{viewData.selectedCase == 'Case3' ?
					<>
					{viewData.chargePerStay.map((val:any)=>{	
						return(
						<>
					<LabelledComponent label="Duration" style={{marginTop:"20px"}}>
						<Flex>
						<LabelledComponent label="From" style={{ marginTop: "", marginLeft: "" }}>
							<InputText
								id="from"
								name="from"
								type="text"
								autoComplete="nope"
								
								readOnly
								value={val.from}
							/>
						</LabelledComponent>
						<LabelledComponent label="To" style={{ marginTop: "", marginLeft: "10px" }}>
							<InputText
								id="to"
								name="to"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.to == 24 ? `${val.from}+` : val.to}
							/>
						</LabelledComponent>
						</Flex>
					</LabelledComponent>
					<Flex>
					<LabelledComponent label="Charges for normal" style={{ marginTop: "10px", marginLeft: "" }}>
							<InputText
								id="chargeNormal"
								name="chargeNormal"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.chargeNormal}
							/>
						</LabelledComponent>
					<LabelledComponent label="Charges for EV" style={{ marginTop: "10px", marginLeft: "10px" }}>
							<InputText
								id="chargelEV"
								name="chargeEV"
								type="text"
								autoComplete="nope"
								readOnly
								value={val.chargeEV}
							/>
						</LabelledComponent>
						</Flex></>)})}
				</>:<></>}    
				</DialogContent>
				<DialogActions className="pr-4">
					<Button text="Cancel" onClick={() => cancelView()} color='secondary' />
				</DialogActions>
			</Form>
		</Dialog>
	);
};
