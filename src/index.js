import './style.css';
import createElementsDom from './domCreation.js';
import anime from 'animejs/lib/anime.es.js';

import { createElementsDomMenu, arrElementsMenu } from './menu.js';
import { createElementsDomContact, arrElementsContact } from './contact';



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
        
        if (arrSection[0] == 'home') {

            delContentHome()

            
        }else if(arrSection[0] == 'contact'){
            
            animationOutContact();
            setTimeout(() => {
                delContentContact();
            },200)


        }
        

        
        setTimeout(() => {
            
            createElementsDomMenu(arrElementsMenu);
            animationEntryMenu();

        },250)

        arrSection.pop()
        arrSection.push('menu');

    })

    contact.addEventListener('click', () => {

        if (arrSection[0] == 'menu') {

            
            animationOutMenu();

            setTimeout(() => {
                delContentMenu()
            },200)

        }else if(arrSection[0] == 'home'){
      
            delContentHome()
            
        }
        

        
        
        setTimeout(() => {
            
            createElementsDomContact(arrElementsContact);
            animationEntryContact();
        },200)

        arrSection.pop()
        arrSection.push('contact');
        
    })

    home.addEventListener('click', () => {
        
        if (arrSection[0] == 'menu') {

            animationOutMenu();

            setTimeout(() => {
                delContentMenu()
            },200)
           
            
        }else if(arrSection[0] == 'contact'){
            
            animationOutContact()

            setTimeout(() => {
                delContentContact();
            },200)

        }
        
        setTimeout(() => {
            
            domElementsHome(arrElementsHomeWithoutFloatMenu);
            animationEntryHome();
        },202)

        arrSection.pop()
        arrSection.push('home');

    })

    



}

function animationEntryHome() {
    

    anime({
        targets: ['.containerPresentation', '.containerImg'],
        opacity: [0, 1],
        filer: blur('12px', '0px'),
        easing:'easeInQuint',
        duration: 300,

    })

}

function animationEntryMenu() {
    
    let itemsMenu = document.querySelectorAll('.itemMenu');

    anime({
        targets: itemsMenu,
        scale: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
        delay: anime.stagger(100, {from: 'first'}),

    });

}

function animationOutMenu() {
    
    anime({
        targets: '.containerItemsMenu',

        opacity:[1, 0],
        duration: 500,
        easing: 'easeOutBack',        

    });
}

function animationEntryContact() {  
     
    let itemsContact = document.querySelectorAll('.itemsContact');

    anime({
        targets: itemsContact,
        scale: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
        delay: anime.stagger(100, {from: 'first'}),

    });

}

function animationOutContact() {
    
    anime({
        targets: '.containerItemsContact',
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutBack',

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
    const containerItemsContact = document.querySelector('.containerItemsContact');



    content.removeChild(containerItemsContact);

}


domElementsHome(arrElementsHome);
animationEntryHome();
changeSection();



