import { Dialog, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { FC } from "react"
import { makeStyles } from '@material-ui/core/styles';
import styled from "styled-components";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Flex } from "../../components/Flex";
import dayjs from "dayjs";


const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
    },
}));
const Form = styled.form`
	width: 100%;
`;
interface Props {
    viewOpen: any;
    closeDialog: any;
    viewData: any;
    refreshData: any;
}
export const ViewNoReturnVehicles: FC<Props> = ({ viewOpen, closeDialog, viewData, refreshData }) => {
    const classes = useStyles();
    const cancelView = () => {
        closeDialog();
        refreshData()
    }

    return (
        <Dialog open={viewOpen} onClose={() => cancelView()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth={'sm'}>
            <Form >
                {viewData && viewData.value &&
                    <DialogTitle>
                        {(viewData.value).vrm}
                    </DialogTitle>
                }

                <DialogContent>
                    <Flex>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Entry</TableCell>
                                    <TableCell>Exit</TableCell>
                                    <TableCell>Charge</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {viewData.value && ((viewData.value).data) &&
                                    ((viewData.value).data).map((val: any) => {
                                        return (
                                            <TableRow>
                                                <TableCell>{dayjs(val.entry).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{dayjs(val.exit).format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                                <TableCell>{val.charge}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                    </Flex>
                </DialogContent>
            </Form>
        </Dialog>
    )
}



