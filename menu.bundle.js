"use strict";
(self["webpackChunkrestaurant_page"] = self["webpackChunkrestaurant_page"] || []).push([["menu"],{

/***/ "./src/domCreation.js":
/*!****************************!*\
  !*** ./src/domCreation.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createElementsDom(elementType,attributes,innerHTML,innerText,appendChild) {
    
    if(elementType){
        let element = document.createElement(elementType);
  
        if (attributes) {
            for (const key in attributes){
                element.setAttribute(key,attributes[key])
            }
        }

        if (innerHTML) {
            element.innerHTML= innerHTML;

        }    
        if (innerText) {
            element.innerText = innerText;

        }
        if(appendChild) {
            appendChild.appendChild(element);
            
        } 

        return element;
    }
    
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createElementsDom);

/***/ }),

/***/ "./src/menu.js":
/*!*********************!*\
  !*** ./src/menu.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrElementsMenu": () => (/* binding */ arrElementsMenu),
/* harmony export */   "createElementsDomMenu": () => (/* binding */ createElementsDomMenu)
/* harmony export */ });
/* harmony import */ var _domCreation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domCreation.js */ "./src/domCreation.js");



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
        
        (0,_domCreation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(elementObject.elementType,elementObject.attributes,null,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}





/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/menu.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0JpQjs7O0FBR2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwyQkFBMkI7QUFDaEQ7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBLHFCQUFxQix1QkFBdUI7QUFDNUM7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLHVCQUF1QjtBQUM1QztBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQix1QkFBdUI7QUFDNUM7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBLEtBQUs7O0FBRUw7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSwyREFBaUI7QUFDekI7QUFDQSxLQUFLO0FBQ0wiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9zcmMvZG9tQ3JlYXRpb24uanMiLCJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1wYWdlLy4vc3JjL21lbnUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudHNEb20oZWxlbWVudFR5cGUsYXR0cmlidXRlcyxpbm5lckhUTUwsaW5uZXJUZXh0LGFwcGVuZENoaWxkKSB7XG4gICAgXG4gICAgaWYoZWxlbWVudFR5cGUpe1xuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGUpO1xuICBcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSxhdHRyaWJ1dGVzW2tleV0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5uZXJIVE1MKSB7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTD0gaW5uZXJIVE1MO1xuXG4gICAgICAgIH0gICAgXG4gICAgICAgIGlmIChpbm5lclRleHQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJUZXh0ID0gaW5uZXJUZXh0O1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYoYXBwZW5kQ2hpbGQpIHtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gXG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICAgIFxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFbGVtZW50c0RvbTsiLCJpbXBvcnQgY3JlYXRlRWxlbWVudHNEb20gZnJvbSAnLi9kb21DcmVhdGlvbi5qcyc7XG5cblxuY29uc3QgYXJyRWxlbWVudHNNZW51ID0gW1xuXG4gICAgLy8gIGNoaWxkcyBjb250ZW50XG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVySXRlbXNNZW51J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRlbnQnLFxuICAgIH0sXG5cbiAgICAvLyAgY2hpbGRzIGNvbnRhaW5lckl0ZW1zTWVudVxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonaXRlbU1lbnUgaXRlbTEnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySXRlbXNNZW51JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZUl0ZW0nfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnU3VzaGknLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtMScsXG4gICAgfSxcblxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonaXRlbU1lbnUgaXRlbTInfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFpbmVySXRlbXNNZW51JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZUl0ZW0nfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnUmFtZW4nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtMicsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1NZW51IGl0ZW0zJ30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zTWVudScsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lck5hbWVJdGVtJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ1Vkb24nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtMycsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1NZW51IGl0ZW00J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zTWVudScsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lck5hbWVJdGVtJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ1lha2l0b3JpJyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuaXRlbTQnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtTWVudSBpdGVtNSd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc01lbnUnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJOYW1lSXRlbSd9LFxuICAgICAgICBpbm5lclRleHQ6ICdUZW1wdXJhJyxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuaXRlbTUnLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidpdGVtTWVudSBpdGVtNid9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJdGVtc01lbnUnLFxuICAgIH0sXG4gICAgXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVyTmFtZUl0ZW0nfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnT2tvbm9taXlha2knLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5pdGVtNicsXG4gICAgfSxcblxuXTtcblxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50c0RvbU1lbnUoYXJyKSB7XG4gICAgXG4gICAgYXJyLmZvckVhY2goZWxlbWVudE9iamVjdCA9PiB7XG4gICAgICAgIFxuICAgICAgICBjcmVhdGVFbGVtZW50c0RvbShlbGVtZW50T2JqZWN0LmVsZW1lbnRUeXBlLGVsZW1lbnRPYmplY3QuYXR0cmlidXRlcyxudWxsLGVsZW1lbnRPYmplY3QuaW5uZXJUZXh0LGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudE9iamVjdC5hcHBlbmRDaGlsZCkpO1xuICAgICAgICBcbiAgICB9KTtcbn1cblxuXG5cbmV4cG9ydCB7Y3JlYXRlRWxlbWVudHNEb21NZW51LGFyckVsZW1lbnRzTWVudX07Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9