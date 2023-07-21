import React, { FC, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Button, DataTable, MultiSelect } from "../../components";
import { isMobile } from "react-device-detect";
import { useSnackbar } from "notistack";
import Paper from "@material-ui/core/Paper";
import { AuthContext } from "../../context/AuthContext";
import { Formatter } from "../../utils/Formatter";
import { ViewNoReturnVehicles } from "./NoReturnVehicleView";
import dayjs from "dayjs";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    minHeight: 200,
    maxHeight: 400,
    overFlowY: "scroll",
  },
});
export const Overstays: FC = () => {
  const classes = useStyles();

	const { enqueueSnackbar } = useSnackbar();
  const { userData } = useContext(AuthContext);
  const userLoginType = userData.userType;
  const email = userData.email;
    const [pAndDResponse, setPAndDResponse] = useState<any>({})
    const [selectedTariff , setSelectedTariff ] = useState<any>()
    const [sortType, setSortType] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState();
    const [page, setPage] = useState(0);
    const rowsPerPage = 200;
    const [overstaysData , setOverstaysData] = useState<any>({});
    const [formattedData, setFormattedData] = useState<any>([]);
    const [selectedNoReturnVehicles, setSelectedNoReturnVehicles] = useState<any>({});
    const [viewOpen, setViewOpen] = useState(false);


  const getPnDResponseData = async () => {
    try {
      const { data } = await axios.get(`/api/insights/response`, {
        headers: { authorization: "Bearer " + localStorage.getItem("token") }
      });
       setPAndDResponse(data);

    } catch (e) {
      console.log("Error in listing tariff types", e)
      enqueueSnackbar("Could not load data at this time. Please try again later", { variant: "error" });
    }
  };

  useEffect(() => {
    getPnDResponseData();
    // eslint-disable-next-line
  }, []);

  const getOverstaysData = async (page: any) => {
    setLoading(true);
    try {
      
      const { data } = await axios.post(
        `/api/insights/overstaysListing`,{type:userLoginType, email:email, page:page, perPage:rowsPerPage ,sortType:sortType, tariffId:selectedTariff[0].split("   ")[0], site:selectedTariff[0].split("   ")[1]}, 
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setOverstaysData(data.data);
      setCount(data.count);
      
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || "Something Went Wrong", { variant: "error" });

    }
    setLoading(false);
  };
  
  useEffect(()=>{
    if(sortType && sortType.length > 0){
    setPage(0)
    getOverstaysData(0)
    }
  },[sortType])

  useEffect(() => {
    if (overstaysData && overstaysData[0]) {
      let dataArr = [];
      for (const eachData of overstaysData) {
        if(sortType == "No Return Vehicles"){
          dataArr.push({
            _id: eachData.id,
            Site: Formatter.capitalizeSite(eachData.site),
            "Vrm": eachData.vrm ? eachData.vrm : "",
            "Vehicle Type": eachData.isEv ? "EV" : "Gasoline" ,
            "Count": eachData.count,
            "Charge": eachData.charge ? `£ ${eachData.charge}` : `£ 0`,
            "Entry": dayjs(eachData.entry).utc().format("DD-MM-YYYY HH:mm:ss"),
            "Exit": dayjs(eachData.exit).utc().format("DD-MM-YYYY HH:mm:ss"),
            "Plate": eachData.plate ,
            Actions: getActions({
             value:eachData
            })
          })
        }
        else{
          dataArr.push({
            _id: eachData.id,
            Site: Formatter.capitalizeSite(eachData.site),
            "Vrm": eachData.vrm ? eachData.vrm : "",
            "Vehicle Type": eachData.isEv ? "EV" : "Gasoline" ,
            "Charge": eachData.charge ? `£ ${eachData.charge}` : `£ 0`,
            "Plate": eachData.plate ,
            "Entry": dayjs(eachData.entry).utc().format("DD-MM-YYYY HH:mm:ss"),
            "Exit": dayjs(eachData.exit).utc().format("DD-MM-YYYY HH:mm:ss"),
          });
        }
      }  
       
      
      setFormattedData(dataArr);
    } else {
      setFormattedData([]);
    }
  }, [overstaysData]);
  
  
  const handleChangePage = async (newPage: number) => {
    setPage(newPage);
    getOverstaysData(newPage);
  };
  
  const handleCloseEdit = () => {
		setViewOpen(!viewOpen);
		setSelectedNoReturnVehicles({});
	};

  const getActions = (data: any) => {
    return (
      <Button
          text="View All"
          variant="outline"
          buttonStyle={{ padding: "8px 20px" }}
          onClick={() => {
            setSelectedNoReturnVehicles(data)
            setViewOpen(true)
          }}
        />
    )}
   const listType = ["All Vehicles" , "Overnight Vehicles", "No Return Vehicles"]

    return (
      <Paper className={classes.root} elevation={0}>

    <div style={{display:"flex", justifyContent:"end"}}>
            {selectedTariff ?
            <MultiSelect
                placeholder="Select Sort Type"
                style = {{marginRight:"10px"}}
                fullWidth={!!isMobile}
                multi={false}
                className="insights__refine-menu__multi-select"
                options={listType && listType.length > 0 ? listType.map((val:any) => ({ value: val, label: val })) : []}
                values={sortType}
                onChange={(e:any) => {
                    setSortType(e)       
                }}
         /> : <></>}
          <MultiSelect
                placeholder="Select tariff plan"
                fullWidth={!!isMobile}
                multi={false}
                className="insights__refine-menu__multi-select"
                options={pAndDResponse && pAndDResponse.length > 0 ? pAndDResponse.map((val:any) => ({ value: `${val.tariffId}   ${val.site}`, label: val.tariffName })) : []}
                values={selectedTariff}
                onChange={(e:any) => {    
                setSelectedTariff(e)           
            }}
         />  
    </div>
        {sortType == "No Return Vehicles" ?
          <DataTable
            columns={[
              "Vrm",
              "Vehicle Type",
              "Count",
              "Charge",
              "Plate",
              "Entry",
              "Exit",
              "Actions"
            ]}
            data={formattedData || []}
            loading={loading}
            pagination={true}
            count={count || 0}
            handleChangePage={async (page: any) => await handleChangePage(page)}
            page={page}
            rowsPerPage={rowsPerPage}
          /> :
          <DataTable
            columns={[
              "Vrm",
              "Vehicle Type",
              "Charge",
              "Entry",
              "Exit",
              "Plate",
            ]}
            data={formattedData || []}
            loading={loading}
            pagination={true}
            count={count || 0}
            handleChangePage={async (page: any) => await handleChangePage(page)}
            page={page}
            rowsPerPage={rowsPerPage}
          />}
    <ViewNoReturnVehicles viewOpen={viewOpen} closeDialog={handleCloseEdit} viewData={selectedNoReturnVehicles} refreshData={formattedData}/>
   
    </Paper>
    )
}