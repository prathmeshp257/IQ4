import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Flex, SystemHealthRow, MultiSelect, Button } from "../../components";
import { Divider } from "../../components/Divider";
import { LabelledComponent } from "../../components/LabelledComponent";

import { VrmDataTable } from "./VrmDataTable";
import { DataTable } from "../../components";

interface Props {
	isContainerColMode: boolean;
}

export const SystemHealth: FC <Props> = ({isContainerColMode}) => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [systemHealth, setSystemHealth] = useState<any>({});
	const [userLoginData, setUserLoginData] = useState<any>([]);
	const [filterData, setFilterData] = useState<any>([]);
	const [selectedUserType, setSelectedUserType] = useState<any>([]);
	const [selectedEmail, setSelectedEmail] = useState<any>([]);
	const [selectedName, setSelectedName] = useState<any>([]);
	const [names, setNames] = useState<any>([]);
	const [emails, setEmails] = useState<any>([]);
	const [loadingLoginData, setLoadingLoginData] = useState(false);

	const getData = async () => {
		setLoading(true);
		try {
			const {data} = await axios.get(`/api/systemHealth`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setSystemHealth(data);
		} catch (e) {
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false);
	};

	const getUserLoginData = async () => {
		setLoadingLoginData(true);
		try {
			const {data} = await axios.get(`/api/systemHealth/loginData?type=${selectedUserType[0] || ''}&email=${selectedEmail[0] || ''}&name=${selectedName[0] || ''}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setUserLoginData(data.LoginData);
		} catch (e) {
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoadingLoginData(false);
	};

	const getFilterData = async () => {
		setLoading(true);
		try {
			const {data} = await axios.get(`/api/systemHealth/filterData`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			setFilterData(data);
		} catch (e) {
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false);
	};

	useEffect(() => {
		getUserLoginData();
		getData();
		getFilterData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if(selectedUserType && selectedUserType[0] === 'Admin' && filterData && filterData.adminData){
			setEmails(filterData.adminData.map((val: any) => val.email))
			setNames(filterData.adminData.map((val: any) => val.firstName + " " + val.lastName))
		}
		if(selectedUserType && selectedUserType[0] === 'Operator' && filterData && filterData.operatorData){
			setEmails(filterData.operatorData.map((val: any) => val.email))
			setNames(filterData.operatorData.map((val: any) => val.firstName + " " + val.lastName))
		}
		if(selectedUserType && selectedUserType[0] === 'Retailer' && filterData && filterData.retailerData){
			setEmails(filterData.retailerData.map((val: any) => val.email))
			setNames(filterData.retailerData.map((val: any) => val.firstName + " " + val.lastName))
		}
		if(selectedUserType && selectedUserType[0] === 'Customer' && filterData && filterData.customerData){
			setEmails(filterData.customerData.map((val: any) => val.email))
			setNames(filterData.customerData.map((val: any) => val.firstName + " " + val.lastName))
		}
		// eslint-disable-next-line
	},[selectedUserType])

	return (
		<>
			<div className={ isContainerColMode ? "systemHealth__container-mode-col" : "systemHealth__container-mode-row"}>
				<SystemHealthRow
					className={ isContainerColMode ? "systemHealth__container-mode-col__card" : "systemHealth__container-mode-row__card"}
					key="mot-data"
					title="MMC Data"
					data={systemHealth || {}}
					type="mot"
				/>
				<SystemHealthRow
					className={ isContainerColMode ? "systemHealth__container-mode-col__card" : "systemHealth__container-mode-row__card"}
					key="co2-data"
					title="CO2 Data"
					data={systemHealth || {}}
					type="co2"
				/>
			</div>
			<Divider />
			<VrmDataTable data={systemHealth?.history || []} count={systemHealth?.vrmCount || 0} loading={loading} notRequested={systemHealth?.not_requested || 0} />
			<Divider />	
			<DataTable 
				title="User's Login Details" 
				columns={["Email", "Type", "Name", "Login Time", "Logout Time", "Postal", "City", "Country", "Org"]} 
				data={userLoginData ? userLoginData : []} 
				loading={loadingLoginData} 
				pagination={false}
				filters={
					<Flex justify="space-between">
						<LabelledComponent label="Type">
							<MultiSelect
								fullWidth={!!isMobile}
								multi={false}
								className="insights__refine-menu__multi-select"
								style={{marginRight:'20px'}}
								options={['Admin','Operator', 'Retailer', 'Customer'].map((type: any) => ({ value: type, label: type })) }
								values={selectedUserType}
								placeholder="Please select user type"
								onChange={(values) => {
									setSelectedName([]);
									setSelectedEmail([]);
									setSelectedUserType(values)
								}}
							/>
						</LabelledComponent>
						<LabelledComponent label="Email">
							<MultiSelect
								fullWidth={!!isMobile}
								multi={false}
								disabled={!selectedUserType[0] || selectedName[0]}
								className="insights__refine-menu__multi-select"
								style={{marginRight:'20px'}}
								placeholder="Please select email"
								options={emails.map((val: any) => ({ value: val, label: val })) }
								values={selectedEmail}
								onChange={(values) => {
									setSelectedName([]);
									setSelectedEmail(values);
								}}
							/>
						</LabelledComponent>
						<LabelledComponent label="Name">
							<MultiSelect
								fullWidth={!!isMobile}
								placeholder="Please select user name"
								disabled={!selectedUserType[0] || selectedEmail[0]}
								multi={false}
								style={{marginRight:'20px'}}
								className="insights__refine-menu__multi-select"
								options={names.map((val: any) => ({ value: val, label: val })) }
								values={selectedName}
								onChange={(values) => {
									setSelectedEmail([]);
									setSelectedName(values);
								}}
							/>
						</LabelledComponent>
						<LabelledComponent className="dashboard__refine-menu__search" label="Actions">
							<Button
								text="Search"
								onClick={getUserLoginData}
								loading={loading}
								disabled={!selectedUserType[0]}
								buttonStyle={{ display: "inline-block",marginRight: 8, minWidth: 80,  maxWidth: 80}}
							/>
							<Button
								text="Reset"
								buttonStyle={{ display: "inline-block",marginRight: 8, minWidth: 80,  maxWidth: 80 }}
								onClick={() => {
									setSelectedUserType([]);
									setSelectedName([]);
									setSelectedEmail([]);
									getUserLoginData();
								}}
							/>
						</LabelledComponent>
					</Flex>
				}
			/>
		</>
	);
};
