import dateFormat from 'dateformat';

export class Color {

	getColorByDate(date){
		return Color.const['hh'+dateFormat(new Date(date),'HH')]
	}

	static get const(){
		return {
			hh00: '#99BCFF',
			hh03: '#CCDDFF',
			hh06: '#CDF',
			hh09: '#E6EEFF',
			hh12: '#E6EEFF',
			hh15: '#E6EBF5',
			hh18: '#CCDDFF',
			hh21: '#B3CDFF'
		}
	}
}
