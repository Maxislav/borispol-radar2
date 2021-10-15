import {ComponentOptions} from 'vue';
import Vue from 'vue';
import {parseStringTemplateGenerator} from 'string-template-parser';
import {evaluateParsedString} from 'string-template-parser';
export interface BorispolComponentData<V extends Vue = Vue> extends ComponentOptions<V> {
    style: { [key: string]: any },
}

const parseTemplate = parseStringTemplateGenerator({
    VARIABLE_START: /^class="\s*/,
    VARIABLE_END: /^\s*"/,
});

export const borispolComponent = <T extends Vue = Vue>(name: string, borispolComponentData: BorispolComponentData<T>) => {
    const d = {...borispolComponentData};
    delete d.style;
    const style: any = {};
    const pt = parseTemplate(d.template);
    Object.entries(borispolComponentData.style).map(([key, value]) => {
        style[key] = `class="${value}"`
    });
    const {variables} = pt;
    variables.forEach((v) => {
        if (!style[v.name]) {
            style[v.name] = `class="${v.name}"`
        }
    });
    const template = evaluateParsedString(
        parseTemplate(d.template),
        {...style},
        null,
    );
    return Vue.component(name, {
        ...borispolComponentData,
        template,
    })
};
