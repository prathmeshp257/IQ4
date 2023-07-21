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
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";



interface Props {
    open: any;
    onClose: any;
    viewData: any;
    title: any
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

export const ViewRevenue: FC<Props> = ({ open, onClose , viewData ,title}) => {
    const [tariffLists, setTariffLists] = useState<any>({});
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={() => onClose()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={'sm'}>
            <Form >
                <DialogTitle>
                      {title}
                </DialogTitle>
                <DialogContent>

                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="Date" style={{ width: "250px" }}>
                            <p>{viewData.dateRange}</p>
                        </LabelledComponent>
                        <LabelledComponent label="No. Of Vehicle Entered / Exited" style={{ width: "250px"}}>
                            <p>{viewData.ins} / {viewData.outs}</p>
                        </LabelledComponent>
                    </Flex>

                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of Gasoline Vehicles (< Grace Period) " style={{ width: "250px" }}>
                            <p>{viewData.otherVehicleGraceCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for Gasoline Vehicles (< Grace Period) " style={{ width: "250px" }}>
                            <p>{viewData && viewData.otherVehicleGraceAmount ? `£ ${viewData.otherVehicleGraceAmount}` : `£ ${0}`}</p>
                        </LabelledComponent>
                    </Flex><Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of EV Vehicles (< Grace Period) " style={{ width: "250px" }}>
                            <p>{viewData.evVehicleGraceCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for EV Vehicles (< Grace Period) " style={{ width: "250px" }}>
                            <p>{viewData && viewData.evVehicleGraceAmount ? `£ ${viewData.evVehicleGraceAmount}` : `£ ${0}`}</p>
                        </LabelledComponent>
                    </Flex>

                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of Gasoline Vehicles (Free >) " style={{ width: "250px" }}>
                            <p>{viewData.otherFreeVehicleCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for Gasoline Vehicles (Free >)" style={{ width: "250px" }}>
                            <p>£ {viewData.otherFreeVehicleAmount}</p>
                        </LabelledComponent>
                    </Flex>
                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of EV Vehicles (Free >)" style={{ width: "250px" }}>
                            <p>{viewData.freeEvVehicleCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for EV Vehicles (Free >)" style={{ width: "250px" }}>
                            <p>£ {viewData.freeEvVehicleAmount}</p>
                        </LabelledComponent>
                    </Flex>

                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of Gasoline Vehicles (NO RETURN)" style={{ width: "250px" }}>
                            <p>{viewData.otherVehicleWithinNoReturnCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for Gasoline Vehicles (NO RETURN)" style={{ width: "250px" }}>
                            <p>£ {viewData.otherVehicleWithinNoReturnAmount}</p>
                        </LabelledComponent>
                    </Flex>
                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of EV Vehicles (NO RETURN)" style={{ width: "250px" }}>
                            <p>{viewData.evVehiclehicleWithinNoReturnCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for EV Vehicles (NO RETURN)" style={{ width: "250px" }}>
                            <p>£ {viewData.evVehiclehicleWithinNoReturnAmount}</p>
                        </LabelledComponent>
                    </Flex>

                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of Gasoline Vehicles " style={{ width: "250px" }}>
                            <p>{viewData.totalOtherVehicleCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for Gasoline Vehicles" style={{ width: "250px" }}>
                            <p>£ {viewData.totalOtherVehicleAmount}</p>
                        </LabelledComponent>
                    </Flex>
                    <Flex style = {{gap:"40px"}}>
                        <LabelledComponent label="No. of EV Vehicles" style={{ width: "250px" }}>
                            <p>{viewData.totalEvVehicleCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for EV Vehicles" style={{ width: "250px" }}>
                            <p>£ {viewData.totalEvVehicleAmount}</p>
                        </LabelledComponent>
                    </Flex>
                    
                    
                    <Flex style = {{gap:"40px"}}>
                    <LabelledComponent label="No. of Gasoline Vehicles (Overnight)" style={{ width: "250px" }}>
                            <p>{viewData.overnightOtherVehicleCount}</p>
                        </LabelledComponent>
                    <LabelledComponent label="Revenue for EV vehicles (Overnight)" style={{ width: "250px" }}>
                            <p>{viewData && viewData.overnightEvVehicleAmount ? viewData.overnightEvVehicleAmount : "Not Available"}</p>
                        </LabelledComponent>
                    </Flex>


                    <Flex style = {{gap:"40px"}}>
                    <LabelledComponent label="No. of EV vehicles (Overnight)" style={{ width: "250px" }}>
                            <p>{viewData.overnightEvVehicleCount}</p>
                        </LabelledComponent>
                        <LabelledComponent label="Revenue for Gasoline Vehicles (Overnight)" style={{ width: "250px" }}>
                            <p>{viewData && viewData.overnightOtherVehicleAmount ? viewData.overnightOtherVehicleAmount : "Not Available"}</p>
                        </LabelledComponent>
                    </Flex>
                    
                    <LabelledComponent label="No. of Vehicles (Season Pass)" style={{ width: "250px" }}>
                        <p>{viewData.vrmWithSeasonPass}</p>
                    </LabelledComponent>
                    {/* <Table>
      <TableHead>
        <TableRow>
          <TableCell  />
          <TableCell >6 - 12</TableCell>
          <TableCell >12 - 22</TableCell>
          <TableCell >22 - 24</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell >Date</TableCell>
          <TableCell >Data 1</TableCell>
          <TableCell >Data 2</TableCell>
          <TableCell >Data 3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell >No. Of Vehicle Entered</TableCell>
          <TableCell >Data 1</TableCell>
          <TableCell >Data 2</TableCell>
          <TableCell >Data 3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell >No. of vehicles exited</TableCell>
          <TableCell >Data 1</TableCell>
          <TableCell >Data 2</TableCell>
          <TableCell >Data 3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell >No. of vehicle inside this tariff</TableCell>
          <TableCell >Data 1</TableCell>
          <TableCell >Data 2</TableCell>
          <TableCell >Data 3</TableCell>
        </TableRow>
     </TableBody>
     </Table> */}
                </DialogContent>
                <DialogActions className="pr-4">
                    <Button text="Cancel" onClick={() => { onClose() }} color='secondary' />
                </DialogActions>
            </Form>
        </Dialog>
    );
};
