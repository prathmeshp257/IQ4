export interface Make {
	name: string;
	total: number;
	unique: number;
}

export interface Model {
	name: string;
	total: number;
	unique: number;
}

export interface Age {
	ageGap: string;
	total: number;
	unique: number;
	emissions:number;
}

export interface Fuel {
	fuel: string;
	total: number;
	unique: number;
	emissions:number;
}

export interface CO2 {
	when: string;
	vehicles: number;
	emissionsAverage: number;
	emissionsTotal: number;
	fuelTypes?: {
		[fuelType: string]: number;
	};
}

export interface EmissionGeneralResult {
	make?: string;
	model?: string;
	emissionsAverage: number;
	emissionsCumulative: number;
	vehicles: number;
}
export interface EmissionSpecificResult {
	make: string;
	model: string;
	fuel: string;
	emissions: number;
	engineSize: number;
	year: number;
	colour: string;
}

export interface Emissions {
	range: string;
	total: number;
	beforeTotal: number;
	results: EmissionGeneralResult[];
	makes: string[];
	models: string[];
}

export interface colorType {
	name: string;
	total: number;
	unique: number;
}

export interface ValuationsData {
	[site: string]: {
		[date: string]:{
			vehicles: number;
			valuatedVehicles: number;
			price: number;
			averagePrice:number;
			maxPrice:number;
			minPrice:number;
		};
	}
}

export interface EmissionsData {
	[site: string]: Emissions[];
}

export interface VehicleData {
	[site: string]: {
		make: Make[];
		model: Model[];
		age: Age[];
		fuel: Fuel[];
		emissions: Emissions[];
		co2: CO2[];
		colorType: colorType[]
	};
}
