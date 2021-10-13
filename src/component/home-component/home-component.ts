import template from './home-component.html'
import style from './home-component.less'
import {templateClassParse} from '../../util/template-class-parser';

const HomeComponent = {
    template: templateClassParse(template, style),
    data() {
        return {
            style,
        }
    },
};
export default HomeComponent;
