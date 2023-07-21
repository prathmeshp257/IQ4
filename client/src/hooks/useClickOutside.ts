import { useEffect, useRef, useState } from "react";

export const useClickOutside = () => {
	const ref = useRef() as any;

	const [isClickOutside, setIsClickOutside] = useState(false);

	const resetIsClickOutside = () => {
		setIsClickOutside(false);
	};

	const handleClickOutside = (event: { target: any }) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setIsClickOutside(true);
		} else {
			setIsClickOutside(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);

	return { ref, isClickOutside, resetIsClickOutside };
};
