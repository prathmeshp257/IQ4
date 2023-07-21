import { ButtonGroup, TableBody } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { FC, useEffect, useState } from "react"
import { Button } from "../../components"
import axios from "axios"
import { useSnackbar } from "notistack"
import { DeleteTariff } from "./DeleteTariff"
import React from "react"
import { ViewTariff } from "./ViewTariff"
import { Formatter } from "../../utils";


export const SelectedTariffTypes : FC = () => {
    const [tariffLists, setTariffLists] = useState<any>({});
	const { enqueueSnackbar } = useSnackbar();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedTariffList, setSelectedTariffList] = useState<any>({});
    
    
    
    const getData = async () => {
		try {
			const {data} = await axios.get(`/api/insights`, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});
			
			data.listData = data
		
			setTariffLists(data);
            
		} catch (e) {
			console.log("Error in listing tariff types", e)
			enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
		}
		
	};
    useEffect(() => {
		getData();
		
		// eslint-disable-next-line
	}, []);

	const handleCloseDelete = () => {
		setDeleteOpen(!deleteOpen);
		setTariffLists({});
	};

	const handleCloseEdit = () => {
		setEditOpen(!editOpen);
		setTariffLists({});
	};
	
    const getActions = (data:any) =>{
		return (
			<ButtonGroup>
				<Button text="View" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {setSelectedTariffList(data); setEditOpen(true);}}/>
                {/* <Button text="Report" variant='outline' buttonStyle={{padding:'8px 20px'}} onClick={() => {}} /> */}
				<Button text="Delete" variant='outline' buttonStyle={{padding:'8px 20px'}}  onClick={() => {setSelectedTariffList(data); setDeleteOpen(true)}} />
			</ButtonGroup>
		)
	}
    return(
        <React.Fragment>
          <Table>
					<TableHead>
						<TableRow>
                            <TableCell>Name</TableCell>
							<TableCell>Sites</TableCell>
							<TableCell>Tariff type</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
                        </TableRow>
					</TableHead>
                    <TableBody>
                        {tariffLists && tariffLists.listData && tariffLists.listData.map((val:any)=>{
					       return(
							<>

                        <TableRow>
						    <TableCell>{val.tariffName}</TableCell>
                            <TableCell>{(Formatter.capitalizeSites((val.sites))).join(',\n')}</TableCell>
                            <TableCell>{val.selectedCase && val.selectedCase == 'Case1' ? 'Pay per hour' : val.selectedCase == 'Case2' ? 'Pay with reducing' : val.selectedCase == 'Case3' ? 'Pay as per entry time' : val.selectedCase == 'Case4' ? 'Payment as per emissions' : ''}</TableCell>
							<TableCell>{val.status && val.status == "DONE" ? "Revenue Report Completed" : val.status == "PROCESSING"? "In Progress" : "Yet to be processed"}</TableCell>
                            <TableCell>{getActions(val)}</TableCell>
                        </TableRow>
						</>)
                        })} 
                    </TableBody>
            </Table>
			<DeleteTariff deleteOpen={deleteOpen} closeDialog={handleCloseDelete} deleteData={selectedTariffList} refreshData={getData}/>
			<ViewTariff editOpen={editOpen} closeDialog={handleCloseEdit} viewData={selectedTariffList} refreshData={getData} />
			

        </React.Fragment>
        
    )
}