import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState, useContext } from "react";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { Formatter } from "../../utils";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { MultiSelect, Button, Flex } from "../../components";
import CSVIcon from "@material-ui/icons/Assessment";
import dayjs from "dayjs";
import ProgressBar from "../Reports/ProgressBar";


const useStyles = makeStyles({
	root: {
	  width: '100%',
	  padding: 0,
	  boxShadow: 'none'
	},
	container: {
	  minHeight: 200,
	  maxHeight: 400,
	  overFlowY: 'scroll'
	},
  });

export const VOIHistory: FC = () => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const classes = useStyles();
	const userLoginType = userData.userType;
    const today = dayjs().format('DD/MM/YYYY');
    const localSelectedSite = localStorage.getItem("voi-history-selected-site") || undefined;
    const localSelectedList = localStorage.getItem("voi-history-selected-list") || undefined;
    const sessionHistoricData = sessionStorage.getItem(`${today}-${localSelectedSite}-${localSelectedList}-voi-historic-data-0`) || undefined;
    const sessionHistoricDataCount = sessionStorage.getItem(`${today}-${localSelectedSite}-${localSelectedList}-voi-historic-data-count`) || undefined;
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
	const [voiLists, setVoiLists] = useState<any>({});
	const [selectedVoiList, setSelectedVoiList] = useState<any>(localSelectedList ? [localSelectedList] : []);
	const [selectedSites, setSelectedSites] = useState<any>(localSelectedSite ? [localSelectedSite] : []);
	const [historicData, setHistoricData] = useState<any>(sessionHistoricData ? JSON.parse(sessionHistoricData): []);
    const [count, setCount] = useState(Number(sessionHistoricDataCount) ? Number(sessionHistoricDataCount) : 0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
	const [uniqVoiSites, setUniqVoiSites] = useState<any>([]);
	const { sites } = useContext(UserContext);
	const insightAccess = userData.insightAccess;
	const insightAccessSites = userData.insightAccessSites || [];
	const voiSettingSites = userData.voiSettingAccessSites || undefined;
	const voiViewOnlyAccessSites = userData.voiViewOnlyAccessSites || [];
	const voiSettingAccessSites = (userLoginType === "Retailer" || userLoginType === "Operator") && voiSettingSites ? voiSettingSites : userLoginType === "Admin" ? sites : [];
	const allVoiSites = voiViewOnlyAccessSites.concat(voiSettingAccessSites);
	const allUniqVoiSites = allVoiSites.filter((val: any, pos: any) => allVoiSites.indexOf(val) === pos);

	useEffect(() => {
		if(userLoginType !== "Admin" && allUniqVoiSites){
			let accessSites = allUniqVoiSites;
			for(const eachSite of allUniqVoiSites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setUniqVoiSites(accessSites);
		}
		else if(userLoginType === "Admin"){
			setUniqVoiSites(sites);
		}
		else{
			setUniqVoiSites([])
		}
		// eslint-disable-next-line
	},[sitesData])

	useEffect(() => {
		const getListsBySite = async () => {
			setLoading(true);
			try {
				const {data} = await axios.get(`/api/voi/bySites?sites=${(Formatter.normalizeSites(uniqVoiSites)).join(',')}&userType=${userLoginType}&email=${userData.email}`, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				});
				
				setVoiLists(data);
			} catch (e) {
				enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
			}
			setLoading(false);
		};

		getListsBySite()

		// eslint-disable-next-line
	}, [uniqVoiSites]);

	const getHistoricData = async(currPage:number) => {
		setLoading(true);
		try {
			const sessionHistoricData = sessionStorage.getItem(`${today}-${selectedSites[0]}-${selectedVoiList[0]}-voi-historic-data-${currPage}`) || undefined;
			const sessionHistoricDataCount = sessionStorage.getItem(`${today}-${selectedSites[0]}-${selectedVoiList[0]}-voi-historic-data-count`) || undefined;
			if(sessionHistoricData && Number(sessionHistoricDataCount)){
                setHistoricData(JSON.parse(sessionHistoricData));
                setCount(Number(sessionHistoricDataCount));
                localStorage.setItem('voi-history-selected-site', selectedSites[0]);
                localStorage.setItem('voi-history-selected-list', selectedVoiList[0]);
			}
			else{
				const {data} = await axios.post(`/api/voi/historic`,{site:selectedSites[0],listName:selectedVoiList,page:currPage,perPage:rowsPerPage,userType: userLoginType,email:userData.email}, {
					headers: { authorization: "Bearer " + localStorage.getItem("token") }
				})
				
				setHistoricData(data ? data.historicData : []);
				setCount(data ? Number(data.count || 0) : 0)
                localStorage.setItem('voi-history-selected-site', selectedSites[0]);
                localStorage.setItem('voi-history-selected-list', selectedVoiList[0]);
                sessionStorage.setItem(`${today}-${selectedSites[0]}-${selectedVoiList[0]}-voi-historic-data-${currPage}`, JSON.stringify(data ? data.historicData : []))
                sessionStorage.setItem(`${today}-${selectedSites[0]}-${selectedVoiList[0]}-voi-historic-data-count`, (data && Number(data.count) ? data.count : '0'))
			}
		} catch (e) {
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		setLoading(false);
	}

	const handleApplySearch = () => {
		setPage(0);
		setRowsPerPage(50);
		getHistoricData(0);
	};
    
    const handleChangePage = async(event:any, newPage:number) => {
        setPage(newPage);
        getHistoricData(newPage);
    };

    const handleChangeRowsPerPage = async(event:any) => {
		setRowsPerPage(parseInt(event.target.value, 50));
		setPage(0);
		getHistoricData(0);
    };

	return (
	<React.Fragment>
		<Paper className={classes.root}>
			<h1 style={{display:'inline-block'}}>{ selectedSites[0] && selectedVoiList[0] ? `${Formatter.capitalizeSite(selectedSites[0])}` : ""}</h1>
			<Flex style={{float:'right', marginBottom:'20px'}}>
				<MultiSelect
					disabled={ loading }
					multi={false}
					style={{width:"200px", height:'40px', marginRight:'4px',}}
					options={uniqVoiSites.map((site:string) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) }))}
					values={selectedSites}
					onChange={async(values) => {
						const normalizedSites = Formatter.normalizeSites(values);
						setHistoricData([]);
						setCount(0);
						setSelectedVoiList([]);
						setSelectedSites(normalizedSites);
					}}
				/>
				<MultiSelect
					disabled={ loading || !selectedSites[0] }
					multi={true}
					placeholder='Please select VOI list'
					style={{width:"200px", height:'40px', marginRight:'14px',}}
					options={
						voiLists[selectedSites[0]] && voiLists[selectedSites[0]].length > 0 ? 
							voiLists[selectedSites[0]].map((list:any) => ({ value: list.listName, label: list.listName }))
						: []
					}
					values={selectedVoiList}
					onChange={async(values) => {
						setHistoricData([]);
						setCount(0);
						setSelectedVoiList(values);
					}}
				/>
				<Button 
					text='Search' 
					fullWidth={false} 
					disabled={!selectedSites[0] || !selectedVoiList[0] || downloadingCSV}
					loading={loading}
					buttonStyle={{ marginLeft:'5px', height:'40px'}} 
					onClick={ () => handleApplySearch() }
				/>
				<Button 
					text='CSV' 
					loading={downloadingCSV}
					disabled={!selectedSites[0] || !selectedVoiList[0] || loading}
					icon={<CSVIcon />}
					buttonStyle={{ marginLeft:'5px', minWidth: 80, maxWidth: 80, height:'40px' }} 
					onClick={async () => {
						const insightsData = (userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites.includes(selectedSites))) ? "true" : "false"
						setDownloadingCSV(true);
						try {
							const response = await axios.post(
								`/api/voi/historic`,{site:selectedSites[0],listName:selectedVoiList,insightsData:insightsData,responseType:"csv",userType:userLoginType,email:userData.email},
								{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
							);

							const url = window.URL.createObjectURL(new Blob([response.data]));
							const link = document.createElement("a");
							link.href = url;
							link.setAttribute("download", `VOI_History_${dayjs().format("DD_MM_YYYY")}.zip`);
							document.body.appendChild(link);
							link.click();
						} catch (e) {}
						setDownloadingCSV(false);
					}}
				/>
			</Flex>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell>VRM</TableCell>
							{
								(userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites.includes(selectedSites))) ?
									<React.Fragment>
										<TableCell>Make</TableCell>
										<TableCell>Model</TableCell>
										<TableCell>Colour</TableCell>
										<TableCell>Year</TableCell>
										<TableCell>Fuel Type</TableCell>
									</React.Fragment>
								: ""
							}
							<TableCell>Entry Time</TableCell>
							<TableCell>Exit Time</TableCell>
							<TableCell>Duration(Min)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							loading ? 
								<TableCell colSpan={9}>
										<div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> 
										<ProgressBar />
										 </div>
								</TableCell>
							: 
							historicData && historicData.length > 0 && historicData.map((eachData:any) => {
								return (
									<TableRow>
										<TableCell>{eachData.vrm}</TableCell>
										{
											(userLoginType === "Admin" || ((userLoginType === "Retailer" || userLoginType === "Operator") && insightAccess && insightAccessSites.length > 0 && insightAccessSites.includes(selectedSites))) ?
												<React.Fragment>
													<TableCell>{eachData.make || 'NA'}</TableCell>
													<TableCell>{eachData.model || 'NA'}</TableCell>
													<TableCell>{eachData.color || "NA"}</TableCell>
													<TableCell>{eachData.year || "NA"}</TableCell>
													<TableCell>{eachData.fuelType || "NA"}</TableCell>
												</React.Fragment>
											: ""
										}
										<TableCell>{dayjs(eachData.when).format('DD/MM/YY HH:mm:ss')}</TableCell>
										<TableCell>{eachData.exit ? dayjs(eachData.exit).format('DD/MM/YY HH:mm:ss') : "NA"}</TableCell>
										<TableCell>{eachData.duration ? eachData.duration : eachData.duration === 0 ? 0 : "NA"}</TableCell>
									</TableRow>
								)
							})
						}
					</TableBody>
				</Table>
			</TableContainer>
            <TablePagination
                component='div'
                count={count || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={loading ? {disabled:true} : undefined}
                nextIconButtonProps={loading ? {disabled:true} : undefined}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage=''
                rowsPerPageOptions={[]}
            />
		</Paper>
	</React.Fragment>
	);
};
