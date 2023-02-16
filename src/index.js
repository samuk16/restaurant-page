import test from './test.js'
import './style.css';
import jpFood1 from './japFood1.png';

function component() {
        
        
    // const testDiv = document.querySelector('.content');

    const element = document.createElement('div');

    // const btn = document.createElement('button');
    
    // btn.innerHTML = 'click me';
    element.classList.add('nasheTest');

    // btn.onclick = test;

    const jpFood = new Image();

    jpFood.src = jpFood1;

    element.appendChild(jpFood);

    return element;
}

document.body.appendChild(component());

