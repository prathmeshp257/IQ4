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
import { MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { UserContext, AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";
import SendIcon from '@material-ui/icons/Send';
import Button from "@material-ui/core/Button";


interface Props {
    sites: Array<any>;

}

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    container: {
        overflowY: 'scroll',
        height: '60vh'

    },
});

export const ForwardHistory: FC<Props> = ({ sites }) => {
    const { userData } = useContext(AuthContext);
    const { sitesData } = useContext(SiteContext);
    const userType = userData.userType;
    const vrmValidator = userData.vrmValidator || "";
    const vrmValidatorSites = userData.vrmValidatorSites || "";
    const today = dayjs().format('DD/MM/YYYY');
    const classes = useStyles();
    const localSelectedSite = localStorage.getItem('admin-correctedVRM-selected-site')
    const [selectedSites, setSelectedSites] = useState<any>(localSelectedSite ? [localSelectedSite] : []);
    const [forwardsData, setForwardsData] = useState<any>([]);
    const { email } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [allSites, setAllSites] = useState<any>([]);
    const localSortType = localStorage.getItem("vrmCorrectionHistory-sortType");
    const localSelectedSortType= localSortType ? [localSortType] : ["All"];
    const [sortType,setSortType] = useState<string[]>(localSelectedSortType);
    const [filterStatus,setFilterStatus] = useState<number>(0);





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

    const filterData = forwardsData.filter((eachData:any)=>{
        if(filterStatus === 0){
            return eachData
        }else if(filterStatus === 200 &&  eachData.status ===200){
            return eachData
        }else if(filterStatus === 400 &&  eachData.status !==200 ){
            return eachData
        }
    })

    const getForwardsData = async () => {
        setLoading(true);
        try {

            const { data } = await axios.get(`/api/sites/correctedVrmList?type=${userType}&email=${email}&site=${selectedSites[0]}`,
                {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });

            setForwardsData(data.data);
            localStorage.setItem('admin-correctedVRM-selected-site', selectedSites[0])

        } catch (e) {
            console.log('error-forward history-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);

    };

    const handleChangePage = async (event: any, newPage: number) => {
        setPage(newPage);
        //getForwardsData();
    };
    useEffect(() => {
        if (selectedSites[0]) {
            getForwardsData()
        }
    }, [selectedSites])

    const resendData = async (values: any) => {
        values.site= selectedSites[0];
        try {
            const {data} = await axios.post('api/vrmCorrection/resend',values,{
                headers:{ authorization: "Bearer " + localStorage.getItem("token") }
            });


            for(const eachResponse of data.response){
                if(eachResponse.status === 200){
                    enqueueSnackbar(`VRM data sent succefully to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "success" });
                  }else{
                    enqueueSnackbar(`VRM resend failed to ${eachResponse.url}, Status Code ${eachResponse.status}`, { variant: "error" });
                  }
            }
            getForwardsData()
            

        } catch (error) {
            console.log("error",error);
            enqueueSnackbar("something went wrong",{variant:'error'})
        }
    }

    return (
        <Paper elevation={0}>
            <div style={{ display: "flex", justifyContent: 'end' }} className="--margin-bottom-large">
            <div>
                    <MultiSelect
                        fullWidth={!!isMobile}
                        multi={false}
                        className="insights__refine-menu__multi-select"
                        style={{marginRight: "10px" }}
                        options={["All","Sent","Unsent"].map((status: any) => ({
                          value:status,
                          label: status,
                        }))}
                        placeholder="Select Sort Type"
                        values={sortType}
                        onChange={(values) => {
                          setSortType(values);
                          if(values[0]==="Sent"){
                            setFilterStatus(200)
                          }
                          else if(values[0]==="All"){
                            setFilterStatus(0)

                          }else{
                            setFilterStatus(400)
                          }
                          
                          
                        }}
                    />
                </div>

                <div>
                    <MultiSelect
                        fullWidth={!!isMobile}
                        multi={false}
                        className="insights__refine-menu__multi-select"
                        options={allSites.sort().map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                        values={selectedSites}
                        onChange={(values) => {
                            const normalizedSites = Formatter.normalizeSites(values) || [];
                            setSelectedSites(normalizedSites);

                        }}
                    />
                </div>


            </div>

            <React.Fragment>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date/Time</TableCell>
                                <TableCell>Camera</TableCell>
                                <TableCell>Old VRM</TableCell>
                                <TableCell>New VRM</TableCell>
                                <TableCell>VRM Prefix</TableCell>
                                <TableCell>Site</TableCell>
                                <TableCell>URLs</TableCell>
                                <TableCell>Status</TableCell>
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

                                    filterData.length > 0 && filterData.map((eachData: any, index: any) => {
                                        return <TableRow >
                                            <TableCell>{dayjs(eachData.when).tz("Europe/London").format('DD/MM/YYYY HH:mm')}</TableCell>
                                            <TableCell>{eachData.camera}</TableCell>
                                            <TableCell>{eachData.previousVrm}</TableCell>
                                            <TableCell>{eachData.vrm}</TableCell>
                                            <TableCell>{eachData.prefixVrm ? eachData.prefixVrm : "NA"}</TableCell>
                                            <TableCell>{Formatter.capitalizeSite(selectedSites[0])}</TableCell>
                                            <TableCell>{eachData.url}</TableCell>
                                            <TableCell>
                                                <TableCell style={{ color: eachData.status === 200 ? 'green' : 'red', borderBottom: "none" }}>{eachData.status}</TableCell>
                                                {eachData.status !== 200 && <TableCell style={{ borderBottom: "none" }}><Button title="Resend" style={{ width: '72px' }} onClick={() => resendData(eachData)} variant="contained"><SendIcon /></Button></TableCell>}
                                            </TableCell>


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