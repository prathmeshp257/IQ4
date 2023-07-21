import { object, array, string } from "yup";

export const VOISchema = object().shape({
	listName: string().required("* List name is required"),
	listType: string().required("* List type is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	vrms: string().required( "Please enter valid VRM,s"),
});

export const AddRemoveSchema = object().shape({
	type: string().oneOf(['Add', 'Remove'], 'Select valid type').required("* List type is required"),
	lists: array().of(string()).required().min(1, "Please select at least one voi list"),
	vrms: string().required( "Please enter valid VRM,s"),
});

export const EmailGroupSchema = object().shape({
	groupName: string().required("* Group name is required"),
	emails: string().required("* Emails are required"),
});

