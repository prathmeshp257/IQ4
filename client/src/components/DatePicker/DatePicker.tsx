import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import React, { CSSProperties, FC } from "react";
import { isMobile } from "react-device-detect";

const { RangePicker } = AntDatePicker;

export declare type EventValue<Date> = Date;

interface DatePickerProps {
	values?: any;
	onChange: (values: any) => void;
	style?: CSSProperties;
	minDate?: Date;
	maxDate?: Date;
	onCalendarChange?: (values: any) => void;
	disabled?: boolean;
	onOpenChange?: (open: any) => void;
}

const enabledDate = (current: any, min?: Date, max?: Date) => {
	const date = dayjs(current).toDate()?.valueOf();

	const minVal = min?.valueOf();
	const maxVal = max?.valueOf();

	if (minVal && maxVal) {
		return date > minVal && date < maxVal;
	}

	if (minVal) {
		return date > minVal;
	}

	if (maxVal) {
		return date < maxVal;
	}

	return true;
};

export const DatePicker: FC<DatePickerProps> = ({ values, onChange, style, minDate, maxDate, onCalendarChange, disabled = false, onOpenChange }) => {
	return (
		<RangePicker
			disabled={disabled}
			disabledDate={(current) => !enabledDate(current, minDate, maxDate)}
			showTime={isMobile}
			value={values}
			onChange={onChange}
			style={style}
			format="DD/MM/YYYY"
			onCalendarChange={onCalendarChange}
			onOpenChange={onOpenChange}
		/>
	);
};
