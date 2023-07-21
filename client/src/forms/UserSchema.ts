import { object, array, string } from "yup";

export const UserSchema = object().shape({
	email: string().min(4, "Email or username must contain at least 4 characters."),
	password: string().min(6, "Must contain at least 6 characters."),
	confirmPassword: string().test({
		test(value) {
			const { parent, createError } = this;

			if (parent.password !== value) {
				return createError({ message: "Passwords do not match." });
			}

			return true;
		}
	}),
	sites: array().of(string()).min(1, "Please select at least a car park")
});
