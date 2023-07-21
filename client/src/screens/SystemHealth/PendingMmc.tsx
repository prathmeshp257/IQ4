import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Flex, SystemHealthRow, MultiSelect, Button } from "../../components";
import { Divider } from "../../components/Divider";
import { LabelledComponent } from "../../components/LabelledComponent";

import { VrmDataTable } from "./VrmDataTable";
import { MmcDataTable } from "../../components";
import ProgressBar from "../Reports/ProgressBar";

interface Props {
	isContainerColMode: boolean;
}

export const PendingMmc: FC <Props> = ({isContainerColMode}) => {
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

	const [page, setPage] = useState(0);
	const rowsPerPage = 20;

	const getData = async (currPage:number) => {
		try {
			setLoading(true);

			const {data} = await axios.get(`/api/systemHealth/mmc?page=${currPage}&perPage=${rowsPerPage}`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			setLoading(false);
			setSystemHealth(data);
			
		} catch (e) {
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		
	};

	useEffect(() => {
		getData(0);
	}, []);

	const handleChangePage = async(newPage:number) => {
        setPage(newPage);
        getData(newPage);
    };

	return (
		<>
			
			{loading &&
				<ProgressBar/>
			}
			{!loading && systemHealth.main_array && systemHealth.main_array.length>0  &&
				<MmcDataTable 
					columns={["SITE", "PENDING MMC", "API SUCCESS", "API FAILED"]} 
					data={systemHealth.main_array} 
					loading={loading} 
					pagination={true} 
					count={systemHealth.count || 0} 
					handleChangePage={async(page:any) => await handleChangePage(page)} 
					page={page} 
					rowsPerPage={rowsPerPage} 
				/>
			}
			
		</>
	);
};
