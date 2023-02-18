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
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },

    {
        elementType: 'div',
        attributes: {class:'itemMenu'},
        appendChild: '.content',
    },
    
];


function createElementsDomMenu(arr) {
    
    arr.forEach(elementObject => {
        
        createElementsDom(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}