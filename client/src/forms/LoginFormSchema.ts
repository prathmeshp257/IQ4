import { object, string } from "yup";

export const LoginFormSchema = object().shape({
	email: string().required("Email is required"),
	password: string().required("Password is required")
});
