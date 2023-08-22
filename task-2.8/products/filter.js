import { Products } from "../createproducts.js";

import {Cart} from '../cart.js';

class Filter extends Products{
    constructor(products ,searchBar, nameFilter, priceFilter){
        super()
        this._products = products
        this._searchBar = searchBar
        this._nameFilter = nameFilter
        this._priceFilter = priceFilter
        }
        get products(){
            return this._products
        }

        get searchBar(){
            return this._searchBar
        }

        get searchBar(){
            return this._searchBar
        } 

        get nameFilter(){
            return this._nameFilter
        }

        get priceFilter(){
            return this._priceFilter
        }

       
        async appendElements(category){
            let elements = await super.createArrayOfProductsNoLink(category)
            elements.forEach(e => this.products.append(e))
            this.searchProducts()
        }

        changeValue=()=>{
            let priceSing = document.querySelector(".prise-count")
            priceSing.textContent = this._priceFilter.value + "$"
        }

        filterByCategory(category){
            let productList = [...this.products.children]
            if(category === "All"){
                productList.forEach(e=>e.remove())
                this.appendElements("")
            }else{
                productList.forEach(e=>e.remove())
                this.appendElements(category.toLowerCase())
            }
        }

        searchProducts=()=>{
            let okList = []
            let noList = []
            let productsList = [...this.products.children]
            if(this.searchBar.value.length>0 || this.priceFilter.value < 1000){
            for(let i=0;i < productsList.length;i++){
                if(productsList[i].dataset.name.includes(this.searchBar.value) && Number(productsList[i].dataset.price) < this.priceFilter.value){
                    okList.push(productsList[i])
                }else{
                    noList.push(productsList[i])
                }
            }
        }else{
            productsList.forEach(e=>{
                okList.push(e)
            })
        }
        this.showElements(okList,noList)
        }

        showElements=(okList,noList)=>{
            noList.forEach(e=>e.style.display = "none")
            okList.forEach(e=>e.style.display = "")
        }

        addListeners =()=>{
            window.addEventListener("load",()=>{
                this.changeValue()
                this.appendElements("")
            })
            this.priceFilter.addEventListener("input",this.changeValue)
            this.searchBar.addEventListener("input",this.searchProducts)
            this.priceFilter.addEventListener("input",this.searchProducts)
            this.nameFilter.addEventListener("click",(event)=>{
                if(event.target.tagName === "LI"){
                    this.filterByCategory(event.target.textContent)
                }
            })
        }
    }

let products = document.querySelector(".products")
let search = document.querySelector(".search-bar")
let nameFilters = document.querySelector(".categories")
let price = document.querySelector(".price-range")

let myFilter = new Filter(products,search,nameFilters,price)

myFilter.addListeners()

let cartButton = document.querySelector(".cart")
let cartProducts = new Cart(cartButton)

cartProducts.activateCart()
