import { object, array, string, number } from "yup";

export const UserSchema = object().shape({
	email: string().required("* email is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	firstName: string().required( "Please enter valid first name"),
	location: string().required( "Please enter valid location"),
	contact: string().required( "Please enter valid contact details").length(10, 'Please enter valid contact details').matches(new RegExp('[0-9]{10}'), 'Please enter valid contact details'),
	oldPassword: string().required("* old password is required.").min(6, "Please enter valid user password."),
});

export const CustomerSchema = object().shape({
	email: string().required("* email is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	firstName: string().required( "Please enter valid first name"),
	retailer: string().required( "Please enter valid retailer"),
	contact: string().required( "Please enter valid contact details").length(10, 'Please enter valid contact details').matches(new RegExp('[0-9]{10}'), 'Please enter valid contact details'),
	oldPassword: string().required("* old password is required.").min(6, "Please enter valid user password."),
	limit: number().required( "Please enter valid request limit")
});

export const OperatorSchema = object().shape({
	email: string().required("* email is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	firstName: string().required( "Please enter valid first name"),
	allowances: number().required( "Please enter valid allowances"),
	oldPassword: string().required("* old password is required.").min(6, "Please enter valid user password."),
});

export const Co_OperatorSchema = object().shape({
	email: string().required("* email is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	firstName: string().required( "Please enter valid first name"),
	oldPassword: string().required("* old password is required.").min(6, "Please enter valid user password."),
});

export const RetailerSchema = object().shape({
	email: string().required("* email is required"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	firstName: string().required( "Please enter valid first name"),
	operator: string().required( "Please enter valid operator"),
	oldPassword: string().required("* old password is required.").min(6, "Please enter valid user password."),
});
