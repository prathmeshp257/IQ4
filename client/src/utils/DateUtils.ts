import moment from "moment";

const convertToSince = (time: number | string) => {
	return String(moment().subtract(time, "seconds").fromNow()).split("ago")[0].trim();
};

const getDateDifference = (start: any, end: any) => {
	const years = moment(end).diff(moment(start), 'year');
	const months = moment(end).subtract(years, 'year').diff(moment(start), 'month');
	const days = moment(end).subtract(12 * years + months, 'month').diff(moment(start), 'day')
	let duration = years ? years + ( years > 1 ? " Years " : " Year ") : "" ;
	duration = duration + (months ? months + ( months > 1 ? " Months " : " Month ") : "");
	duration = duration + (days ? days + ( days > 1 ? " Days " : " Day ") : "");
	return duration
}

const getTimeDifference = (start: any, end: any) => {
	const hours = moment(end).diff(moment(start), 'hours');
	const minutes = moment(end).subtract(hours, 'hours').diff(moment(start), 'minutes');
	const seconds = moment(end).subtract(60 * hours + minutes, 'minutes').diff(moment(start), 'seconds')
	let duration = hours ? hours + ( hours > 1 ? " Hours " : " Hour ") : "" ;
	duration = duration + (minutes ? minutes + ( minutes > 1 ? " Minutes " : " Minute ") : "");
	duration = duration + (seconds ? seconds + ( seconds > 1 ? " seconds " : " Second ") : "");
	return duration
}

export const DateUtils = {
	convertToSince,
	getDateDifference,
	getTimeDifference,
};
