let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () => {
	cart.classList.add("active");
};

closeCart.onclick = () => {
	cart.classList.remove("active");
};

if (document.readyState == "loading"){
	document.addEventListener("DOMContentLoaded", ready);
} else {
	ready();	
}

function ready(){
	var removeButtons = document.getElementsByClassName("cart-remove");
	console.log(removeButtons);
	for (var i = 0; i < removeButtons.length; i++){
		var button = removeButtons[i];
		button.addEventListener("click", removeItem);
	}
	var quantityInputs = document.getElementsByClassName("cart-quantity");
	for (var i = 0; i < quantityInputs.length; i++){
		var input = quantityInputs[i];
		input.addEventListener("change", quantityChanged);
	}
	var addCart = document.getElementsByClassName("add-cart");
	for (var i = 0; i < addCart.length; i++){
		var button = addCart[i];
		button.addEventListener("click", addCartClicked);
	}
	document
		.getElementsByClassName("btn-buy")[0]
		.addEventListener("click", buyButtonClicked);
}

function buyButtonClicked(){
	alert("Ordered Successfully! We will confirm the car specifications with you by WhatsApp.")
	var cartContent = document.getElementsByClassName("cart-content")[0]
	while (cartContent.hasChildNodes()){
		cartContent.removeChild(cartContent.firstChild);
	}
	updatetotal();
}

function removeItem(event){
	var buttonClicked = event.target;
	buttonClicked.parentElement.remove();
	updatetotal();
}

function quantityChanged(event){
	var input = event.target;
	if (isNaN(input.value) || input.value > 12){
		input.value = 1;
	}
	if (isNaN(input.value) || input.value <=0){
		input.value = 1;
	}
	updatetotal();
} 

function addCartClicked(event){
	var button = event.target;
	var shopProducts = button.parentElement;
	var title = shopProducts.getElementsByClassName("car-title")[0].innerText;
	var price = shopProducts.getElementsByClassName("price")[0].innerText;
	var carIMG = shopProducts.getElementsByClassName("car-img")[0].src;
	addToCart(title, price, carIMG);
	updatetotal();
}

function addToCart(title, price, carIMG){
	var cartShopBox = document.createElement("div");
	cartShopBox.classList.add("cart-box");
	var cartItems = document.getElementsByClassName("cart-content")[0];
	var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
	for (var i = 0; i < cartItemsNames.length; i++){
		if (cartItemsNames[i].innerText == title) {
			alert("You have already added this to your order!");
			return;
	}
}


	var cartBoxContent = `
							<img src="${carIMG}" alt="" class="cart-img">
						 	<div class="detail-box">		
								<div class="cart-product-title">${title}</div>
								<div class="cart-price">${price}</div>
								<select name="colors" id="colors">
  									<option value="black">Black</option>
  									<option value="white">White</option>
  									<option value="red">Red</option>
  									<option value="blue">Blue</option>
									<option value="yellow">Yellow</option>
								</select>
								<p>
								<input type="number" value="1" class="cart-quantity">Month(s)
						 	</div>
						 	<i class="bx bx-x cart-remove"></i>`;
	cartShopBox.innerHTML = cartBoxContent;
	cartItems.append(cartShopBox);
	cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click",removeItem);
	cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change",quantityChanged);
}

function updatetotal(){
	var cartContent = document.getElementsByClassName("cart-content")[0];
	var cartBoxes = cartContent.getElementsByClassName("cart-box");
	var total = 0;
	for (var i = 0; i < cartBoxes.length; i++){
		var cartBox = cartBoxes[i];
		var priceElement = cartBox.getElementsByClassName("cart-price")[0];
		var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
		var price = parseFloat(priceElement.innerText.replace("$", ""));
		var quantity = quantityElement.value;
		total = total + (price * quantity);
}
		document.getElementsByClassName("total-price")[0].innerText = "$" + total; 
}