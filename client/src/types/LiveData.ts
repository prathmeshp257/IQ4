export interface LiveData {
	[site: string]: LiveObject;
}

export interface LiveObject {
	all?: {
		count: number;
	};
	unique?: {
		count: number;
		ratio: number;
	};
	repeat?: {
		count: number;
		ratio: number;
	};
	live?: {
		current: number;
		capacity: number;
		ratio: number;
		basicOccupancy: number;
		occupancy24h: number;
	};
	dwell?: {
		average: number;
	};
	diff?: {
		occupancy: {
			value: string;
			percent: string;
		};
		visits: {
			value: string;
			percent: string;
		};
	};
}
