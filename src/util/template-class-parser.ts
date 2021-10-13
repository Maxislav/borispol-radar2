import { parseStringTemplateGenerator, evaluateParsedString } from 'string-template-parser';


const parseAngularStringTemplate = parseStringTemplateGenerator({
    VARIABLE_START: /^\$\{\s*/,
    VARIABLE_END: /^\s*\}/,
});

export const templateClassParse = (template: string, style: {[key: string]: any}) => {
    return evaluateParsedString(parseAngularStringTemplate(template), {
        ...style,
    } ,null)
}
