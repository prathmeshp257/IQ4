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
import { isMobile } from "react-device-detect";
import { MultiSelect } from "../../components";
import { Formatter } from "../../utils";
import { AuthContext } from "../../context";
import styled from "styled-components";
import { colors } from "../../utils/constants";
import dayjs from "dayjs";
import { Button, ButtonGroup } from "@material-ui/core";
import { useSnackbar } from "notistack";
import ProgressBar from "../Reports/ProgressBar";
import { ViewURLResponse } from "./ViewURLResponse";




interface Props {
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


const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;



const InputText = styled.input`
  display: flex;
  height: 38px;
  width: 100%;
  min-width: ${isMobile ? "260px" : "280px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "280px"};
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

export const CameraAPICallData: FC<Props> = ({ iqStatsActiveLabel, reloadData, setReloadData }) => {
    const { userData } = useContext(AuthContext);
    const userType = userData.userType;
    const email = userData.email;
    const classes = useStyles();
    const today = dayjs().format("DD/MM/YYYY");
    const localSelectedSite = localStorage.getItem('camera-api-selected-site')
    const [selectableSites, setSelectableSites] = useState<any[]>([]);
    const [cameraAPIData, setCameraAPIData] = useState<any>([])
    const [loading, setLoading] = useState(false);
    const [viewOpen, setViewOpen] = useState(false)
    const [selectedSites, setSelectedSites] = useState<string[]>(localSelectedSite ? [localSelectedSite] : []);
    const [response, setResponse] = useState({});
    const [siteData, setSitesData] = useState<any>([])
    const { enqueueSnackbar } = useSnackbar();





    useEffect(() => {
        let cameraAPIaccessSites = siteData.filter((eachSite: any) => {
            return eachSite.cameraApiAccess === true
        })

        let selectableSites = [] as any;
        for (const eachSite of cameraAPIaccessSites) {
            selectableSites.push(eachSite._id)
        }
        setSelectableSites(selectableSites);

    }, [siteData]);



    const getSites = async () => {
        try {
            setLoading(true)
            const site = userData.sites;
            const { data } = await axios.post("/api/sites/siteDetails", { site }, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            });
            setSitesData(data);
            setLoading(false);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }

    useEffect(() => {
        getSites();
    }, [userType])


    const getCamerAPICallData = async () => {
        try {
            setLoading(true)
            const sessionCameraApiData = sessionStorage.getItem(`${today}-${selectedSites[0]}-camera-api-data`);
            if (sessionCameraApiData) {
                setCameraAPIData(JSON.parse(sessionCameraApiData))
                localStorage.setItem('camera-api-selected-site', selectedSites.join());

            } else {
                const { data } = await axios.get(`/api/iqStats/getCameraApiCallData?email=${email}&type=${userType}&site=${selectedSites[0]}`, {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });

                data.sort(function(a:any,b:any){
                    return Date.parse(b.when) - Date.parse(a.when);
                  });
         
                setCameraAPIData(data);
                localStorage.setItem('camera-api-selected-site', selectedSites.join());
                sessionStorage.setItem(`${today}-${selectedSites[0]}-camera-api-data`, JSON.stringify(data))

            }


            setLoading(false);
        }
        catch (e: any) {
            console.log("ERROR", e)
        }
    }
    useEffect(() => {
        getCamerAPICallData();
    }, [selectedSites])

    useEffect(() => {
        if (selectedSites[0] && reloadData && iqStatsActiveLabel === "Camera API Data") {
            getCamerAPICallData();
            setReloadData(false)

        }


    }, [reloadData])

    const viewResponse = (response: any) => {
        setResponse(JSON.parse(response));
        setViewOpen(true)
    }

    const closeViewDialog = () => {
        setViewOpen(false);
        setResponse({})
    }


    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap', marginBottom: '15px' }}>
                <h3 style={{ marginBottom: "15px" }}>
                    Last 30 Days Camera Response Data Of Site '
                    {Formatter.capitalizeSites(selectedSites)}'
                </h3>
                <MultiSelect
                    multi={false}
                    style={{ marginRight: "10px" }}
                    className="dashboard__refine-menu__multi-select --margin-bottom-large"
                    options={selectableSites.map((site: any) => ({
                        value: Formatter.normalizeSite(site) || "",
                        label: Formatter.capitalizeSite(site),
                    }))}
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
                                <TableCell>Site</TableCell>
                                <TableCell>Camera Name</TableCell>
                                <TableCell>Camera IP</TableCell>
                                <TableCell>MAC</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Response</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loading ?
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div style={{ height: '300px', width: '100%', textAlign: 'center', padding: 'auto' }}> <ProgressBar /> </div>
                                        </TableCell>
                                    </TableRow>
                                    :
                                    cameraAPIData.map((eachData: any) => {
                                        return <TableRow>

                                            <TableCell>{Formatter.capitalizeSite(selectedSites[0])}</TableCell>
                                            <TableCell> {eachData.camera}</TableCell>
                                            <TableCell> {eachData.cameraIP}</TableCell>
                                            <TableCell> {eachData.MAC}</TableCell>
                                            <TableCell> {eachData.title === "Input health" ? "Input voltage" : eachData.title}</TableCell>
                                            <TableCell> {dayjs(eachData.when).format("DD-MM-YY HH:mm:ss")}</TableCell>

                                            <TableCell key={'action'} align='left'>
                                                <ButtonGroup>

                                                    <Button onClick={() => { viewResponse(eachData.response) }}>View</Button>
                                                </ButtonGroup>
                                            </TableCell>

                                        </TableRow>
                                    })
                            }


                        </TableBody>
                    </Table>
                </TableContainer>
                <ViewURLResponse response={response} viewOpen={viewOpen} closeDialog={closeViewDialog} />


            </React.Fragment>
        </Paper>
    );
}