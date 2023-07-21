export interface Historic {
	ins: number;
	unique: number;
	repeat: number;
	dwell: number;
}

export interface Occupancy {
	capacity: number;
	current: number;
	ratio: number;
	data: {
		labels: Date[];
		values: number[];
	};
}

export interface Visit {
	data: {
		labels: Date[];
		values: number[];
	};
}

export interface Dwell {
	[range: string]: number;
}

export type Site = string;

export type GraphType = "Occupancy" | "Visits" | "Dwell" | string;
export type GraphFormat = "bar" | "line";
