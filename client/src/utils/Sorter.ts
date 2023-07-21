export const sortBy = (field: string, order = -1) => {
	return (elementA: any, elementB: any): number => {
		if (elementA[field] > elementB[field]) return order > 0 ? -1 : 1;
		if (elementA[field] < elementB[field]) return order > 0 ? 1 : -1;
		return 0;
	};
};
