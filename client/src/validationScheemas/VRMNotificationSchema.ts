import { array, number, object, string } from "yup";

export const EditSchema = object().shape({
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),
	
});

export const AddSchema = object().shape({
	type: array().of(string()).required().min(1, "Please select at least a notification type"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),
    dataForDays:number().min(1,"pleast select number of days")

}); 