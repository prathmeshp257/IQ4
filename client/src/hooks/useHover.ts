import { useEffect, useRef, useState } from "react";

export const useHover = () => {
	const ref = useRef() as any;
	const ref2 = useRef() as any;

	const [isHovered, setIsHovered] = useState(false);

	const mouseover = (event: any) => {
		if (ref.current.contains(event.target) || ref.current.contains(event.target.querySelector("div"))) {
			return setIsHovered(true);
		} else if (ref2.current.contains(event.target)) {
			return setIsHovered(true);
		} else {
			return setIsHovered(false);
		}
	};

	useEffect(() => {
		if (ref.current) {
			document.addEventListener("mouseover", mouseover);
		}

		return () => {
			document.removeEventListener("mouseover", mouseover);
		};
	}, [ref]);

	return { ref, ref2, isHovered };
};
