import { object, array, string, number, date } from "yup";

export const CalcSchema = object().shape({
	tariffName: string().required("* Tariff name is required"),
	sites: array().of(string()).required().min(1, "* Please select at least a car park")
});