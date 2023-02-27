"use strict";
(self["webpackChunkrestaurant_page"] = self["webpackChunkrestaurant_page"] || []).push([["contact"],{

/***/ "./src/contact.js":
/*!************************!*\
  !*** ./src/contact.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrElementsContact": () => (/* binding */ arrElementsContact),
/* harmony export */   "createElementsDomContact": () => (/* binding */ createElementsDomContact)
/* harmony export */ });
/* harmony import */ var _domCreation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domCreation.js */ "./src/domCreation.js");



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
        
        (0,_domCreation_js__WEBPACK_IMPORTED_MODULE_0__["default"])(elementObject.elementType,elementObject.attributes,elementObject.innerHTML,elementObject.innerText,document.querySelector(elementObject.appendChild));
        
    });
}



/***/ }),

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

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/contact.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFjdC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQWlEOzs7QUFHakQ7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEM7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLHFCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDZCQUE2QjtBQUNsRDtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EscUJBQXFCLDZCQUE2QjtBQUNsRDtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBLHdCQUF3Qiw2QkFBNkI7QUFDckQ7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTtBQUNBLEtBQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSwyREFBaUI7QUFDekI7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxpQkFBaUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9zcmMvY29udGFjdC5qcyIsIndlYnBhY2s6Ly9yZXN0YXVyYW50LXBhZ2UvLi9zcmMvZG9tQ3JlYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUVsZW1lbnRzRG9tIGZyb20gJy4vZG9tQ3JlYXRpb24uanMnO1xuXG5cbmNvbnN0IGFyckVsZW1lbnRzQ29udGFjdCA9IFtcblxuICAgIC8vIHtcbiAgICAvLyAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgIC8vICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRlbnQnfSxcbiAgICAvLyAgICAgYXBwZW5kQ2hpbGQ6ICdib2R5JyxcbiAgICAvLyB9LFxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2NvbnRhaW5lckl0ZW1zQ29udGFjdCd9LFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250ZW50JyxcbiAgICB9LFxuXG4gICAgLy8gIGNoaWxkcyBjb250YWluZXJJdGVtc0NvbnRhY3RcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1zQ29udGFjdCBjb250YWN0J30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zQ29udGFjdCcsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J2l0ZW1zQ29udGFjdCBhZGRyZXNzJ30sXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckl0ZW1zQ29udGFjdCcsXG4gICAgfSxcblxuICAgIC8vICBjaGlsZCBjb250YWN0XG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGl0bGVDb250YWN0J30sXG4gICAgICAgIGlubmVyVGV4dDogJ0NvbnRhY3QnLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWN0JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVySW5mb0NvbnRhY3QnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuY29udGFjdCcsXG4gICAgfSxcbiAgICBcbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgICAgICAgLy8gYXR0cmlidXRlczoge2NsYXNzOidjb250YWluZXJJbmZvQ29udGFjdCd9LFxuICAgICAgICBpbm5lckhUTUw6ICc8c3ZnIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTMgNUMzIDMuODk1NDMgMy44OTU0MyAzIDUgM0g4LjI3OTI0QzguNzA5NjcgMyA5LjA5MTgxIDMuMjc1NDMgOS4yMjc5MiAzLjY4Mzc3TDEwLjcyNTcgOC4xNzcyMUMxMC44ODMxIDguNjQ5MzIgMTAuNjY5NCA5LjE2NTMxIDEwLjIyNDMgOS4zODc4N0w3Ljk2NzAxIDEwLjUxNjVDOS4wNjkyNSAxMi45NjEyIDExLjAzODggMTQuOTMwOCAxMy40ODM1IDE2LjAzM0wxNC42MTIxIDEzLjc3NTdDMTQuODM0NyAxMy4zMzA2IDE1LjM1MDcgMTMuMTE2OSAxNS44MjI4IDEzLjI3NDNMMjAuMzE2MiAxNC43NzIxQzIwLjcyNDYgMTQuOTA4MiAyMSAxNS4yOTAzIDIxIDE1LjcyMDhWMTlDMjEgMjAuMTA0NiAyMC4xMDQ2IDIxIDE5IDIxSDE4QzkuNzE1NzMgMjEgMyAxNC4yODQzIDMgNlY1WlwiIHN0cm9rZT1cIiNEQkFGNTdcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIvPjwvc3ZnPicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckluZm9Db250YWN0JyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ3AnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7Y2xhc3M6J3BJbmZvQ29udGFjdCd9LFxuICAgICAgICBpbm5lclRleHQ6ICcwMy0xMjM0LTU2NzgnLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJbmZvQ29udGFjdCcsXG4gICAgfSxcblxuICAgIC8vICBjaGlsZCBhZGRyZXNzXG5cbiAgICB7XG4gICAgICAgIGVsZW1lbnRUeXBlOiAncCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczondGl0bGVBZGRyZXNzJ30sXG4gICAgICAgIGlubmVyVGV4dDogJ0FkZHJlc3MnLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5hZGRyZXNzJyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVySW5mb0FkZHJlc3MnfSxcbiAgICAgICAgYXBwZW5kQ2hpbGQ6ICcuYWRkcmVzcycsXG4gICAgfSxcblxuICAgIFxuXG4gICAge1xuICAgICAgICBlbGVtZW50VHlwZTogJ2RpdicsXG4gICAgICAgIC8vIGF0dHJpYnV0ZXM6IHtjbGFzczonY29udGFpbmVySW5mb0NvbnRhY3QnfSxcbiAgICAgICAgaW5uZXJIVE1MOiAnPHN2ZyB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0xNy42NTY5IDE2LjY1NjlDMTYuNzIwMiAxNy41OTM1IDE0Ljc2MTYgMTkuNTUyMSAxMy40MTM4IDIwLjg5OTlDMTIuNjMyNyAyMS42ODEgMTEuMzY3NyAyMS42ODE0IDEwLjU4NjYgMjAuOTAwM0M5LjI2MjM0IDE5LjU3NiA3LjM0MTU5IDE3LjY1NTMgNi4zNDMxNSAxNi42NTY5QzMuMjE4OTUgMTMuNTMyNyAzLjIxODk1IDguNDY3MzQgNi4zNDMxNSA1LjM0MzE1QzkuNDY3MzQgMi4yMTg5NSAxNC41MzI3IDIuMjE4OTUgMTcuNjU2OSA1LjM0MzE1QzIwLjc4MSA4LjQ2NzM0IDIwLjc4MSAxMy41MzI3IDE3LjY1NjkgMTYuNjU2OVpcIiBzdHJva2U9XCIjREJBRjU3XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48cGF0aCBkPVwiTTE1IDExQzE1IDEyLjY1NjkgMTMuNjU2OSAxNCAxMiAxNEMxMC4zNDMxIDE0IDkgMTIuNjU2OSA5IDExQzkgOS4zNDMxNSAxMC4zNDMxIDggMTIgOEMxMy42NTY5IDggMTUgOS4zNDMxNSAxNSAxMVpcIiBzdHJva2U9XCIjREJBRjU3XCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiLz48L3N2Zz4nLFxuICAgICAgICBhcHBlbmRDaGlsZDogJy5jb250YWluZXJJbmZvQWRkcmVzcycsXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgZWxlbWVudFR5cGU6ICdwJyxcbiAgICAgICAgYXR0cmlidXRlczoge2NsYXNzOidwSW5mb0FkZHJlc3MnfSxcbiAgICAgICAgaW5uZXJUZXh0OiAnMTIzIE1haW4gU3QsIFNha3VyYSBDaXR5LCBKYXBhbicsXG4gICAgICAgIGFwcGVuZENoaWxkOiAnLmNvbnRhaW5lckluZm9BZGRyZXNzJyxcbiAgICB9LFxuXG5cbl07XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRzRG9tQ29udGFjdChhcnIpIHtcbiAgICBcbiAgICBhcnIuZm9yRWFjaChlbGVtZW50T2JqZWN0ID0+IHtcbiAgICAgICAgXG4gICAgICAgIGNyZWF0ZUVsZW1lbnRzRG9tKGVsZW1lbnRPYmplY3QuZWxlbWVudFR5cGUsZWxlbWVudE9iamVjdC5hdHRyaWJ1dGVzLGVsZW1lbnRPYmplY3QuaW5uZXJIVE1MLGVsZW1lbnRPYmplY3QuaW5uZXJUZXh0LGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudE9iamVjdC5hcHBlbmRDaGlsZCkpO1xuICAgICAgICBcbiAgICB9KTtcbn1cblxuZXhwb3J0IHtjcmVhdGVFbGVtZW50c0RvbUNvbnRhY3QsYXJyRWxlbWVudHNDb250YWN0fTsiLCJmdW5jdGlvbiBjcmVhdGVFbGVtZW50c0RvbShlbGVtZW50VHlwZSxhdHRyaWJ1dGVzLGlubmVySFRNTCxpbm5lclRleHQsYXBwZW5kQ2hpbGQpIHtcbiAgICBcbiAgICBpZihlbGVtZW50VHlwZSl7XG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50VHlwZSk7XG4gIFxuICAgICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcyl7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LGF0dHJpYnV0ZXNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbm5lckhUTUwpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MPSBpbm5lckhUTUw7XG5cbiAgICAgICAgfSAgICBcbiAgICAgICAgaWYgKGlubmVyVGV4dCkge1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lclRleHQgPSBpbm5lclRleHQ7XG5cbiAgICAgICAgfVxuICAgICAgICBpZihhcHBlbmRDaGlsZCkge1xuICAgICAgICAgICAgYXBwZW5kQ2hpbGQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBcblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gICAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUVsZW1lbnRzRG9tOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==