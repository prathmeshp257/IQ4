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
import { useSnackbar } from "notistack";
import TablePagination from '@material-ui/core/TablePagination';
import ProgressBar from "../Reports/ProgressBar";
import { TableFooter } from "@mui/material";
import NavigateBeforeIcon from '@material-ui/icons/NavigateNext';
import NavigateNextIcon from '@material-ui/icons/NavigateBefore';
import { Button, ButtonGroup } from "@material-ui/core";


interface Props {
    sites: Array<any>;
    mainSite: Array<any>;
    iqStatsActiveLabel: any;
    reloadData: boolean;
    setReloadData: any;
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

export const ApproxImageTable: FC<Props> = ({ sites, mainSite, iqStatsActiveLabel, reloadData, setReloadData }) => {
    const { userData } = useContext(AuthContext);
    const { sitesData } = useContext(SiteContext);
    const userType = userData.userType;
    const vrmValidator = userData.vrmValidator || "";
    const vrmValidatorSites = userData.vrmValidatorSites || "";
    const sessionApproxSite = localStorage.getItem("iqStats-approx-selected-site") || undefined;
    const today = dayjs().format('DD/MM/YYYY');
    const sessionApproxData = sessionStorage.getItem(`${today}-${sessionApproxSite}-iqStats-approx-data-0`) || undefined;
    const classes = useStyles();
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : sessionApproxSite ? [sessionApproxSite] : []);
    const [iqStatApproxData, setiqStatApproxData] = useState<any>(sessionApproxData ? JSON.parse(sessionApproxData) : {});
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [allSites, setAllSites] = useState<any>([]);
    let [date, setDate] = useState('')


    useEffect(() => {
        if (mainSite && mainSite[0]) {
            setSelectedSites([...mainSite])
        }
    }, [mainSite])

    useEffect(() => {
        if (userType !== "Admin" && userType) {
            let accessSites = sites;
            for (const eachSite of sites) {
                const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
                if (expired[0]) {
                    accessSites = accessSites.filter((val: any) => val !== eachSite);
                }
            }
            setAllSites(accessSites);
        }
        else if (userType === "Admin") {
            setAllSites(sites);
        }
        else {
            setAllSites([])
        }
        // eslint-disable-next-line
    }, [sitesData])

