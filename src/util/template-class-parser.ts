import { evaluateStringTemplate } from 'string-template-parser';
export const templateClassParse = (template: string, style: {[key: string]: any}) => {
    return evaluateStringTemplate(template, {
        ...style,
    } ,null)
}
