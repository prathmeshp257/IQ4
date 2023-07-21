
import { Table } from "@material-ui/core";
import { ProgressBar } from "antd-mobile";
import loading from "antd-mobile/es/components/loading";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { FC } from "react";
import { Formatter } from "../../utils";
import axios from "axios";
import { AuthContext, UserContext } from "../../context";
import { useSnackbar } from "notistack";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
	root: {
		width: '100%',
		padding: 0,
		boxShadow: 'none'
	},
	container: {
	  	minHeight: 200,
		maxHeight: 400,
	},
	dialogPaper: {
		maxHeight: "75vh",
	  },
});

export const SpreadsheetStatus: FC = () => {

	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;

	const { sites } = useContext(UserContext);
    
	const [voiSpreadsheetLists, setVOISpreadsheetLists] = useState<any>({});
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();

	const voiPrivateSites = userData.voiPrivateAccessSites || undefined;
	const voiViewOnlyAccessSites = userData.voiViewOnlyAccessSites?.filter((val: any) => val !== "" && val !== undefined && val !== null) || [];
	const voiPrivateAccessSites = (userLoginType === "Retailer" || userLoginType === "Operator") && voiPrivateSites ? voiPrivateSites.filter((val: any) => val !== "" && val !== undefined && val !== null) : userLoginType === "Admin" ? sites : [];
    const allVoiSites = (voiViewOnlyAccessSites.concat(voiPrivateAccessSites)).filter((val: any) => val !== "" && val !== undefined && val !== null);
	const uniqVoiSites = allVoiSites.filter((val: any, pos: any) => allVoiSites.indexOf(val) === pos);

    const getData = async () => {
		try {
			const {data} = await axios.post(`/api/voi/privateVoiList`,{sites:(Formatter.normalizeSites(uniqVoiSites)),userType:userLoginType,createdBy:userData.email, is_private: true}, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			
			const dataArr=data.listData.filter((val:any)=>{
                if(val.sendToSpreadsheet == true){
					return val
				}
            })
            data.listData= dataArr

			await setVOISpreadsheetLists(data);
		} catch (e) {
			console.log("Error in listing voi", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
	};

    useEffect(() => {
		getData();
		// eslint-disable-next-line
	}, []);
    
    
    return (
	<React.Fragment>

				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Site</TableCell>
							<TableCell>List Name</TableCell>
							<TableCell>VRM's</TableCell>
							<TableCell>Status</TableCell>
                        </TableRow>
					</TableHead>
					 <TableBody>
                   {voiSpreadsheetLists && voiSpreadsheetLists.listData && voiSpreadsheetLists.listData.map((eachList:any,i:any)=>(    	
			        <TableRow key={i}>
						<TableCell>{Formatter.capitalizeSite(eachList.site) || "NA"}</TableCell>
						<TableCell>{eachList.listName || "NA"}</TableCell>
						<TableCell>{eachList.vrms && (eachList.vrms).length > 0 ? (eachList.vrms).join(',\n') : 'NA'}</TableCell>
                   <TableCell>{eachList.position && eachList.position == "NotOnSheet" ? "Not yet on the sheet" : eachList.position == "OnSheet" ? "On the sheet" : eachList.position == "Expired" ? "Expired" : ""}</TableCell>
					</TableRow>
                    ))}
								
							 
                        
					</TableBody> 
				</Table>
		
    </React.Fragment>
    )
}


