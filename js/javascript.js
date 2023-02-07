
let products=[];
let cartItems=[];
async function getProducts(){
 await   fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>{
        products=json;
       displayProducts()
    })
 
  
}
function getCart(){
    return getSessionStorage("product")
}
function getSessionStorage(key){
    const data=sessionStorage.getItem(key);
    if(data){
        return JSON.parse(data);
    }
}

function displayProducts(){
    let productContainer=document.getElementById("productContainer");
    if(!productContainer)
        return ;
    productContainer.innerHTML="";
    products.map((t) => {
       let productNode=`
        <div class="product">
        <div class="image" id="prod"><img src="${t.image}"/></div>
        <div class="title"><a href="#">${t.title}</a></div>
        <div class="price">Price: $${t.price}</div>
        <div class="category">Category: ${t.category}</div>
        <div class="description"><p>Description: ${t.description}</p></div>
        <div class="button"><button type="button" onclick="addToCart(${t.id})">ADD TO CART</button></div>
        </div>
        
       `
        productContainer.innerHTML+=productNode;
        
    });
}

getProducts()
updateInCart();
cartCount()

function moveToCart(){
    window.location.href="http://127.0.0.1:5500/cart.html";
}
function moveToStore(){
    window.location.href="http://127.0.0.1:5500/index.html";
}

function addToCart(id){
let cartItems=getCart();
console.log(cartItems);

if(!cartItems){
  cartItems=[];
}
console.log(cartItems)
const product=products.find(i=>i.id==id);
if(product){
    let cart=cartItems.find((a)=>a.id==id)
    if(cart){
        cartItems=cartItems.map((b)=>{
            if(b.id==id){
                const uQuantity=b.qauntity+1;
                return{...b,quantity:uQuantity,total:b.price*uQuantity};
            } else{
                return b;
            }
        })
    }
    else{
        cartItems.push({...product,quantity:1,total:product.price})
        sessionStorage.setItem("product",JSON.stringify(cartItems));
    
    }
    
}

sessionStorage.setItem("product",JSON.stringify(cartItems));
updateInCart();
}

function updateInCart(){
    let item=document.getElementById("items");
    if(!item)
        return ;
    let cart = sessionStorage.getItem('product') ? JSON.parse(sessionStorage.getItem('product')) : [];


    item.innerHTML="";
    cart.map((t)=>{
        let cartNode=` <div class="cartItem">
       <div style="width: 14%;"> 
       <div class="cartItemImage" id="prod"><img src="${t.image}"/></div>
       <div style=" text-align: center;margin-bottom: 9px;"><a href="#" class="titleCart">${t.title}</a></div>
       <div class="removeBtn"><button class="remove" onclick="remove(${t.id})">remove</button></div>
       </div>
        <div class="cartItemPrice">$${t.price}</div>
        <div class="button1"><button id="subQuantity" onclick="reduce(${t.id})">-</button><label class="quant" id="qaunt">${t.quantity}</label><button id="addQuantity" onclick="add(${t.id})">+</button></div>
        <div class="tot1"><label class="tot" >$${t.total.toFixed(2)}</label></div>
        </div>`
        item.innerHTML +=cartNode;
    })}


 
 function add(id){
    let cart = getCart();
   
for (let i = 0; i < cart.length; i++) {
  if (cart[i].id === id) {
  let inputValue = document.getElementsByClassName("quant").innerText;
  inputValue = ++cart[i].quantity;
  cart[i].total = cart[i].price * inputValue;
   }
 }
 sessionStorage.setItem("product",JSON.stringify(cart));
 updateInCart();
 total()
  
  }
  
 

function reduce(id){
    let cart = getCart();
for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
let inputValue = document.getElementsByClassName("quant").innerText;
inputValue = --cart[i].quantity;
cart[i].total = cart[i].price * inputValue;
if (cart[i].quantity <= 1) {
 cart[i].quantity = 1;
 cart[i].total = cart[i].price;
}

    }
 }
 sessionStorage.setItem("product",JSON.stringify(cart));
 updateInCart();
 total()
  }

  function remove(id){
    let cart=getCart();
    let filter= cart.filter((i)=> i.id !== id);
    sessionStorage.setItem("product",JSON.stringify(filter));
    updateInCart();
    total()
  }
  function total(){
    let cart=getCart();
    if(!cart){
        return
    }
    const sum=cart.reduce((accum,currValue)=>{
       return accum+=currValue.total;
    },0)
    document.getElementById("price").innerHTML="$"+sum.toFixed(2);
  }
  total()
  function cartCount(){
    let cart=getCart();
    if(!cart){
        return
    }
    let count=cart.length;
    let display=document.getElementById("lab");
    display.innerHTML=count;
  }
 