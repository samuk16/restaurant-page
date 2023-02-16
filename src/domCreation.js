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

export default createElementsDom;