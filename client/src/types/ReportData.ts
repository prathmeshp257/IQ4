export interface ReportData {
	[site: string]: {
		when: string;
		ins: number;
		unique: number;
		repeat: number;
		occupancy: number;
		dwell: number;
	}[];
}
