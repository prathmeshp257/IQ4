import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { MultiSelect, Flex, Button } from "../../components";
import { Formatter } from "../../utils";
import { AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { DataTable } from "../../components";
import CSVIcon from "@material-ui/icons/Assessment";

interface Props {
    sites:Array<any>;
    mainSite: Array<any>;
    iqStatsActiveLabel:any;
	reloadData:boolean;
	setReloadData:any;
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 200,
        maxHeight: 400,
        overFlowY: 'scroll'
    },
});

export const MatchRate: FC<Props> = ({sites, mainSite,reloadData,iqStatsActiveLabel,setReloadData}) => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
    const classes = useStyles();
	const userType = userData.userType;
    const localSelectedSite = localStorage.getItem('iqStats-match-alert-selected-site')
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
	const [allSites, setAllSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : localSelectedSite ? [localSelectedSite] : []);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
    const [matchAlertData, setMatchAlertData] = useState<any>({});
    const [tableData, setTableData] = useState<any>([]);
    const rowsPerPage = 50;

    useEffect(() => {
        if(mainSite && mainSite[0]){
            setSelectedSites([...mainSite])
        }
    },[mainSite])

	useEffect(() => {
		if(userType !== "Admin" && userType){
			let accessSites = sites;
			for(const eachSite of sites){
				const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
				if(expired[0]){
					accessSites = accessSites.filter((val:any) => val !== eachSite);
				}
			}
			setAllSites(accessSites);
		}
		else if(userType === "Admin"){
			setAllSites(sites);
		}
		else{
			setAllSites([])
		}
		// eslint-disable-next-line
	},[sitesData])

    const getMatchAlertData = async (currPage:number) => {
        setLoading(true);
        try {
            const today = dayjs().format('DD-MM-YYYY');
            const sessionMatchAlertData = sessionStorage.getItem(`${today}-${selectedSites[0]}-iqStats-match-alert-data-${currPage}`);
            if(sessionMatchAlertData){
                setMatchAlertData(JSON.parse(sessionMatchAlertData));
                localStorage.setItem('iqStats-match-alert-selected-site', selectedSites[0])
            }
            else{
                const {data} = await axios.get(`/api/iqStats/matchAlert?site=${selectedSites[0]}&page=${currPage}&perPage=${rowsPerPage}&userType=${userType}&email=${userData.email}`, {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });
                setMatchAlertData(data);
                localStorage.setItem('iqStats-match-alert-selected-site', selectedSites[0])
                sessionStorage.setItem(`${today}-${selectedSites[0]}-iqStats-match-alert-data-${currPage}`, JSON.stringify(data))
            }
        } catch (e) {
            console.log('error-iqstats-match-alert-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };
    
    const handleChangePage = async(newPage:number) => {
        setPage(newPage);
        getMatchAlertData(newPage);
    };

    useEffect(() => {
        if(selectedSites[0]){
            setPage(0);
            getMatchAlertData(0);
        }
        else{
            setMatchAlertData({});
        }
        // eslint-disable-next-line
    }, [selectedSites]);

    useEffect(() => {
        if(selectedSites[0] && iqStatsActiveLabel === "Match Rate Alert" && reloadData){
            setPage(0);
            getMatchAlertData(0);
            setReloadData(false)
        }
     
        // eslint-disable-next-line
    }, [reloadData]);



    useEffect(() => {
        let arrData = [];
        if(matchAlertData && matchAlertData.data){
            for(const eachData of matchAlertData.data){
                if(eachData){
                    arrData.push({
                        "Site": eachData.Site, 
                        "Date/Time": eachData['Date/Time'], 
                        "One": eachData['Exact(%)'], 
                        "Two": eachData['Exact+Cluster(%)'], 
                        "Three": eachData['Exact+Cluster+Approx(%)'], 
                        "One Threshold": eachData['Exact Threshold(%)'], 
                        "Two Threshold": eachData['Exact+Cluster Threshold(%)'], 
                        "Three Threshold": eachData['Exact+Cluster+Approx Threshold(%)'], 
                    })
                }
            }
        }
        setTableData(arrData);
        // eslint-disable-next-line
    }, [matchAlertData]);

	const createDownloadLink = (data: any, fileName: string) => {
		let link = document.createElement("a");
		let url = window.URL.createObjectURL(new Blob([data]));
		link.href = url;
		link.setAttribute("download", `${fileName}_${dayjs().format("DD_MM_YYYY")}.zip`);
		document.body.appendChild(link);
		link.click();
	}

	const downloadCSV = async () => {
		setDownloadingCSV(true);
		try {
			const { data: matchAlertCSVData } = await axios.get(
				`/api/iqStats/matchAlert?site=${selectedSites[0]}&page=${page}&perPage=${rowsPerPage}&userType=${userType}&responseType=csv&email=${userData.email}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(matchAlertCSVData, "time_sync_data");
		} catch (e) {
			console.log("Error download csv time sync: \n", e)
		}
		setDownloadingCSV(false);
	}

    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{float:'right', marginBottom:'15px'}}>
                <Flex>
                    <MultiSelect
                        fullWidth={!!isMobile}
                        style={{marginRight: 10}}
                        multi={false}
                        className="insights__refine-menu__multi-select"
                        options={allSites.map((site:any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                        values={selectedSites}
                        onChange={(values) => {
                            const normalizedSites = Formatter.normalizeSites(values) || [];
                            setSelectedSites(normalizedSites);
                        }}
                    />
                    <Button
                        text="CSV"
                        variant="filled"
                        disabled={selectedSites.length === 0}
                        icon={<CSVIcon />}
                        loading={downloadingCSV}
                        buttonStyle={{ marginRight: 8, minWidth: 80, maxWidth: 80 }}
                        onClick={downloadCSV}
                    />
                </Flex>
            </div>
            <h3 style={{marginBottom:"15px", marginTop:'15px'}}>
                Last 30 Days Match Rate Alerts Data Of Site '{Formatter.capitalizeSite(selectedSites[0])}'
            </h3>
			<DataTable 
                subTitle="One = Exact, Two = Exact + Cluster, Three = Exact + Cluster + Approx"
				columns={["Site", "Date/Time", "One", "Two", "Three", "One Threshold", "Two Threshold", "Three Threshold"]} 
				data={tableData || []} 
				loading={loading} 
				pagination={true} 
				count={matchAlertData.count || 0} 
				handleChangePage={async(page:any) => await handleChangePage(page)} 
				page={page} 
				rowsPerPage={rowsPerPage} 
			/>
        </Paper>
    );
}