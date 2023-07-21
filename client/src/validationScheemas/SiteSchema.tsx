import { object, string, number } from "yup";

export const AddSchema = object().shape({
	name: string().required("* name is required"),
	capacity: number().required("* capacity is required").positive().min(1),
	maxDurationApproxMatch: number().min(1,"Duration should be greater than 0"),
	vrmCorrectionPrefix: string().matches(/^[A-Z]+$/, "Prefix must be uppercase alphabets ").min(3,'Prefix must be minimum 3 character long').max(3,"Prefix must be maximum 3 character long"),
	operatorId: string().required("* operator is required"),
	status: string().required("* status is required"),
});

export const EditSchema = object().shape({
	name: string().required("* name is required"),
	capacity: number().required("* capacity is required").positive().min(1),
	vrmCorrectionPrefix: string().matches(/^[A-Z]+$/, "Prefix must be uppercase alphabets ").min(3,'Prefix must be minimum 3 character long').max(3,"Prefix must be maximum 3 character long"),
	maxDurationApproxMatch: number().min(1,"Duration should be greater than 0"),
	operatorId: string().required("* operator is required"),
	status: string().required("* status is required"),
});

export const OperatorEditSchema = object().shape({
	name: string().required("* name is required"),
	capacity: number().required("* capacity is required").positive().min(1),
	maxDurationApproxMatch: number().min(1,"Duration should be greater than 0"),
	operatorId: string().required("* operator is required"),
	status: string().required("* status is required"),
});
