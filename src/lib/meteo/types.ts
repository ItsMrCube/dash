export interface openMeteo {
	latitude: number;
	longitude: number;
	generationtime_ms: 0.1310110092163086;
	utc_offset_seconds: 0;
	timezone: 'GMT';
	timezone_abbreviation: 'GMT';
	elevation: number;
	current_units: {
		time: 'iso8601';
		interval: 'seconds';
		temperature_2m: '°C';
		relative_humidity_2m: '%';
		apparent_temperature: '°C';
		is_day: '';
		weather_code: 'wmo code';
	};
	current: {
		time: '2024-05-09T14:00';
		interval: 900;
		temperature_2m: 22.2;
		relative_humidity_2m: 55;
		apparent_temperature: 19.1;
		is_day: 1;
		weather_code: 51;
	};
}
