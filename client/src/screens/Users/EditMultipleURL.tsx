import { FormikValues, useFormik } from "formik";
import React, { FC, useEffect, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex, MultiSelect } from "../../components";
import { colors } from "../../utils/constants";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Formatter } from "../../utils";
import { useSnackbar } from "notistack";
import { AuthContext, SiteContext } from "../../context";

interface Props {
    sites: any;
    editOpen: any;
    closeDialog: any;
    email: any;
    userType: any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
      maxHeight: "75vh",
    },
  }));

const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  font-size: 12px;
  display: flex;
  margin-bottom: 4px;
  color: ${colors.darkGray};
`;

const Error = styled.label`
  font-size: 12px;
  color: red;
  display: ${(e) => (e ? "block" : "none")};
  margin-top: 10px;
`;

const InputText = styled.input`
  display: flex;
  height: 38px;
  width: 100%;
  min-width: ${isMobile ? "260px" : "455px"};
  padding: 10px;
  margin: 2px 0;
  max-width: ${isMobile ? "260px" : "455px"};
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

export const EditMultipleUrl: FC<Props> = ({ editOpen, closeDialog, sites, email, userType }) => {

    const { userData } = useContext(AuthContext);
    const { sitesData } = useContext(SiteContext);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [allSites, setAllSites] = useState<any>([]);
    const [url, setUrl] = useState('');


    const handleSubmit = async (values: FormikValues) => {
        try {

            const isvalidUrl = isValidHttpUrl(formik.values.forwardUrl)
            if(!isvalidUrl){
                formik.setFieldError('forwardUrl',"Please Enter a valid URL !")
                return ;
            }
           
           if(!formik.values.replaceUrl){
            formik.setFieldError('replaceUrl',"Please Enter URL to be replaced !")
            return ;
           }
           
           
           if(!formik.values.forwardUrl){
            formik.setFieldError('forwardUrl',"Please Enter new URL !")
            return ;
           }
           if(!formik.values.sites[0]){
            formik.setFieldError('sites',"Please Select a Site !")
            return ;
           }
            values.email = email;
            values.type = userType;
            values.editType= "MULTIPLE";
            values.sites=selectedSites;
            
            await axios.post("/api/sites/editUrl", values, {
                headers: { authorization: "Bearer " + localStorage.getItem("token") },
            });

            enqueueSnackbar("URL updated successfully.", {
                variant: "success",
            });

        } catch (e: any) {
            enqueueSnackbar(e?.response?.data?.message || "Something Went Wrong", {
                variant: "error",
            });
        }
        cancelEdit();
    };





    useEffect(() => {
        let accessSites = sites;
        if (userType !== "Admin" && userType) {
            for (const eachSite of sites) {
                const expired = sitesData.filter((val: any) => val.id === eachSite && val.contractExpired)
                if (expired[0]) {
                    accessSites = accessSites.filter((val: any) => val !== eachSite);
                }
            }
            setAllSites(accessSites);
        }
        else if (userType === "Admin") {
            setAllSites(sites);
        }
        else {
            setAllSites([])
        }
        // eslint-disable-next-line
    }, [userType])

    function isValidHttpUrl(string:any) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
      }


    const cancelEdit = () => {
        formik.resetForm();
        setSelectedSites([])
        closeDialog();
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {

            replaceUrl: '',
            forwardUrl:'',
            sites:[]

        },
        onSubmit: handleSubmit,
    });





    const URLbuttonsStyle = {
        alignSelf: 'center',
        width: '40px',
        height: '40px',
        marginTop: '15px',
        cursor: 'pointer',
    }

    return (
        <Dialog
            open={editOpen}
            onClose={() => cancelEdit()}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            maxWidth="sm"
            
        >
            <Form onSubmit={formik.handleSubmit}>
                <DialogTitle>{`Edit URL for Multiple Sites`}</DialogTitle>
                <DialogContent>
                    <Flex direction="row" justify="center" wrap="wrap">

                            <div className="--margin-bottom-large">
                                <Label>Old URL</Label>
                                <InputText
                                    id="replaceUrl"
                                    name="replaceUrl"
                                    style={{ minWidth: "455px", maxWidth: '455px' }}
                                    type="text"
                                    placeholder="Enter Url"
                                    value={formik.values.replaceUrl}
                                    onChange={formik.handleChange}
                                    onBlur={()=>formik.setFieldTouched('replaceUrl')}
                                />
                                {formik.touched.replaceUrl && formik.errors.replaceUrl && (
                                <Error>{formik.touched.replaceUrl && formik.errors.replaceUrl}</Error>
                                )}
                            </div>
                            <div className="--margin-bottom-large">
                                <Label>New URL</Label>
                                <InputText
                                    id="forwardUrl"
                                    name="forwardUrl"
                                    style={{ minWidth: "455px", maxWidth: '455px' }}
                                    type="text"
                                    placeholder="Enter Url"
                                    value={formik.values.forwardUrl}
                                    onChange={formik.handleChange}
                                    onBlur={()=>formik.setFieldTouched('forwardUrl')}
                                />
                                {formik.touched.forwardUrl && formik.errors.forwardUrl && (
                                <Error>{formik.touched.forwardUrl && formik.errors.forwardUrl}</Error>
                                )}
                            </div>
                            <div>
                            <Label>Sites</Label>
                                <MultiSelect
                                    style={{ minWidth: "455px", maxWidth: '455px' }}
                                    fullWidth={!!isMobile}
                                    className="insights__refine-menu__multi-select"
                                    options={allSites.sort().map((site: any) => ({ value: Formatter.normalizeSite(site), label: Formatter.capitalizeSite(site) })) || []}
                                    values={selectedSites}
                                    onChange={(values) => {
                                        const normalizedSites = Formatter.normalizeSites(values) || [];
                                        setSelectedSites(normalizedSites);
                                        formik.setFieldValue('sites',normalizedSites)

                                    }}
                                />
                                 {formik.errors.sites && (
                                  <Error>{formik.errors.sites}</Error>
                                )}
                            </div>


                    </Flex>
                </DialogContent>

                <Flex direction="row" justify="center" wrap="wrap">
                    <DialogActions className="pr-4">
                        <Button
                            text="Cancel"
                            onClick={() => cancelEdit()}
                            color="secondary"
                        />
                        <Button text="Submit" type="submit" loading={formik.isSubmitting} />
                    </DialogActions>
                </Flex>
            </Form>
        </Dialog>
    );
};
