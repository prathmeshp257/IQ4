import { object, string, array } from "yup";

export const AddScheduledReportSchema = object().shape({
	email: string().required("* Email is required"),
	scheduleFrequency: string().required("* Schedule frequency is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
});

export const EditScheduledReportSchema = object().shape({
	email: string().required("* Email is required"),
	scheduleFrequency: string().required("* Schedule frequency is required"),
	site: string().required( "Please select at least a car park"),
});