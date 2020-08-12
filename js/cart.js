const cartConatainer = document.getElementsByClassName("cart_container")[0];
const checkoutURL = `${sourceURL}${checkoutPath}`;
let cartItemList;
let freight = 60;
let sum = 0;
let checkoutSum = 0;
let deliveryTime = "";
let response;
let countrySelector = "Taiwan";
let paymentSelector = "credit_card";
let fbAccessTokenGet = JSON.parse(localStorage.getItem("fbAccessToken"));

function ajaxForPostOrder(data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", checkoutURL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + fbAccessTokenGet);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("success");
      response = JSON.parse(xhr.responseText).data;
      orderNo = response.number;
      location.href = `${thankyouPath}${orderNo}`;
    }
  };
  let sendData = JSON.stringify(data);
  xhr.send(sendData);
}

function ajaxForPostSignin(data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", signinPath, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Signin post success");
    }
  };
  let sendData = JSON.stringify(data);
  xhr.send(sendData);
}

function getDeliveryTime(time) {
  deliveryTime = time;
}

window.onload = function () {
  console.log(localStorage);
  if (localStorage.length !== 0) {
    cartItemList = JSON.parse(localStorage.getItem("cartItemList"));
    addToCartCount(cartItemList);
  }
  renderCart(cartItemList);
};

