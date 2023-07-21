import { object, string, array } from "yup";

export const AddSchema = object().shape({
	name: string().required("* name is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	statsExcluded: array().of(string()).required().min(1, "Please select at least a stat"),
	vrms: string().required( "Please enter valid VRM,s"),
});

export const EditSchema = object().shape({
	name: string().required("* name is required"),
	site: string().required("* site name is required"),
	statsExcluded: array().of(string()).required().min(1, "Please select at least a stat"),
	vrms: string().required( "Please enter valid VRM,s"),
});
