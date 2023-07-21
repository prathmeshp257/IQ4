import { FormikValues, useFormik } from "formik";
import React, { FC, useContext } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Button, Flex } from "../../components";
import { colors } from "../../utils/constants";
import { EmailGroupSchema } from "../../validationScheemas/VOISchema";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../../context";
import axios from "axios";
import { useSnackbar } from "notistack";

interface Props {
  addOpen:any;
  closeDialog:any;
  refreshData:any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '85vh',
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
	height: 44px;
	width: 400px;
	min-width: ${isMobile ? "260px" : "385px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "385px"};
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

const TextArea = styled.textarea`
	display: flex;
	width: 100%;
	min-width: ${isMobile ? "260px" : "385px"};
	padding: 10px;
	margin: 2px 0 ;
	max-width: ${isMobile ? "260px" : "385px"};
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

export const AddEmailGroup: FC<Props> = ({addOpen, closeDialog, refreshData}) => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (values: FormikValues) => {
		try {
			values.createdBy = userData.email;
			values.userType = userData.userType;
			values.emails = values.emails ? (((values.emails).replace(/\s/g, "")).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.type = "Add"

			await axios.post("/api/voi/addAndEditEmailGroups", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Email group created successfully.");
			cancelAdd();
			refreshData();

		} catch (e:any) {
			console.log("Error in add voi list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
			cancelAdd();
		}
	};

	const cancelAdd = () => {
		formik.resetForm(); 
		closeDialog(); 
	}

	const formik = useFormik({
		initialValues: {
			groupName: "",
			emails:"",
		},
		validationSchema: EmailGroupSchema,
		onSubmit: handleSubmit
	});

	return (
        <Dialog open={addOpen} onClose={ () => cancelAdd()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'xs'}
		  
		  >
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle >
				<div className="--margin-left-medium">
				{`Add Vehicle Of Interest List`}
				</div>
            </DialogTitle>
            <DialogContent >
                <Flex direction="row"  wrap="wrap" >
                    <div className="--margin-bottom-large --margin-left-medium ">
                        <Label>Group name</Label>
                        <InputText
                            id="groupName"
                            name="groupName"
                            type="text"
                            autoComplete="nope"
                            onChange={formik.handleChange}
                            onBlur={() => formik.setFieldTouched("groupName")}
                            value={formik.values.groupName}
                        />
                        {formik.touched.groupName && formik.errors.groupName && (
                            <Error>{formik.touched.groupName && formik.errors.groupName}</Error>
                        )}
                    </div>
                    <div className="--margin-bottom-large --margin-left-medium">
                        <Label>Email Contacts</Label>
                        <TextArea
                            rows={2}
                            id="emails"
                            name="emails"
                            autoComplete="nope"
                            onChange={formik.handleChange}
                            onBlur={() => formik.setFieldTouched("emails")}
                            value={formik.values.emails}
                        />
                        {formik.touched.emails && formik.errors.emails && (
                            <Error>{formik.touched.emails && formik.errors.emails}</Error>
                        )}
                    </div>
					<DialogActions className="" > 
				      <Button text="Cancel"  onClick={ () => cancelAdd() }   /> 
				       <Button text="Submit" type="submit" loading={formik.isSubmitting} />
                     </DialogActions>
                </Flex>
				
            </DialogContent>
            {/* <DialogActions className="p-4" > 
				 <Button text="Cancel"  onClick={ () => cancelAdd() }   /> 
				 <Button text="Submit" type="submit" loading={formik.isSubmitting} />
             </DialogActions> */}
          </Form>
        </Dialog>
	);
};