function renderCart(cartItemList) {
  let total = 0;
  const cartTemplate = `
    <div class="cart_item_title">
        <div class="title_item forlargescreen">購物車(${
          cartItemList == undefined ? 0 : cartItemList.length
        })</div>
        <div class="title_num forlargescreen">數量</div>
        <div class="title_price forlargescreen">單價</div>
        <div class="title_subtotal forlargescreen">小計</div>
        <img class="title_remove" />
    </div>
    <div id="cart_item_box">
    </div>
    <div class="post">
        <div class="country">
            <div class="post_title">配送國家</div>
            <select class="country_select" onchange="selectCountry();">
                <option selected="selected" value="Taiwan">台灣或離島</option>
                <option value="Asia">其他亞洲</option>
                <option value="Europe">歐洲</option>
                <option value="America">美洲</option>
                <option value="Oceania">大洋洲</option>
                <option value="Afirica">非洲</option>
                <option value="Antarctica">南極洲</option>
            </select>
        </div>
        <div class="pay">
            <div class="post_title">付款方式</div>
            <select class="pay_select" onchange="selectPayment();">
                <option selected="selected" value="credit_card">信用卡付款</option>
                <option value="cash_on_delivery">宅配到府付款</option>
            </select>
        </div>
    </div>
    <div class="reminder">
        ※ 提醒您：<br>
        ● 請填寫正確收件人資訊，避免包裹配送不達<br>
        ● 請填寫正確收件人姓名 ( 與證件相符 )，避免無法領取<br>
    </div>
    <div class="recipient_info">
        <div class="recipient_title">收件資料</div>
        <div class="info">
            <div class="row">收件人姓名</div>
            <input type="text" id="personname" class="personal_detail">
        </div>
        <div class="info_note">務必填寫完整收件人姓名，避免包裹無法順利簽收</div>
        <div class="info">
          <div class="row">手機</div>
              <input type="text" id="phone" class="personal_detail" placeholder="限輸入數字">
              <div id="phone_check"></div>
        </div>
        <div class="info">
            <div class="row">Email</div>
            <input type="text" id="email" class="personal_detail">
        </div>
        <div id ="alert"></div>
        <div class="info">
            <div class="row">地址</div>
            <input type="text" id="address" class="personal_detail">
        </div>
        <div class="info">
            <div class="row">配送時間</div>
            <div class="time_radio">
                <label for="morning">
                  <input type="radio" class="radio" name="delivery_time" value="morning" onclick="getDeliveryTime(this.value)" checked="checked">
                    8:00 - 12:00
                </label>
                <label for="noon">
                  <input type="radio" class="radio" name="delivery_time" value="afternoon" onclick="getDeliveryTime(this.value)">
                    14:00 - 16:00
                </label>
                <label for="anytime">
                  <input type="radio" class="radio" name="delivery_time" value="anytime" onclick="getDeliveryTime(this.value)">
                    不指定
                </label>
            </div>
        </div>
    </div>`;

  cartConatainer.innerHTML = cartTemplate;

  let payment = `
    <div class="confirm">
        <div class="row_confirm">總金額</div>
        NT.<div class="output" id="sum">0</div>
    </div>
    <div class="confirm">
        <div class="row_confirm">運費</div>
        NT.<div class="output">${freight}</div>
    </div>
    <div class="line"></div>
    <div class="confirm">
        <div class="row_confirm">應付金額</div>
        NT.<div class="output" id="checkoutSum">${total + freight}</div>
    </div>`;

  document.getElementsByClassName("payment_confirm")[0].innerHTML += payment;

  if (cartItemList == undefined || cartItemList.length == 0) {
    let noCartItem = `<div class="cart_item"
          style="text-align:center; color:red">購物車內無商品。請前往選購！</div>`;
    document.getElementById("cart_item_box").innerHTML += noCartItem;
    return;
  }

  for (let ix = 0; ix < cartItemList.length; ix++) {
    let subtotal = cartItemList[ix].price * cartItemList[ix].quantity;

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
              <input type="image" class="title_remove title_removesmall forsmallscreen" img src="imgs/cart-remove.png"
                 onclick="removeItem(${cartItemList[ix].id}, '${cartItemList[ix].color[0].code}', '${cartItemList[ix].size}')"/>
              </div>

          <div class="quantities">
              <div class="counter forsmallscreen">數量</div>
                <select class ="quantities_select"
                  onchange="selectQuantity(); calculateSum();">
                </select>
          </div>
          <div class="price">
              <div class="counter forsmallscreen">單價</div>
              NT.${cartItemList[ix].price}
          </div>
          <div class="subtotal">
              <div class="counter forsmallscreen">小計</div>
            NT.${subtotal}
          </div>
          <input type="image" class="title_remove forlargescreen" img src="imgs/cart-remove.png"
              onclick="removeItem(${cartItemList[ix].id}, '${cartItemList[ix].color[0].code}', '${cartItemList[ix].size}')"/>
      </div>`;

    document.getElementById("cart_item_box").innerHTML += cartItem;

    for (let iy = cartItemList[ix].stockquantity; iy >= 1; iy--) {
      const selector = document.createElement("option");
      selector.value = iy;
      selector.text = iy;
      if (iy == cartItemList[ix].quantity) {
        selector.setAttribute("selected", "");
      }
      document
        .getElementsByClassName("quantities_select")
        [ix].appendChild(selector);
    }

    total += subtotal;
  }

  document.getElementById("sum").innerHTML = `${total}`;
  document.getElementById("checkoutSum").innerHTML = `${total + freight}`;
  document.getElementById("phone").addEventListener("input", restrictNumbers);
  document.getElementById("email").addEventListener("blur", validateEmail);
  document.getElementById("email").addEventListener("input", validateEmailNone);
}

function restrictNumbers() {
  var numberCheck = this.value.replace(new RegExp(/[^\d]/, "ig"), "");
  this.value = numberCheck;
}

let isEmailValid;
function validateEmail() {
  const emailCheck = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailCheck.test(this.value)) {
    document.getElementById("alert").innerHTML="Email格式錯誤！";
    isEmailValid = false;
  }
}

function validateEmailNone(){
  isEmailValid = true;
  document.getElementById("alert").innerHTML="";
}

function selectQuantity() {
  for (let ix = 0; ix < cartItemList.length; ix++) {
    let quantity = document.getElementsByClassName("quantities_select")[ix]
      .value;
    document.getElementsByClassName("subtotal")[ix].innerHTML = `NT. ${
      quantity * cartItemList[ix].price
    }`;
    sum += quantity * cartItemList[ix].price;

    cartItemList[ix].stockquantity -= quantity;
    cartItemList[ix].quantity = quantity;
    localStorage.setItem("cartItemList", JSON.stringify(cartItemList));
  }
  checkoutSum = sum + freight;
}

function selectCountry() {
  let selector = document.getElementsByClassName("country_select")[0];
  countrySelector = selector.options[selector.selectedIndex].value;
}

function selectPayment() {
  let selector = document.getElementsByClassName("pay_select")[0];
  paymentSelector = selector.options[selector.selectedIndex].value;
}

function calculateSum() {
  document.getElementById("sum").innerHTML = "NT." + sum;
  document.getElementById("checkoutSum").innerHTML = "NT." + checkoutSum;
}

function removeItem(id, color, size) {
  console.log([id, color, size]);
  cartItemList = cartItemList.filter(
    (cartItem) =>
      cartItem.id !== id ||
      cartItem.color[0].code !== color ||
      cartItem.size !== size
  );
  localStorage.setItem("cartItemList", JSON.stringify(cartItemList));
  location.reload();
}

//TapPay
TPDirect.setupSDK(
  12348,
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);
TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "後三碼",
    },
  },
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.cvc": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
});

TPDirect.card.onUpdate(function (update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    // submitButton.removeAttribute('disabled')
  } else {
    // Disable submit Button to get prime.
    // submitButton.setAttribute('disabled', true)
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.cvc === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.cvc === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit() {
  console.log("submit");
  // event.preventDefault()
  if (!checkPersonalInfo()) {
    return;
  }
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("信用卡卡號輸入錯誤！");
    // alert('can not get prime')
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }

    alert("成功訂購！");
    //alert('get prime 成功，prime: ' + result.card.prime)
    renderRequestBody(result.card.prime);
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  });
}

function checkPersonalInfo() {
  if (document.getElementById("personname").value == "") {
    alert("請輸入收件人姓名!");
  } else if (document.getElementById("email").value == "") {
    alert("請輸入Email");
  } else if (document.getElementById("phone").value == "") {
    alert("請輸入手機號碼!");
  } else if (document.getElementById("address").value == "") {
    alert("請輸入收件地址!");
  }else if (!isEmailValid){
    alert("Email格式錯誤！");
  }else {
    return true;
  }
}

function renderRequestBody(primeKey) {
  console.log(primeKey);
  let inputFields = document.getElementsByClassName("personal_detail");
  let orderDetail = {
    prime: primeKey,
    order: {
      shipping: countrySelector,
      payment: paymentSelector,
      subtotal: document.getElementById("checkoutSum").innerHTML,
      freight: freight,
      total: document.getElementById("sum").innerHTML,
      recipient: {
        name: inputFields[0].value,
        phone: inputFields[1].value,
        email: inputFields[2].value,
        address: inputFields[3].value,
        time: deliveryTime,
      },
      list: cartItemList,
    },
  };

  let signinData = {
    provider: "facebook",
    access_token: fbAccessTokenGet,
  };

  ajaxForPostOrder(orderDetail);
  ajaxForPostSignin(signinData);
}
