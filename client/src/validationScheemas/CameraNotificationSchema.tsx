import { object, array, string, number } from "yup";

export const AddSchema = object().shape({
    type: array().of(string()).required().min(1, "Please select at least a type"),
	notificationTypes: array().of(string()).required().min(1, "Please select at least a notification type"),
	site: string().required().min(1, "Please select at least a car park"),
    lowAmp1: number().positive("Current must be greater than zero"),
    lowAmp2: number().positive("Current must be greater than zero"),
    frequencyIRCurrent1:number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    frequencyIRCurrent2:number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    frequencyPoEvoltage: number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    highAmp1: number().positive("Current must be greater than zero"),
    highAmp2: number().positive("Current must be greater than zero"),
    lowVoltage: number().positive("Voltage must be greater than zero"),
    highVoltage: number().positive("Voltage must be greater than zero"),
    unsent1: number().min(1,"Value must be greater than zero"),
    unsent2: number().min(1,"Value must be greater than zero"),
    unsent3: number().min(1,"Value must be greater than zero"),
    unsent4: number().min(1,"Value must be greater than zero")
	// emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	// receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),


}); 

export const EditSchema = object().shape({
    type: string().required("Type is required"),
	notificationType: string().required("Notification type is required"),
	site: string().required("Site is required"),
    lowAmp1: number().positive("Current must be greater than zero"),
    lowAmp2: number().positive("Current must be greater than zero"),
    frequencyIRCurrent1:number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    frequencyIRCurrent2:number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    frequencyPoEvoltage: number().min(1,"Minimum frequency can be 1").max(5,"Maximum frequency can be 5"),
    highAmp1: number().positive("Current must be greater than zero"),
    highAmp2: number().positive("Current must be greater than zero"),
    lowVoltage: number().positive("Voltage must be greater than zero"),
    highVoltage: number().positive("Voltage must be greater than zero"),
    unsent1: number().min(1,"Value must be greater than zero"),
    unsent2: number().min(1,"Value must be greater than zero"),
    unsent3: number().min(1,"Value must be greater than zero"),
    unsent4: number().min(1,"Value must be greater than zero")
	// emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	// receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),
	
});

