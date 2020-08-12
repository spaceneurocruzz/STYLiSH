let orderNo = new URL(window.location.href).searchParams.get("orderNo");
document.getElementById("orderNo").innerHTML = orderNo;

let cartItemList;
const cartContainer = document.getElementById("cart_item_title");

window.onload = function () {
  console.log(localStorage);
  if (localStorage.length !== 0) {
    cartItemList = JSON.parse(localStorage.getItem("cartItemList"));
  }
  document.getElementsByClassName("thankyou_container")[0].style.display = 'none';
  setTimeout(showPage, 2000);
  renderCart(cartItemList);
};
 
function showPage() {
  document.getElementById("loader").style.display = 'none';
  document.getElementsByClassName("thankyou_container_none")[0].style.display = 'none';
  document.getElementsByClassName("thankyou_container")[0].style.display = 'block';
}

function renderCart() {
  for (let ix = 0; ix < cartItemList.length; ix++) {
    let subtotal = cartItemList[ix].price * cartItemList[ix].quantity;
    const cartTemplate = 
        `<div class="cart_item_title">
            <div class="title_item forlargescreen">購物車(${
            cartItemList == undefined ? 0 : cartItemList.length
            })</div>
            <div class="title_num forlargescreen">數量</div>
            <div class="title_price forlargescreen">單價</div>
            <div class="title_subtotal forlargescreen">小計</div>
        </div>`;

    cartContainer.innerHTML = cartTemplate;

    let cartItem = `
      <div class="cart_item">
          <div class="vairants">
              <div class="vairants_pic">
                  <img src="${cartItemList[ix].image}" />
              </div>
              <div class="vairants_detail">
                    ${cartItemList[ix].title}<br>
                    ${cartItemList[ix].id}<br>
                    <br>
                    顏色| ${cartItemList[ix].color[0].name}<br>
                    尺寸| ${cartItemList[ix].size}
              </div>
           </div>  

          <div class="quantities">
              <div class="counter forsmallscreen">數量</div>
              ${cartItemList[ix].quantity}
          </div>
          <div class="price">
              <div class="counter forsmallscreen">單價</div>
              NT.${cartItemList[ix].price}
          </div>
          <div class="subtotal">
              <div class="counter forsmallscreen">小計</div>
            NT.${subtotal}
          </div>
      </div>`;

    document.getElementById("cart_item_box").innerHTML += cartItem;
  }
}

let seconds = 10;

function countdown() {
    seconds = seconds - 1;
    if (seconds < 0) {
        window.location = "index.html";
        localStorage.clear();
    } else {
        document.getElementById("countdown").innerHTML = seconds;
        window.setTimeout("countdown()", 1500);
    }
}

countdown();