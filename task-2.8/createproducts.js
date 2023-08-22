class Products{
    constructor(){
    }
    
    async getProductList(category){
        if(category === ""){
        let list = await fetch('https://fakestoreapi.com/products/')
        if(list.ok){
            let listJSON = await list.json()
            return await listJSON
        }else{
            alert("Something went wrong try to reload your page!")
        }
    }else{
        let list = await fetch(`https://fakestoreapi.com/products/category/${category}`)
        if(list.ok){
            let listJSON = await list.json()
            return await listJSON
        }else{
            alert("Something went wrong try to reload your page!")
        }
    }
}

    createElem=(image,name,price)=>{
        let product = document.createElement("article")
        let checkedName = name.split(" ").length > 4 ? name.split(" ").slice(0,3).join(" ") + "..." : name 
        product.className = "product"
        product.dataset.name = name
        product.dataset.price = price
        product.innerHTML =
            `<img class = "img-link" src="${image}">
            <a class="name" href="../products/index.html">${checkedName}</a>
            <p>${price}$</p>
            <button class = "add-to-cart">ADD TO CART</button>`
        return product
    }

    createElNoLink=(image,name,price,category)=>{
        let product = document.createElement("article")
        let checkedName = name.split(" ").length > 4 ? name.split(" ").slice(0,3).join(" ") + "..." : name 
        product.className = "product"
        product.dataset.name = name
        product.dataset.price = price
        product.dataset.category = category
        product.innerHTML =
            `<img class="img-link" src="${image}">
            <p class="name">${checkedName}</p>
            <p>${price}$</p>
            <button class = "add-to-cart">ADD TO CART</button>`
        return product
    }

    async createArrayOfProductsNoLink(category){
        let list = await this.getProductList(category)
        let elements = []
        for(let i = 0; i < list.length; i++){
            elements.push(this.createElNoLink(list[i].image, list[i].title, list[i].price))
        }
        return elements
    }

    async createArrayOfProducts(){
        let list = await this.getProductList("")
        let elements = []
        for(let i = 0; i < list.length; i++){
            elements.push(this.createElem(list[i].image, list[i].title, list[i].price, list[i].category))
        }
        return elements
    }

}

    export {Products}