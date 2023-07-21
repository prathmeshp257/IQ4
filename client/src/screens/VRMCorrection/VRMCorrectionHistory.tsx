import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { Flex, MultiSelect } from "../../components";
import { Formatter, DateUtils } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";


interface Props {
    sites: Array<any>;
    mainSite: Array<any>;
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

export const VRMCorrectionHistory: FC<Props> = ({ sites, mainSite }) => {
    const { userData } = useContext(AuthContext);
    const { sitesData } = useContext(SiteContext);
    const userType = userData.userType;

    const classes = useStyles();
    const [selectableSites, setSelectableSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : []);
    const [vrmCorrectionHistoryData, setVrmCorrectionHistoryData] = useState<any>({});
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [allSites, setAllSites] = useState<any>([]);




    useEffect(() => {
        if (mainSite && mainSite[0]) {
            setSelectedSites([...mainSite])
        }
    }, [mainSite])

    const getAllSites = async () => {
        try {
            const site = userData.sites;
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setAllSites(data);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }

    useEffect(() => {
        if (allSites && allSites.length > 0) {

            let vrmCorrectionaccessSites = allSites.filter((eachSite: any) => {
                return eachSite.vrmCorrectionAccess === true
            })

            let selectableSites = [] as any;
            for (const eachSite of vrmCorrectionaccessSites) {
                selectableSites.push(eachSite._id)
            }
            setSelectableSites(selectableSites);
            const localSelectedSite = localStorage.getItem('vrmCorrection-history-selected-site')

            if (localSelectedSite && selectableSites.includes(localSelectedSite)) {
                setSelectedSites([localSelectedSite])
            }
        }


    }, [allSites]);

    useEffect(() => {
        getAllSites()
        // nt-disable-next-line
    }, [sitesData, sites])

    const getVRMCorrectionHisoryData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/vrmCorrection/vrmCorrectionHistory?type=${userType}&email=${email}&site=${selectedSites[0]}`, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });

            setVrmCorrectionHistoryData(data);
            localStorage.setItem('vrmCorrection-history-selected-site', selectedSites[0])

        } catch (e) {
            console.log('error-VRM-correction-history', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };






    useEffect(() => {
        const getData = async () => {
            getVRMCorrectionHisoryData();
        }

        if (!loading && selectedSites[0]) {
            getData()
        }
        else {
            setVrmCorrectionHistoryData({});
        }

        // eslint-disable-next-line
    }, [selectedSites]);


    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap', marginBottom: '15px' }}>
                <h3 style={{ marginBottom: "15px" }}>
                    Last 30 Days VRM Correction History Of Site '{Formatter.capitalizeSites(selectedSites)}'
                </h3>
                <Flex wrap="wrap">

                    <MultiSelect
                        fullWidth={!!isMobile}
                        multi={false}
                        className="insights__refine-menu__multi-select"
                        options={selectableSites.map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                        values={selectedSites}
                        onChange={(values) => {
                            const normalizedSites = Formatter.normalizeSites(values) || [];
                            setSelectedSites(normalizedSites);
                        }}
                    />
                </Flex>
            </div>

            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Site</TableCell>
                                <TableCell>Camera Name</TableCell>
                                <TableCell>Old VRM</TableCell>
                                <TableCell>New VRM</TableCell>
                                <TableCell>VRM Prefix</TableCell>
                                <TableCell>Received Time</TableCell>
                                <TableCell>Corrected Time</TableCell>
                                <TableCell>Time Taken</TableCell>
                                <TableCell>Time Difference</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading ?
                                    <TableRow>
                                        <TableCell colSpan={9}>
                                            <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}> <ProgressBar /> </div>
                                        </TableCell>
                                    </TableRow>
                                    :

                                    vrmCorrectionHistoryData[selectedSites[0]] && vrmCorrectionHistoryData[selectedSites[0]]['data']
                                        .map((eachData: any, index: any) => {

                                            let seconds = 0;
                                            let minutes = 0;
                                            let hours = 0;
                                            if (eachData.vrmCorrectionTimeTaken < 60) {
                                                seconds = eachData.vrmCorrectionTimeTaken
                                            }
                                            if (eachData.vrmCorrectionTimeTaken > 60) {
                                                minutes = Math.floor(eachData.vrmCorrectionTimeTaken / 60);
                                                seconds = eachData.vrmCorrectionTimeTaken % 60;
                                                if (minutes > 60) {
                                                    hours = Math.floor(minutes / 60);
                                                    minutes = minutes % 60;
                                                }
                                            }

                                            return <TableRow>
                                                <TableCell>{Formatter.capitalizeSite(selectedSites[0])}</TableCell>
                                                <TableCell>{eachData.camera}</TableCell>
                                                <TableCell>{eachData.previousVrm ? eachData.previousVrm : "NA"}</TableCell>
                                                <TableCell>{eachData.vrm}</TableCell>
                                                <TableCell>{eachData.prefixVrm ? eachData.prefixVrm : "NA"}</TableCell>
                                                <TableCell>{eachData.prefixVrm ? "NA" : dayjs(eachData.when).tz("Europe/London").format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{eachData.prefixVrm ? "NA" : dayjs(eachData.correctedWhen).tz("Europe/London").format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{eachData.prefixVrm ? "NA" : `${hours}:${minutes}:${seconds}`}</TableCell>
                                                <TableCell>{eachData.prefixVrm ? "NA" : DateUtils.getTimeDifference(eachData.when, eachData.correctedWhen)}</TableCell>

                                            </TableRow>

                                        })
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment>
        </Paper>
    );
}