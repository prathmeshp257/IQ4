import { FormikValues, useFormik } from "formik";
import React, { FC, useContext, useEffect } from "react";
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
  editOpen:any;
  closeDialog:any;
  refreshData:any;
  editData: any;
}

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        maxHeight: '75vh',
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
	width: 100%;
	min-width: ${isMobile ? "260px" : "285px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "285px"};
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
	min-width: ${isMobile ? "260px" : "285px"};
	padding: 10px;
	margin: 2px 0;
	max-width: ${isMobile ? "260px" : "285px"};
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

export const EditEmailGroup: FC<Props> = ({editOpen, closeDialog, refreshData, editData}) => {
	const classes = useStyles();
	const { userData } = useContext(AuthContext);
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (values: FormikValues) => {
		try {
			values.createdBy = userData.email;
			values.userType = userData.userType;
            values.groupId = editData._id
			values.emails = values.emails ? (((values.emails).replace(/\s/g, "")).split(',')).filter((v:any) => (v !== null && v !== "" && v !== undefined)) : [];
			values.type = "Edit"

			await axios.post("/api/voi/addAndEditEmailGroups", values, {
				headers: { authorization: "Bearer " + localStorage.getItem("token") }
			});

			enqueueSnackbar("Email group edited successfully.");
			cancelEdit();
			refreshData();

		} catch (e:any) {
			console.log("Error in add voi list",e);
			enqueueSnackbar(e?.response?.data?.message || e.message || "Something Went Wrong", { variant: "error" });
			cancelEdit();
		}
	};

	const cancelEdit = () => {
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

	useEffect(() => {
		formik.setValues({
			groupName: editData.name ? editData.name : "",
			emails: editData.emails && (editData.emails).length > 0 ? (editData.emails).join(",") : "",
        });
		// eslint-disable-next-line
	},[editData]);

	return (
        <Dialog open={editOpen} onClose={ () => cancelEdit()}
          fullWidth={true}
		  classes={{ paper: classes.dialogPaper }}
          maxWidth={'xs'}>
		  <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
				{`Add Vehicle Of Interest List`}
            </DialogTitle>
            <DialogContent>
                <Flex direction="row" justify="space-between" wrap="wrap">
                    <div className="--margin-bottom-large">
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
                    <div className="--margin-bottom-large">
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
                </Flex>
            </DialogContent>
            <DialogActions className="pr-4">
				<Button text="Cancel" onClick={ () => cancelEdit() } color='secondary' />
				<Button text="Submit" type="submit" loading={formik.isSubmitting} />
            </DialogActions>
          </Form>
        </Dialog>
	);
};
