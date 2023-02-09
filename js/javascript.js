let loader=document.getElementById("loader");
window.addEventListener("load", function(){
    loader.style.display="block";
})

let products=[];
let cartItems=[];
let products1=[];
async function getProducts(){
 await   fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(json=>{
        products=json;
       displayProducts()
       loader.style.display="none";

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
function addNode(product){
    let productContainer=document.getElementById("productContainer");
     productContainer.innerHTML="";
     product.map((t) => {
        let productNode=`
         <div class="product" id="product${t.id}" >
         <div class="image" id="prod"><img src="${t.image}"/></div>
         <div class="title"><a href="#">${t.name}</a></div>
         <div class="price">Price: $${t.price}</div>
         <div class="rating"><div class="star"><i class="fa-solid fa-star"></i></div>${t.rating}/ 5</div><div class="count">(${t.count}) reviews</div>
         <div class="category">Category: ${t.cat}</div>
         <div class="description"><p>Description: ${t.des}</p></div>
         <div class="button"><button type="button" onclick="addToCart(${t.id})">ADD TO CART</button></div>
         </div>
         
        `
         productContainer.innerHTML+=productNode;})
  }

function displayProducts(){
    let productContainer=document.getElementById("productContainer");
    if(!productContainer)
        return ;
    productContainer.innerHTML="";
    products.map((t) => {
       let productNode=`
        <div class="product" id="product${t.id}" >
        <div class="image" id="prod"><img src="${t.image}"/></div>
        <div class="title"><a href="#">${t.title}</a></div>
        <div class="price">Price: $${t.price}</div>
        <div class="rating"><div class="star"><i class="fa-solid fa-star"></i></div>${t.rating.rate}/ 5</div><div class="count">(${t.rating.count}) reviews</div>
        <div class="category">Category: ${t.category}</div>
        <div class="description"><p>Description: ${t.description}</p></div>
        <div class="button"><button type="button" onclick="addToCart(${t.id})">ADD TO CART</button></div>
        </div>
        
       `
        productContainer.innerHTML+=productNode;
      let product={name:t.title,price:t.price ,ele:t.id,rating:t.rating.rate,des:t.description,cat:t.category,count:t.rating.count,image:t.image};     
      products1.push(product)  
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
if(!cartItems){
  cartItems=[];
}
const product=products.find(i=>i.id==id);
if(product){
    let cart=cartItems.find((a)=>a.id==id)
    if(cart){
        cartItems=cartItems.map((b)=>{
            if(b.id==id){
                const uQuantity=b.quantity+1;
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
cartCount();
}

function updateInCart(){
    let item=document.getElementById("items");
    if(!item)
        return ;
    let cart = sessionStorage.getItem('product') ? JSON.parse(sessionStorage.getItem('product')) : [];


    item.innerHTML="";
    cart.map((t)=>{
        let cartNode=` <div class="cartItem" id="cartItem${t.id}">
       <div  class="imageCont" > 
       <div class="cartItemImage" id="prod"><img src="${t.image}"/><a class="remove" onclick="remove(${t.id})"><i class="fa-sharp fa-solid fa-xmark"></i></a></div>
       <div style=" text-align: center;margin-bottom: 9px;"><a href="#" class="titleCart">${t.title}</a></div>
       
       </div>
        <div class="cartItemPrice">$${t.price}</div>
        <div class="button1"><button id="subQuantity" ${t.quantity===1 ? "disabled":""} onclick="reduce(${t.id})">-</button><label class="quant" id="qaunt">${t.quantity}</label><button id="addQuantity" onclick="add(${t.id})">+</button></div>
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
    cartCount()
  }
  function total(){
    let cart=getCart();
    if(!cart){
        return
    }
    const sum=cart.reduce((accum,currValue)=>{
       return accum+=currValue.total;
    },0)
    if(! document.getElementById("price")){
        return
    }
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

    let searchInput=document.getElementById("searchBarInput");
  searchInput.addEventListener("keyup", (e) =>{
    let value=e.target.value.toLowerCase();

  products1.forEach(product=>{
    let toBeSearched =JSON.stringify(product).toLowerCase();
        let visible=toBeSearched.includes(value);


        if(visible){
        document.querySelector("#product"+product.ele).style.display="block";
    
        }
        else{
           document.querySelector("#product"+product.ele).style.display="none";
         
        }
       
     })
 
    })
function filter(){
    let product=products1;
    let option=document.getElementById("sortB");
        if(option.value=='phtl'){
         let c=product.sort((a,b)=>a.price < b.price ? 1 : -1)
         addNode(c);
     }
       if(option.value=='plth'){
        let c=product.sort((a,b)=>a.price > b.price ? 1 : -1)
        addNode(c);
    
    }
         if(option.value=='rhtl'){
            let c=product.sort((a,b)=>a.rating < b.rating ? 1 : -1)
            addNode(c);
          
    }
         if(option.value=='rlth'){
            let c=product.sort((a,b)=>a.rating > b.rating ? 1 : -1)
            addNode(c);
        
    }
    else{
  return;
    }
  
        }
        
   function filterByPrice(){
    let filtered=[];
    let optionP=document.getElementById("sortC");
    let optionR=document.getElementById("sortD");
    let product=products1;
    if(optionR.value=="4"){
        filtered= product.filter((a)=>a.rating >= 4)
          addNode(filtered)
      }
     if(optionR.value=="3"){
      filtered= product.filter((a)=>a.rating >= 3 && a.rating<4)
           addNode(filtered)
       }
     if( optionR.value=="2"){
      filtered= product.filter((a)=>a.rating >= 2 && a.rating<3)
           addNode(filtered)
       }
     if(optionR.value=="1"){
      filtered= product.filter((a)=>a.rating >= 1 && a.rating<2)
           addNode(filtered)
       }
    if(optionP.value=="0-100"){
        filtered= product.filter((a)=>a.price>0 && a.price <= 100)
        addNode(filtered)
        filterByRating(filtered)
    }
    if(optionP.value=="100-500"){
         filtered= product.filter((a)=>a.price>100 && a.price <= 500)
         addNode(filtered)
         filterByRating(filtered)
     }
     if(optionP.value=="500-1000"){
        filtered= product.filter((a)=>a.price>500 && a.price <= 1000)
        addNode(filtered)
        filterByRating(filtered)
     }
    
     else{
        return;
     }


    
     
   }
     function filterByRating(f){
        let optionR=document.getElementById("sortD");

        if(f && optionR.value=="4"){
          let  updatedFiltered= f.filter((a)=>a.rating >= 4)
            addNode(updatedFiltered)
        }
       if(f && optionR.value=="3"){
        let  updatedFiltered= f.filter((a)=>a.rating >= 3 && a.rating<4)
             addNode(updatedFiltered)
         }
       if( f && optionR.value=="2"){
        let  updatedFiltered= f.filter((a)=>a.rating >= 2 && a.rating<3)
             addNode(updatedFiltered)
         }
       if(f && optionR.value=="1"){
        let  updatedFiltered= f.filter((a)=>a.rating >= 1 && a.rating<2)
             addNode(updatedFiltered)
         }
         else{
            return;
         }
     }
    
  
