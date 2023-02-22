import './style.css';
import jpFood1 from './japFood1.png';
import createElementsDom from './domCreation.js';

import { createElementsDomMenu, arrElementsMenu } from './menu.js';
import { createElementsDomContact, arrElementsContact } from './contact';

import anime from 'animejs/lib/anime.es.js';


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

    //  childs body

    {
        elementType: 'div',
        attributes: {class:'content'},
        appendChild: 'body',
    },

    {
        elementType: 'div',
        attributes: {class:'containerFloatMenu'},
        appendChild: 'body',
    },

    //  childs containerFloatMenu

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu menu'},
        innerText: 'Menu',
        appendChild: '.containerFloatMenu',

    },

    {
        elementType: 'div',
        attributes: {class:'containerNameRestaurant'},
        appendChild: '.containerFloatMenu',

    },
    {
        elementType: 'p',
        attributes: {class:'textFloatMenu'},
        innerText: 'Sakura Kitchen',
        appendChild: '.containerNameRestaurant',

    },

    //  child containerNameRestaurant

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu japLetters'},
        innerText: 'サクラキッチン',
        appendChild: '.containerNameRestaurant',

    },

    {
        elementType: 'p',
        attributes: {class:'textFloatMenu contact'},
        innerText: 'Contact',
        appendChild: '.containerFloatMenu',

    },

    //  Childs content

    {
        elementType: 'div',
        attributes: {class:'containerPresentation'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'containerImg'},
        appendChild: '.content',
    },

    //  Child containerPresentation

    

    {
        elementType: 'div',
        attributes: {class:'containerTitlePresentation'},
        appendChild: '.containerPresentation',
    },
    
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'ようこそ',
        appendChild: '.containerTitlePresentation',

    },
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'Yōkoso',
        appendChild: '.containerTitlePresentation',

    },

    {
        elementType: 'p',
        attributes: {class:'textPresentation'},
        innerText: 'Welcome to Sakura Kitchen, where we offer a wide range of authentic and delicious Japanese dishes that will tantalize your taste buds. From traditional sushi rolls to sizzling teppanyaki, our menu has something for everyone .\n\nWe use only the freshest and highest-quality ingredients to create our dishes, ensuring that every bite is packed with flavor and nutrition. Our experienced chefs are dedicated to perfecting each dish, so you can expect nothing but the best when you dine with us.\n\nIn addition to our mouth-watering cuisine, we offer a relaxing and welcoming atmosphere that\'s perfect for a romantic date night or a family dinner. Our friendly and attentive staff will make sure you have a memorable dining experience from start to finish.\n\nWhether you\'re a sushi lover or a fan of hearty ramen, we have something to satisfy every craving. Visit us today and experience the taste of Japan right here in our restaurant.',
        appendChild: '.containerPresentation',

    },

    // {
    //     elementType: 'div',
    //     attributes: {class:'btnMenu'},
    //     innerText: 'Menu',
    //     appendChild: '.containerPresentation',
    // },

    
    
];

const arrElementsHomeWithoutFloatMenu = [

    {
        elementType: 'div',
        attributes: {class:'containerPresentation'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'containerImg'},
        appendChild: '.content',
    },

    //  Child containerPresentation

    

    {
        elementType: 'div',
        attributes: {class:'containerTitlePresentation'},
        appendChild: '.containerPresentation',
    },
    
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'ようこそ',
        appendChild: '.containerTitlePresentation',

    },
    {
        elementType: 'p',
        attributes: {class:'titlePresentation japLetters'},
        innerText: 'Yōkoso',
        appendChild: '.containerTitlePresentation',

    },

    {
        elementType: 'p',
        attributes: {class:'textPresentation'},
        innerText: 'Welcome to Sakura Kitchen, where we offer a wide range of authentic and delicious Japanese dishes that will tantalize your taste buds. From traditional sushi rolls to sizzling teppanyaki, our menu has something for everyone .\n\nWe use only the freshest and highest-quality ingredients to create our dishes, ensuring that every bite is packed with flavor and nutrition. Our experienced chefs are dedicated to perfecting each dish, so you can expect nothing but the best when you dine with us.\n\nIn addition to our mouth-watering cuisine, we offer a relaxing and welcoming atmosphere that\'s perfect for a romantic date night or a family dinner. Our friendly and attentive staff will make sure you have a memorable dining experience from start to finish.\n\nWhether you\'re a sushi lover or a fan of hearty ramen, we have something to satisfy every craving. Visit us today and experience the taste of Japan right here in our restaurant.',
        appendChild: '.containerPresentation',

    },

    // {
    //     elementType: 'div',
    //     attributes: {class:'btnMenu'},
    //     innerText: 'Menu',
    //     appendChild: '.containerPresentation',
    // },
];

function domElementsHome(arr) {

    arr.forEach(elementObject => {
        
        createElementsDom(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
   
}   


const arrSection = ['home'];

function changeSection() {
    

    const menu = document.querySelector('.menu');
    const contact = document.querySelector('.contact');
    const home = document.querySelector('.containerNameRestaurant');    
    
   
    menu.addEventListener('click', () => {

        

        arrSection[0] == 'home' ? delContentHome(): delContentContact();
        // delContentHome();

        arrSection.pop()
        arrSection.push('menu');
        

        setTimeout(() => {
            
            createElementsDomMenu(arrElementsMenu);
            animationEntry();

        },250)

    })

    contact.addEventListener('click', () => {


        arrSection[0] == 'home' ? delContentHome(): delContentMenu();

        arrSection.pop()
        arrSection.push('contact');

        setTimeout(() => {
            
            createElementsDomContact(arrElementsContact);

        },200)
    })

    home.addEventListener('click', () => {

        arrSection[0] == 'menu' ? delContentMenu(): delContentContact();

        arrSection.pop()
        arrSection.push('menu');

        animationOut();
        
        setTimeout(() => {
            
            delContentMenu();

        },200)

        setTimeout(() => {
            
            domElementsHome(arrElementsHomeWithoutFloatMenu);

        },410)
    })

    



}

function animationEntry() {
    
     
    let items = document.querySelectorAll('.itemMenu');


    anime({
        targets: items,
        scale: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
        delay: anime.stagger(100, {from: 'first'}),

    });

}

function animationOut() {
    
    let items = document.querySelectorAll('.itemMenu');

    anime({
        targets: items,

        scale: [1,0],
        duration: 500,
        easing:'easeOutExpo',
        

    });
}

function delContentHome() {
    
    const content = document.querySelector('.content');
    const containerPresentation = document.querySelector('.containerPresentation');
    const containerImg = document.querySelector('.containerImg');

    containerPresentation.classList.add('blur-out')
    containerImg.classList.add('blur-out')


    setTimeout(() => {
        content.removeChild(containerPresentation);
        content.removeChild(containerImg);    

    },150)
    
}
function delContentMenu() {
    
    const content = document.querySelector('.content');
    const containerItemsMenu = document.querySelector('.containerItemsMenu');



    content.removeChild(containerItemsMenu);

}

function delContentContact() {
    
    const content = document.querySelector('.content');
    const containerItemsMenu = document.querySelector('.containerItemsMenu');



    content.removeChild(containerItemsMenu);

}


domElementsHome(arrElementsHome);

changeSection();



