import { FC, useEffect, useState } from "react"
import { DashRowRevenue } from "../../components/DashRow/DashRowRevenue"
import { ViewRevenue } from "./RevenueSummary.tsx";
import axios from "axios";
import { useSnackbar } from "notistack";
	




export const Revenue: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

  const [pAndDResponse, setPAndDResponse] = useState<any>({})

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

  return (
    <>
    {pAndDResponse && pAndDResponse.length > 0 ? 
    pAndDResponse.map((val:any)=>{
      
      return (
        <>

         <DashRowRevenue tariffName={val.tariffName} title={val.site} subTitle={val && val.selectedCase ? val.selectedCase == "Case1" ? "Pay Per Hour" : val.selectedCase == "Case3" ? "Flat Payment As Per Duraton" : '' : ''} data={val}/>
    
        </>
      )
    })
    :<></>
    
    }
      {/* <DashRowRevenue title="989 Ir Only - hi" subTitle="Pay Per Hour" /> */}
    </>
  )

}