    const getApproxData = async (currPage: number) => {
        setLoading(true);
        try {
                const { data } = await axios.get(`/api/iqStats/approxData?userType=${userType}&email=${email}&site=${selectedSites[0]}&page=${currPage}&type=iqStatsApproxData`, {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });

                setiqStatApproxData(data);
                setDate(data.date)
                localStorage.setItem('iqStats-approx-selected-site', selectedSites[0])

        } catch (e) {
            console.log('error-iqstats-approx-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };

    const handleChangePage = async (newpage: any) => {
        let currPage = 0;
        if (newpage === "next") {
            currPage = page + 1;

        } else if (newpage === 'pre') {
            currPage = page - 1;
        }
        setDate('')
        setPage(currPage);
        getApproxData(currPage)
    };

    // const handleChangeRowsPerPage = async (event: any) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    //     getApproxData(0);
    // };

    useEffect(() => {
        const getData = async () => {
            setPage(0);
            getApproxData(0);
        }

        if (!loading && selectedSites[0]) {
            getData()
        }
        else {
            setiqStatApproxData({});
        }

        // eslint-disable-next-line
    }, [selectedSites]);

    useEffect(() => {
        const getData = async () => {
            setPage(0);
            getApproxData(0);
        }

        if (!loading && selectedSites[0] && iqStatsActiveLabel === "Approx Image" && reloadData) {
            getData()
            setReloadData(false)
        }
     

        // eslint-disable-next-line
    }, [reloadData]);



    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap', marginBottom: '15px' }}>
                <div>
                <h3 style={{ marginBottom: "15px" }}>
                    Approx Images Data Of Site '{Formatter.capitalizeSites(selectedSites)}'
                </h3>
                {date && <h4>{dayjs(date).format("DD MMMM")}</h4>}
                </div>
              
                <MultiSelect
                    fullWidth={!!isMobile}
                    multi={false}
                    className="insights__refine-menu__multi-select"
                    options={allSites.map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
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

                                        </React.Fragment>
                                        : ""
                                }

                                <TableCell>Plate Patch</TableCell>
                                <TableCell>Overview</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading ?
                                    <TableRow>
                                        <TableCell colSpan={(vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ? 11 : 7}>
                                            <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}> <ProgressBar /> </div>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    iqStatApproxData[selectedSites[0]] && iqStatApproxData[selectedSites[0]].approxData && iqStatApproxData[selectedSites[0]].approxData.length > 0 ? iqStatApproxData[selectedSites[0]].approxData 
                                        .map((eachData: any, index: any) => {
                                            return <> <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }}>
                                                <TableCell>{dayjs(eachData.entry).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell>IN</TableCell>
                                                <TableCell>{eachData.vrm}</TableCell>
                                                {
                                                    (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                        <React.Fragment>
                                                            <TableCell>{eachData.decode_in && eachData.decode_in.hasMOT ? eachData.decode_in.hasMOT.toString().toUpperCase() : 'NA'}</TableCell>

                                                        </React.Fragment>
                                                        : ""
                                                }

                                                <TableCell>
                                                    {
                                                        eachData.decode_in && eachData.decode_in.plate ?
                                                            <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.decode_in.plate}`} />
                                                            : "NA"
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        eachData.decode_in && eachData.decode_in.overview ?
                                                            <a target="_blank" rel="noreferrer" href={`${eachData.decode_in.overview}`}>Open Image</a>
                                                            : "NA"
                                                    }
                                                </TableCell>
                                            </TableRow>
                                                <TableRow style={{ backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' }}>
                                                    <TableCell>{dayjs(eachData.exit).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                                    <TableCell>OUT</TableCell>
                                                    <TableCell>{eachData.approximate}</TableCell>
                                                    {
                                                        (vrmValidator && vrmValidator && vrmValidatorSites && vrmValidatorSites.includes(selectedSites[0])) || userType === 'Admin' ?
                                                            <React.Fragment>
                                                                <TableCell>{eachData.decode_out && eachData.decode_out.hasMOT ? eachData.decode_out.hasMOT.toString().toUpperCase() : 'NA'}</TableCell>

                                                            </React.Fragment>
                                                            : ""
                                                    }

                                                    <TableCell>
                                                        {
                                                            eachData.decode_out && eachData.decode_out.plate ?
                                                                <img height={40} width={130} alt='Plate Patch' src={`data:image/png;base64,${eachData.decode_out.plate}`} />
                                                                : "NA"
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            eachData.decode_out && eachData.decode_out.overview ?
                                                                <a target="_blank" rel="noreferrer" href={`${eachData.decode_out.overview}`}>Open Image</a>
                                                                : "NA"
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            </>


                                        }) : (selectedSites && selectedSites[0]) &&  <TableRow>
                                        <TableCell colSpan={11} style={{ borderBottom: 'none' }}>
                                            <div style={{ textAlign: 'center', padding: 'auto' }}>No Record Found... </div>
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableFooter style={{ display: 'flex', justifyContent: 'end' }}>
                    <TableRow>
                        <TableCell style={{ borderBottom: 'none' }}><Button onClick={() => handleChangePage("pre")} disabled={page === 0 || loading ? true : false}><NavigateNextIcon /></Button></TableCell>
                        <TableCell style={{ borderBottom: 'none' }}><Button onClick={() => handleChangePage("next")} disabled={loading || selectedSites.length === 0} ><NavigateBeforeIcon /></Button></TableCell>
                    </TableRow>
                </TableFooter>
                {/* <TablePagination
                    component='div'
                    count={(iqStatApproxData[selectedSites[0]] && iqStatApproxData[selectedSites[0]].count) || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={loading ? { disabled: true } : undefined}
                    nextIconButtonProps={loading ? { disabled: true } : undefined}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage=''
                    rowsPerPageOptions={[]}
                /> */}
            </React.Fragment>
        </Paper>
    );
}