import React, { FC, useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import dayjs from "dayjs";
import { isMobile } from "react-device-detect";
import { Formatter } from "../../utils";
import { AuthContext, SiteContext } from "../../context";
import { useSnackbar } from "notistack";
import { DataTable } from "../../components";
import CSVIcon from "@material-ui/icons/Assessment";
import { MultiSelect, Flex, Button } from "../../components";

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

export const FrameCount: FC<Props> = ({sites, mainSite,iqStatsActiveLabel,reloadData,setReloadData}) => {
	const { userData } = useContext(AuthContext);
	const { sitesData } = useContext(SiteContext);
    const classes = useStyles();
	const userType = userData.userType;
    const localSelectedSite = localStorage.getItem('iqStats-frame-count-selected-site')
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
	const [allSites, setAllSites] = useState<any>([]);
    const [selectedSites, setSelectedSites] = useState<string[]>(mainSite[0] ? mainSite : localSelectedSite ? [localSelectedSite] : []);
	const [downloadingCSV, setDownloadingCSV] = useState(false);
    const [frameCountData, setFrameCountData] = useState<any>({});
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

    const getFrameCountData = async (currPage:number) => {
        setLoading(true);
        try {
            const today = dayjs().format('DD-MM-YYYY');
            const sessionFrameCountData = sessionStorage.getItem(`${today}-${selectedSites[0]}-iqStats-frame-count-data-${currPage}`);
            if(sessionFrameCountData){
                setFrameCountData(JSON.parse(sessionFrameCountData));
                localStorage.setItem('iqStats-frame-count-selected-site', selectedSites[0])
            }
            else{
                const {data} = await axios.get(`/api/iqStats/frameCount?site=${selectedSites[0]}&page=${currPage}&perPage=${rowsPerPage}&userType=${userType}&email=${userData.email}`, {
                    headers: { authorization: "Bearer " + localStorage.getItem("token") }
                });
                setFrameCountData(data);
                
                localStorage.setItem('iqStats-frame-count-selected-site', selectedSites[0])
                sessionStorage.setItem(`${today}-${selectedSites[0]}-iqStats-frame-count-data-${currPage}`, JSON.stringify(data))
            }
        } catch (e) {
            console.log('error-iqstats-frame-count-data', e)
            enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
        }
        setLoading(false);
    };
    
    const handleChangePage = async(newPage:number) => {
        setPage(newPage);
        getFrameCountData(newPage);
    };

    useEffect(() => {
        if(selectedSites[0]){
            setPage(0);
            getFrameCountData(0);
        }
        else{
            setFrameCountData({});
        }
        // eslint-disable-next-line
    }, [selectedSites]);

    useEffect(() => {
        if(selectedSites[0] && iqStatsActiveLabel==="Frame Count" && reloadData){
            setPage(0);
            getFrameCountData(0);
            setReloadData(false);
        }
      
        // eslint-disable-next-line
    }, [reloadData]);
 

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
			const { data: frameCountCSVData } = await axios.get(
				`/api/iqStats/frameCount?site=${selectedSites[0]}&page=${page}&perPage=${rowsPerPage}&responseType=csv&userType=${userType}&email=${userData.email}`,
				{ responseType: "blob", headers: { authorization: "Bearer " + localStorage.getItem("token") } }
			);
			createDownloadLink(frameCountCSVData, "frame_count_data");
		} catch (e) {
			console.log("Error download csv frame count: \n", e)
		}
		setDownloadingCSV(false);
	}

    return (
        <Paper className={classes.root} elevation={0}>
            <div style={{display:"flex",justifyContent:"space-between", flexWrap:'wrap',marginBottom:'15px'}}>
            <h3 style={{marginBottom:"15px"}}>
                Last 30 Days Frame Count Data Of Site '{Formatter.capitalizeSite(selectedSites[0])}'
            </h3>
                <Flex wrap="wrap">
                    <MultiSelect
                        fullWidth={!!isMobile}
                        style={{marginRight: 10}}
                        multi={false}
                        className="insights__refine-menu__multi-select --margin-bottom-large"
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
           
			<DataTable 
				columns={["Site", "Camera Name", "Date/Time", "Trace Count", "Seen Count","Vehicle Count"]} 
				data={frameCountData.data || []} 
				loading={loading} 
				pagination={true} 
				count={frameCountData.count || 0} 
				handleChangePage={async(page:any) => await handleChangePage(page)} 
				page={page} 
				rowsPerPage={rowsPerPage} 
			/>
        </Paper>
    );
}