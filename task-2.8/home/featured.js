import { Products } from "../createproducts.js";
import { Cart } from "../cart.js";

class Create extends Products{
    constructor(place){
        super()
        this._place = place
    }
    get place(){
        return this._place
    }

    async appendElements(){
        let elements = await super.createArrayOfProducts()
        for(let i = 0;i<elements.length;i++){
            if(this.place.childElementCount < 3){
                let randomNum = Math.floor(Math.random()*elements.length)
                if(![...this.place.children].includes(elements[randomNum])){
                    this.place.append(elements[randomNum])
                }else{
                    continue
                }
            }
        }
    }
}

let myPage = new Create(document.querySelector(".products"))
myPage.appendElements()

let myCart = new Cart(document.querySelector(".cart"))
myCart.activateCart()