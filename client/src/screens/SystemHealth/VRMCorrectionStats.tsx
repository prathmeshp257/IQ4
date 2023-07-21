import axios from "axios";
import { useSnackbar } from "notistack";
import React, { FC, useContext, useEffect, useState } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { AuthContext, SiteContext, UserContext } from "../../context";
import ProgressBar from "../Reports/ProgressBar";



interface Props {
	isContainerColMode: boolean;
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
export const VRMCorrectionStats: FC <Props> = ({isContainerColMode}) => {
    const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
    const {sitesData} = useContext(SiteContext)
	const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [vrmCorrectedCount,setVRMCorrectedCount] = useState(0);
    const [yesterdaysVRMCorrectedCount,setYesterdaysVRMCorrectedCount] = useState(0);
    const [count,setCount] = useState(0);
    const [vrmCorrectedData,setVRMCorrectedData] = useState<any>([{}])


   

    const getVRMCorrectionStats = async (currPage:any) => {
        setLoading(true)
        try {
            const {data} = await axios.get(`/api/systemHealth/vrmCorrectionStats?page=${currPage}&perPage=20`,{
                headers: { authorization: "Bearer " + localStorage.getItem("token") }
            })
            setVRMCorrectedData(data['dataArray'].sort((a:any, b:any)=>{
                let x = a.SITE.toLowerCase();
                let y = b.SITE.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
              }));
            setVRMCorrectedCount(data && data['totalCount'] && data['totalCount'].todaysCount ? data['totalCount'].todaysCount : 0);
            setYesterdaysVRMCorrectedCount(data && data['totalCount'] && data['totalCount'].yesterdaysCount ? data['totalCount'].yesterdaysCount : 0)
            setCount(data['count']);
          
        } catch (error) {
            console.log(error);
            
        }
        setLoading(false)
   
        
    }


    useEffect(()=>{
        getVRMCorrectionStats(page)
    },[sitesData])
    

	


    const handleChangePage = async(event:any, newPage:number) => {
        setPage(newPage)
        getVRMCorrectionStats(newPage)
    }


	

	return (
        <Paper className={classes.root} elevation={0}>
          <h2 style={{marginBottom:"20px", marginTop:"20px"}}>
          Today's VRM Corrected Count : {vrmCorrectedCount?vrmCorrectedCount:  0}
      </h2>
      <h2 style={{marginBottom:"15px"}}>
          Yesterday's VRM Corrected Count : {yesterdaysVRMCorrectedCount ? yesterdaysVRMCorrectedCount : 0} 
      </h2>
      <h3 style={{marginBottom:"15px"}}>
          Last 30 Days VRM Correction Data
      </h3>
        <React.Fragment>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Site</TableCell>
                            <TableCell >Corrected VRMs</TableCell>
                            <TableCell >Ignored VRMs</TableCell>
                            <TableCell>Duplicate VRMs</TableCell>
                           
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                        loading ? 
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <div style={{height:'300px', width:'100%', textAlign:'center', padding:'auto'}}> <ProgressBar /> </div>
                                </TableCell>
                            </TableRow>
                        :
                        
                      
                        vrmCorrectedData.map((eachData:any,index:any) => {
                             return <><TableRow>
                                <TableCell>{eachData.SITE}</TableCell>
                                <TableCell>{eachData.vrmCorrectedDataCount}</TableCell>
                                <TableCell>{eachData.vrmSkippedDataCount}</TableCell>
                                <TableCell>{eachData.vrmDuplicateDataCount}</TableCell>
                            </TableRow>
                          
                        </>
                      
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component='div'
                count={count}
                rowsPerPage={20}
                page={page}
                backIconButtonProps={loading ? {disabled:true} : undefined}
                nextIconButtonProps={loading ? {disabled:true} :undefined}
                onChangePage={handleChangePage}
                labelRowsPerPage=''
                rowsPerPageOptions={[]}
            />
        </React.Fragment>
    </Paper>
	);
};