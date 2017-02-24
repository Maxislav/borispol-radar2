import Vue from 'vue';

export default Vue.directive('img', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding) {
    // Focus the element
    
    console.log(binding)
    binding.value
    const img = new Image()
    img.onload = () =>{
    	el.appendChild(img)
    }
    img.src = binding.value

  }

});