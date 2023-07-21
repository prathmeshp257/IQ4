export interface Historic {
	ins: number;
	unique: number;
	repeat: number;
	dwell: number;
}

export interface Occupancy {
	ins: number;
	unique: number;
	repeat: number;
	dwell: number;
	data: {
		labels: Date[];
		values: number[];
	};
}

export interface Visits {
	average: number;
	total: number;
	data: {
		labels: string[];
		values: number[];
	};
}

export interface Dwell {
	[range: string]: number;
}

export interface RepeatTime {
	data: {
		labels: string[];
		values: number[];
	};
}

export interface RepeatFrequency {
	total: number;
	data: {
		labels: string[];
		values: number[];
	};
}

export interface DwellByHour {
	average: number;
	data: {
		labels: string[];
		values: number[];
	};
}

export interface DashboardData {
	site?: string;
	sites: Array<string>;
	historic: Historic[];
	occupancy: Occupancy[];
	visits: Visits[];
	dwell: Dwell[][];
	repeatFrequency: RepeatFrequency[];
	repeatTime: RepeatTime[];
	dwellByHour: DwellByHour[];
}
