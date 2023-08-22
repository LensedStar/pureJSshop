
class Cart{
    constructor(cartButton){
        this._cartButton = cartButton
    }

    get cartButton(){
        return this._cartButton
    }
    
    get parseLocalStorage () {
        let storage = localStorage.getItem("cart")
        let stParse = JSON.parse(storage)
        return stParse 
    }

    getProdFromStorage=()=>{
        let products = localStorage.getItem("cart")
        let obj = JSON.parse(products)
        let productList = []
        if(obj === null || obj.length === 0){
           let empty = this.createEmptyMessage()
           return empty
        }
        obj.forEach(e => productList.push(this.createCartProduct(e.img,e.name,e.price,e.quantity)));
            return productList
    }

    createEmptyMessage=()=>{
        let empty = document.createElement("article")
        empty.className = "empty" 
        empty.innerHTML = `
        <h1>Your cart is empty :(</h1>
        `
        let emptyList = [empty]
        return emptyList
    }

    addEmptyMessage=()=>{
        let cart = document.querySelector(".cart-place-for-products")
        let emptyMessage = this.createEmptyMessage()
        if(this.parseLocalStorage.length < 1 || !this.parseLocalStorage){
            cart.append(...emptyMessage)
        }
    }

    createCartBlock=()=>{
        let cart = document.createElement("aside")
        cart.className = "cart-block"
        cart.innerHTML = `
            <span>
            <img class="exit-cart" src="../images/close.png">
            <h1 class="cart-banner">Your bag</h1>
            </span>
            <article class="cart-place-for-products"></article>
            <span class="cart-total">
            <h1 class="total">Total price:<span class="total-num"></span></h1>
            <button class="checkout">CHECKOUT</button>
            </span>
            `
            this.appendProductsToCart(cart)
    }
    
    createCartProduct(image,name,price,quantity){
        let product = document.createElement("article")
        let checkedName = name.split(" ").length > 4 ? name.split(" ").slice(0,3).join(" ") + "..." : name
        product.dataset.name = name
        product.className = "cart-product"
        product.innerHTML = `
            <span class="cart-product-img">
                <img src="${image}">
            </span>
            <span class = "cart-product-info"> 
                <h4>${checkedName}</h4>
                <p>$${price}</p>
                <p class="remove">remove</p>
            </span>
            <span class="cart-product-quantity">
                <img class="plus" src="../images/upload.png">
                <p class="quantity-num">${quantity}</p>
                <img class="minus" src="../images/uploaddown.png">
            </span>
        `
        return product
    }

    addToCart(element){
        let elementData = 
        {
            name : element.dataset.name,
            price : element.dataset.price,
            img :  [...element.children][0].src,
            quantity : 1,
            id: element.dataset.id
        }

        if(!localStorage.getItem("cart")){
            localStorage.setItem("cart",JSON.stringify([elementData]))
        }else{
            let oldObject = JSON.parse(localStorage.getItem("cart"))
            if(oldObject.some(e=>e.name == elementData.name)){
                let index = oldObject.findIndex(e=>e.name === elementData.name)
                oldObject[index].quantity = oldObject[index].quantity +=1  
                localStorage.setItem("cart",JSON.stringify(oldObject))
            }else{
                oldObject.push(elementData)
                localStorage.setItem("cart",JSON.stringify(oldObject))
            }
        }
        this.changeValueOnLogo()
        this.add
    }

    appendProductsToCart=(cart)=>{
        let placeForProducts = cart.querySelector('.cart-place-for-products');
        let products = [...this.getProdFromStorage()]
        products.forEach(e=>placeForProducts.append(e))
        document.querySelector("body").append(cart)
        this.addListenersAfterOpen()
    }

    closeCart =()=>{
        document.querySelector(".cart-block").remove()
    }
    
    removeProduct=(element)=>{
        let storage = this.parseLocalStorage
        for(let i = 0; i < storage.length; i++){
            if(storage[i].name === element.dataset.name){
                storage.splice(i,1)
                localStorage.setItem("cart",JSON.stringify(storage))
                element.remove()
                this.addEmptyMessage()
                this.setTotalPrise()
            }
        }   
    }

    changeValueOnLogo=()=>{
        let cartNum = document.querySelector(".cart").children[1]
        let quantity = 0
        if(this.parseLocalStorage){
            for(let i = 0; i < this.parseLocalStorage.length;i++){
               quantity += this.parseLocalStorage[i].quantity 
            }
            cartNum.innerText = quantity > 0 ? quantity:""
        }
    }

    changeQuantity=(el,operator)=>{
        let storage = this.parseLocalStorage
        let element = el.closest(".cart-product")
        for(let i=0;i<storage.length;i++){
            if(storage[i].name === element.dataset.name && operator === "plus"){
                storage[i].quantity += 1
                localStorage.setItem("cart", JSON.stringify(storage))
                el.nextElementSibling.innerText = storage[i].quantity 
            }else if(storage[i].name === element.dataset.name && operator === "minus"){
                if(storage[i].quantity > 1){
                    storage[i].quantity -= 1
                    localStorage.setItem("cart",JSON.stringify(storage))
                    el.previousElementSibling.innerText = storage[i].quantity
                }else{
                this.removeProduct(element)
            }
            }
        }
    }

    setTotalPrise=()=>{
        let storage = this.parseLocalStorage
        let showedPrise = document.querySelector(".total-num")
        let totalPrise = 0
        let productPrise = 0
        if(showedPrise){
            for(let i = 0;i<storage.length;i++){
                productPrise = (storage[i].price*100) * (storage[i].quantity)
                totalPrise += productPrise
            }
            totalPrise = totalPrise === 0? 0:totalPrise/100
            showedPrise.innerText = `${totalPrise}$`
        }
    }

    addListenersAfterOpen=()=>{
        let cartBlock = document.querySelector(".cart-block")
        cartBlock.addEventListener("click",(event)=>{
            if(event.target.className === "exit-cart"){
                this.closeCart()
                this.changeValueOnLogo()
            }
        })
        cartBlock.addEventListener("click",(event)=>{
            if(event.target.className === "remove"){
                this.removeProduct(event.target.closest(".cart-product"))
            }
            if(event.target.className === "plus"){
                this.changeQuantity(event.target, "plus")
            }
            if(event.target.className === "minus"){
                this.changeQuantity(event.target, "minus")
            }
            if(event.target.event != "remove"){
                this.setTotalPrise()
            }
        })

    }

    activateCart=()=>{
        this.cartButton.addEventListener('click',(event)=>{
            if(event){
            this.createCartBlock()
            this.setTotalPrise()
            }
        });
        
        document.body.addEventListener("click",(event)=>{
            if(event.target.className === "add-to-cart"){
                this.addToCart(event.target.closest(".product"))
            }
        })

        window.addEventListener("load",this.changeValueOnLogo)
    }
}

export {Cart}