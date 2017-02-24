import Vue from 'vue';
import template from './home-component.jade'
import UkbbComponent from '../ukbb-component/ukbb-component';
import IredComponent from '../ired-component/ired-component';

const HomeComponent = {
	template: template(),
	components:  {
		'ukbb-component': UkbbComponent,
		'ired-component': IredComponent
	}
};
export default HomeComponent;