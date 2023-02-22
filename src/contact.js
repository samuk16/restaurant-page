import createElementsDom from './domCreation.js';


const arrElementsContact = [

    // {
    //     elementType: 'div',
    //     attributes: {class:'content'},
    //     appendChild: 'body',
    // },
    {
        elementType: 'div',
        attributes: {class:'containerItemsContact'},
        appendChild: '.content',
    },

    //  childs containerItemsContact

    {
        elementType: 'div',
        attributes: {class:'itemsContact contact'},
        appendChild: '.containerItemsContact',
    },

    {
        elementType: 'div',
        attributes: {class:'itemsContact address'},
        appendChild: '.containerItemsContact',
    },

    //  child contact

    {
        elementType: 'p',
        attributes: {class:'titleContact'},
        innerText: 'Contact',
        appendChild: '.contact',
    },

    {
        elementType: 'div',
        attributes: {class:'containerInfoContact'},
        appendChild: '.contact',
    },
    
    {
        elementType: 'div',
        // attributes: {class:'containerInfoContact'},
        innerHTML: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        appendChild: '.containerInfoContact',
    },

    {
        elementType: 'p',
        attributes: {class:'pInfoContact'},
        innerText: '03-1234-5678',
        appendChild: '.containerInfoContact',
    },

    //  child address

    {
        elementType: 'p',
        attributes: {class:'titleAddress'},
        innerText: 'Address',
        appendChild: '.address',
    },

    {
        elementType: 'div',
        attributes: {class:'containerInfoAddress'},
        appendChild: '.address',
    },

    

    {
        elementType: 'div',
        // attributes: {class:'containerInfoContact'},
        innerHTML: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.576 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="#DBAF57" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        appendChild: '.containerInfoAddress',
    },

    {
        elementType: 'p',
        attributes: {class:'pInfoAddress'},
        innerText: '123 Main St, Sakura City, Japan',
        appendChild: '.containerInfoAddress',
    },


];

function createElementsDomContact(arr) {
    
    arr.forEach(elementObject => {
        
        createElementsDom(elementObject.elementType,elementObject.attributes,elementObject.innerHTML,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}

export {createElementsDomContact,arrElementsContact};