import React, { FC, useState, useEffect, useContext } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import axios from "axios";
import { AddList } from "./AddList";
import { EditList } from "./EditList";
import { DeleteList } from "./DeleteList";
import { UserContext, AuthContext } from "../../context";
import { DataTable } from "../../components";
import { Formatter } from "../../utils";

interface Props {
    sites: Array<any>;
}

export const ExcludeVrm: FC<Props> = ({ sites }) => {
    const { userData } = useContext(AuthContext);
    const { email } = useContext(UserContext);
    const userLoginType = userData.userType;
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedList, setSelectedList] = useState({});
    const [lists, setLists] = useState([]);

    const getLists = async() => {
        setLoading(true);
        const { data } = await axios.get(`/api/excludeVrm?email=${email}&userType=${userLoginType}`, {
            headers: { authorization: "Bearer " + localStorage.getItem("token") }
        });
        const allLists = data.lists.map((val:any) => {
            return {
                "List Name": val.name, 
                "Site": Formatter.capitalizeSite(val.site), 
                "Stats Excluded": val.statsExcluded.join(",\n"), 
                "VRM List": val.vrms.join(",\n"),
                "Actions": getActions(val),
            }
        })
        setLists(allLists);
        setLoading(false);
    }

    useEffect(() => {
        getLists()
		// eslint-disable-next-line
    },[email])

    const getActions = (list: any) => {
        return (
            <ButtonGroup>
                <Button onClick={() => {setSelectedList(list); setEditOpen(true);}}>Edit</Button>
                <Button onClick={() => {setSelectedList(list); setDeleteOpen(true);}}>Delete</Button>
            </ButtonGroup>
        )
    }

    const reloadListData = () => {
        getLists();
        setSelectedList({});
    }

    const handleCloseDialog = () => {
        setAddOpen(!addOpen);
    };

    const handleCloseEdit = () => {
        setEditOpen(!editOpen);
        setSelectedList({});
    };

    const handleCloseDelete = () => {
        setDeleteOpen(!deleteOpen);
        setSelectedList({});
    };

    return (
        <React.Fragment>
                <h1 style={{padding:10}}>
                    Lists
                    <Button onClick={() => handleCloseDialog()} style={{ float: 'right' }}> + ADD LIST</Button>
                </h1>
                <DataTable
                    columns={["List Name", "Site", "Stats Excluded", "VRM List", "Actions"]}
                    data={lists || []}
                    loading={loading}
                    pagination={false}
                    count={lists.length || 0}
                />
            <AddList addOpen={addOpen} closeDialog={handleCloseDialog} sites={sites} reloadData={reloadListData}/>
            <EditList editOpen={editOpen} closeDialog={handleCloseEdit} list={selectedList} reloadData={reloadListData}/>
            <DeleteList deleteOpen={deleteOpen} closeDialog={handleCloseDelete} list={selectedList} reloadData={reloadListData}/>
        </React.Fragment>
    );
}