import test from './test.js'
import './style.css';
import jpFood1 from './japFood1.png';
import createElementsDom from './domCreation.js';


function component() {
        
    const element = document.createElement('div');

    
    element.classList.add('nasheTest');


    const jpFood = new Image();

    jpFood.src = jpFood1;

    element.appendChild(jpFood);

    return element;
}


const body = document.querySelector('body');

const arrElementsHome = [

    
    {
        elementType: 'div',
        attributes: {class:'content'},
        appendChild: 'body',
    },

    {
        elementType: 'div',
        attributes: {class:'containerImg'},
        appendChild: '.content',
    },


];

function domElementsHome(arr) {
    arr.forEach(elementObject => {
        
        createElementsDom(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}

domElementsHome(arrElementsHome);

