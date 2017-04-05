
const userLang = navigator.language || navigator.userLanguage;
const _lang = userLang.match(/^\D{2}/)[0];

export const translate ={
	ru: require('../i18/ru').default,
	ua: require('../i18/ua').default,
	en: require('../i18/en').default
};

export const lang = translate[_lang];