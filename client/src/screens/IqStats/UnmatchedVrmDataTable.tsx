import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import axios from "axios";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import ProgressBar from "../../screens/Reports/ProgressBar";
import { useSnackbar } from "notistack";
import TablePagination from '@material-ui/core/TablePagination';

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

export const UnmatchedVrmDataTable: FC<Props> = ({sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData}) => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
	const userType = userData.userType;
    const vrmValidator = userData.vrmValidator || "";
    const vrmValidatorSites = userData.vrmValidatorSites || "";
    const sessionUnmatchedSite = localStorage.getItem("iqStats-unmatched-selected-site") || undefined;
    const today = dayjs().format('DD/MM/YYYY');
    const sessionUnmatchedData = sessionStorage.getItem(`${today}-${sessionUnmatchedSite}-iqStats-unmatched-data-0`) || undefined;
    const classes = useStyles();
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : sessionUnmatchedSite ? [sessionUnmatchedSite] : []);
    const [iqStatsUnmatchedData, setiqStatsUnmatchedData] = useState<any>(sessionUnmatchedData ? JSON.parse(sessionUnmatchedData) : {});
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
	const [allSites, setAllSites] = useState<any>([]);

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

    const getUnmatchedData = async (currPage:number) => {
        setLoading(true);
        try {
            const sessionUnmatchedData = sessionStorage.getItem(`${today}-${selectedSites[0]}-iqStats-unmatched-data-${currPage}`);
            if(sessionUnmatchedData){
                setiqStatsUnmatchedData(JSON.parse(sessionUnmatchedData));
                localStorage.setItem('iqStats-unmatched-selected-site', selectedSites[0])
            }
            else{
                const {data} = await axios.get(`/api/iqStats/unmatchedData?type=${userType}&email=${email}&site=${selectedSites[0]}&page=${currPage}&perPage=${rowsPerPage}`, {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });
                setiqStatsUnmatchedData(data);
                localStorage.setItem('iqStats-unmatched-selected-site', selectedSites[0])
                sessionStorage.setItem(`${today}-${selectedSites[0]}-iqStats-unmatched-data-${currPage}`, JSON.stringify(data))
            }
        } catch (e) {
            console.log('error-iqstats-unmatched-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };
    
    const handleChangePage = async(event:any, newPage:number) => {
        setPage(newPage);
        getUnmatchedData(newPage);
    };

    const handleChangeRowsPerPage = async(event:any) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
      getUnmatchedData(0);
    };

    useEffect(() => {
        const getData = async() =>{
            setPage(0);
            getUnmatchedData(0);
        }

        if(!loading && selectedSites[0]){
            getData()
        }
        else{
            setiqStatsUnmatchedData({});
        }

        // eslint-disable-next-line
    }, [selectedSites]);

    useEffect(() => {
        const getData = async() =>{
            setPage(0);
            getUnmatchedData(0);
        }

        if(!loading && selectedSites[0] && iqStatsActiveLabel==="Unmatched VRM Data" && reloadData){
            getData()
            setReloadData(false)
        }
       

        // eslint-disable-next-line
    }, [reloadData]);

 

    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{display:"flex",justifyContent:"space-between", flexWrap:'wrap',marginBottom:'15px'}}>
            <h3 style={{marginBottom:"15px"}}>
                Last 30 Days Unmatched VRM Data Of Site '{Formatter.capitalizeSites(selectedSites)}'
            </h3>
                <MultiSelect
                fullWidth={!!isMobile}
                multi={false}
                className="insights__refine-menu__multi-select"
                options={allSites.map((site:any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                values={selectedSites}
                onChange={(values) => {
                    const normalizedSites = Formatter.normalizeSites(values) || [];
                    setSelectedSites(normalizedSites);
                }}
                />
            </div>
           
            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date/Time</TableCell>
                                <TableCell>Direction</TableCell>
                                <TableCell>VRM</TableCell>
                                {
                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ? 
                                        <React.Fragment>
                                            <TableCell>VRM Valid</TableCell>
                                            <TableCell>Make</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Colour</TableCell>
                                        </React.Fragment>
                                    :""
                                }
                                <TableCell>30 Days IN/OUT</TableCell>
                                <TableCell>Orphan IN/OUT</TableCell>
                                <TableCell>Plate Patch</TableCell>
                                <TableCell>Overview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                            loading ? 
                                <TableRow>
                                    <TableCell colSpan={(vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ? 11 : 7}>
                                        <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar /> </div>
                                    </TableCell>
                                </TableRow>
                            :
                            iqStatsUnmatchedData[selectedSites[0]] && iqStatsUnmatchedData[selectedSites[0]].unmatchedData
                            .map((eachData:any) => {
                                return <TableRow>
                                    <TableCell>{dayjs(eachData.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                    <TableCell>{eachData.direction}</TableCell>
                                    <TableCell>{eachData.vrm}</TableCell>
                                    {
                                        (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ? 
                                            <React.Fragment>
                                                <TableCell>{eachData.hasMOT ? 'TRUE' : 'FALSE'}</TableCell>
                                                <TableCell>{eachData.make || 'NA'}</TableCell>
                                                <TableCell>{eachData.model || 'NA'}</TableCell>
                                                <TableCell>{eachData.color || 'NA'}</TableCell>
                                            </React.Fragment>
                                        :""
                                    }
                                    <TableCell>{eachData.in + "/" + eachData.out}</TableCell>
                                    <TableCell>
                                        { eachData.orphanIn + "/" + eachData.orphanOut }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            eachData.plate ?
                                                <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.plate}`} />
                                            : "NA"
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            eachData.overview ?
                                                <a target="_blank" rel="noreferrer" href={`${eachData.overview}`}>Open Image</a>
                                            : "NA"
                                        }
                                    </TableCell>
                                </TableRow>
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component='div'
                    count={(iqStatsUnmatchedData[selectedSites[0]] && iqStatsUnmatchedData[selectedSites[0]].count) || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={loading ? {disabled:true} : undefined}
                    nextIconButtonProps={loading ? {disabled:true} : undefined}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage=''
                    rowsPerPageOptions={[]}
                />
            </React.Fragment>
        </Paper>
    );
}