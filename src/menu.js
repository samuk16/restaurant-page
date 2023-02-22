import createElementsDom from './domCreation.js';


const arrElementsMenu = [

    //  childs content
    {
        elementType: 'div',
        attributes: {class:'containerItemsMenu'},
        appendChild: '.content',
    },

    //  childs containerItemsMenu

    {
        elementType: 'div',
        attributes: {class:'itemMenu item1'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Sushi',
        appendChild: '.item1',
    },


    {
        elementType: 'div',
        attributes: {class:'itemMenu item2'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Ramen',
        appendChild: '.item2',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item3'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Udon',
        appendChild: '.item3',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item4'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Yakitori',
        appendChild: '.item4',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item5'},
        appendChild: '.containerItemsMenu',
    },

    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Tempura',
        appendChild: '.item5',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu item6'},
        appendChild: '.containerItemsMenu',
    },
    
    {
        elementType: 'div',
        attributes: {class:'containerNameItem'},
        innerText: 'Okonomiyaki',
        appendChild: '.item6',
    },

];


function createElementsDomMenu(arr) {
    
    arr.forEach(elementObject => {
        
        createElementsDom(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}



export {createElementsDomMenu,arrElementsMenu};