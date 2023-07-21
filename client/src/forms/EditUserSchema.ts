import { object, string } from "yup";

export const EditUserSchema = object().shape({
	firstName: string().required("* Please input a name"),
	lastName: string().notRequired(),
	email: string(),
	oldPassword: string().required("* Please input your password.")
});
