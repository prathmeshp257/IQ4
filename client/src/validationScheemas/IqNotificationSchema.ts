import { object, array, string, number } from "yup";

export const AddSchema = object().shape({
	notificationType: array().of(string()).required().min(1, "Please select at least a notification type"),
	sites: array().of(string()).required().min(1, "Please select at least a car park"),
	// emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	// receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),
	traceCountThreshold: number().min(1, "Trace count threshold must be greater than 0"),
	seenCountThreshold: number().min(1, "Seen count threshold must be greater than 0"),
	minimumDecodes:number().min(1,"Minimum decode must be greater than 0"),
	heartbeatMinutes: number().min(1, "Minutes must be greater than 0"),
	exactThreshold: number().min(1, "Eaxt threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	exactClusterThreshold: number().min(1, "Eaxt + Cluster threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	exactClusterApproxThreshold: number().min(1, "Eaxt + Cluster + Approx threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	vrmCounter: number().min(1, "Threshold must be greater than 0").max(100, "Threshold must be between 1-100"),
	occupancy24hThreshold:number().min(1, "Occupancy 24h threshold must be between 1-100").max(100, "Occupancy 24h threshold must be between 1-100"),
	basicOccupancyThreshold:number().min(1, "Basic Occupancy threshold must be between 1-100").max(100, "Basic Occupancy threshold must be between 1-100"),
	occupancyProThreshold:number().min(1, "Occupancy Pro threshold must be between 1-100").max(100, "Occupancy Pro threshold must be between 1-100"),

}); 

export const EditSchema = object().shape({
	type: string().required("Notification type is required"),
	site: string().required("Site is required"),
	// emailContacts: array().of(string().email("Please enter valid email address")).required().min(1, "Please insert at least a email contact"),
	// receiver: string().min(3, "Receiver name is required").required("Receiver name is required"),
	traceCountThreshold: number().min(1, "Trace count threshold must be greater than 0"),
	seenCountThreshold: number().min(1, "Seen count threshold must be greater than 0"),
	heartbeatMinutes: number().min(1, "Minutes must be greater than 0"),
	exactThreshold: number().min(1, "Eaxt threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	exactClusterThreshold: number().min(1, "Eaxt + Cluster threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	exactClusterApproxThreshold: number().min(1, "Eaxt + Cluster + Approx threshold must be between 1-100").max(100, "Eaxt threshold must be between 1-100"),
	vrmCounter: number().min(1, "Threshold must be greater than 0").max(100, "Threshold must be between 1-100"),
	occupancy24hThreshold:number().min(1, "Occupancy 24h threshold must be between 1-100").max(100, "Occupancy 24h threshold must be between 1-100"),
	basicOccupancyThreshold:number().min(1, "Basic Occupancy threshold must be between 1-100").max(100, "Basic Occupancy threshold must be between 1-100"),
	occupancyProThreshold:number().min(1, "Occupancy Pro threshold must be between 1-100").max(100, "Occupancy Pro threshold must be between 1-100"),
});

