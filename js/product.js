const productItemConatainer = document.getElementsByClassName(
  "product_item_container"
)[0];

let productId = new URL(window.location.href).searchParams.get("id");
let colorChoose = document.getElementsByClassName("colorbox");
let response;
let colorVal = "";
let sizeVal = "";
let stockVal = 1;
let countVal = "";
let cartItemList = getCart() || [];
let cartItemArray = [];
let originStockVal;

function getCart() {
  return JSON.parse(localStorage.getItem("cartItemList"));
}

window.onload = function () {
  if (localStorage.length !== 0) {
    let cartItemList = getCart();
    cartItemList.forEach((cartItem) => {
      cartItemArray.push(cartItem);
    });
    addToCartCount(cartItemArray);
  }
};

function ajaxForDetails(src) {
  isLoad = true;
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      response = data.data;
      console.log(response);
      renderProduct(response);
    } else if (xhr.status === 400) {
      console.log("Error");
    }
  };
  xhr.open("GET", src);
  xhr.send();
}

function renderProduct(response) {
  productId = response.id;
  const productItemTemplate = `
    <div class="product_item_container_up">
        <img class="flex" src=${response.main_image}>
        <div class="flex marginforsmallscreen">
            <p class="item_title">${response.title}</p>
            <p class="item_id">${response.id}</p>
            <p class="item_price">TWD. ${response.price}</p>
            </hr>
            <div class="item_colors" id="colors"><p>顏色</p></div>
            <div class="item_size" id="size"><p>尺寸</p></div>
            <div class="item_count">
                <p class="forlargescreen">數量</p>
                <div class="count_group">
                    <div id="minus" onclick="counter(-1)">-</div>
                    <input type="text" id="count" value="0"/>
                    <div id="plus" onclick="counter(+1)">+</div>
                    </div>
                </div>
            <button class="addtocart" onclick="addItemToCart()">加入購物車</button>
            <p class="item_note">
                ${response.note}</br>
                ${response.texture}</br>
                ${response.description}</br>
                素材產地 / ${response.place}</br>
                加工產地 / ${response.place}
            </p>
        </div>
    </div>
    <div class="product_item_container_bottom marginforsmallscreen">
        <div class="description_title_block">
            <div class="description_title">細部說明</div>
            <div class="description_line"></div>
        </div>
        <div class="description">
            <div class="description_content">${response.story}</div>
            <div id="description_images"></div>
        </div>
    </div>`;

  productItemConatainer.innerHTML = productItemTemplate;

  for (let ix = 0; ix < response.sizes.length; ix++) {
    let sizeNode = `<div class="sizebox"
                      onclick="selectSize(${ix}, '${response.sizes[ix]}');
                      checkStock();">${response.sizes[ix]}</div>`;
    document.getElementById("size").innerHTML += sizeNode;
  }

  for (let ix = 0; ix < response.colors.length; ix++) {
    let colorNode = `<div class="colorbox"
                        style="background-color:#${response.colors[ix].code}"
                        onclick="selectColor(${ix}, '${response.colors[ix].code}');
                        checkStock();"></div>`;
    document.getElementById("colors").innerHTML += colorNode;
  }

  response.images.forEach((image) => {
    let imageNode = `<img class="" src=${image}>`;
    document.getElementById("description_images").innerHTML += imageNode;
  });

  selectColor(0, response.colors[0].code);
  selectSize(0, response.sizes[0]);
  checkStock();
}

function resetAddtoCart() {
  let addtocart = document.getElementsByClassName("addtocart")[0];
  addtocart.classList.remove("disabled");
  addtocart.disabled = false;
  addtocart.innerText = " 加入購物車";
}

function selectColor(idx, boxColor) {
  let colorBox = document.getElementsByClassName("colorbox");

  for (let ix = 0; ix < colorBox.length; ix++) {
    colorBox[ix].classList.remove("color_selected");
  }

  colorBox[idx].className += " color_selected";

  colorVal = boxColor;

  if (stockVal > 0) {
    resetAddtoCart();
  }
}

function selectSize(idx, boxSize) {
  let sizeBox = document.getElementsByClassName("sizebox");

  for (let ix = 0; ix < sizeBox.length; ix++) {
    sizeBox[ix].classList.remove("size_selected");
  }
  console.log(sizeBox);
  sizeBox[idx].className += " size_selected";
  sizeVal = boxSize;

  if (stockVal > 0) {
    resetAddtoCart();
  }
}

function counter(num) {
  let count = document.getElementById("count");
  let plus = document.getElementById("plus");
  let minus = document.getElementById("minus");
  countVal = parseInt(count.value, 10);

  countVal = isNaN(countVal) || countVal < 1 ? 0 : countVal;
  countVal += num;
  if (countVal >= count.max) {
    plus.style.pointerEvents = "none";
  } else {
    plus.style.pointerEvents = "auto";
  }

  if (countVal <= 0 || stockVal == 0) {
    minus.style.pointerEvents = "none";
  } else {
    minus.style.pointerEvents = "auto";
  }

  count.value = countVal;
}

function checkStock() {
  let count = document.getElementById("count");
  let addtocart = document.getElementsByClassName("addtocart")[0];
  let variants = response.variants;

  count.value = 0;

  for (let ix = 0; ix < variants.length; ix++) {
    if (colorVal == variants[ix].color_code && sizeVal == variants[ix].size) {
      stockVal = variants[ix].stock;
    }
  }

  count.max = stockVal;
  originStockVal = stockVal;

  if (localStorage.length !== 0) {
    let cartItemList = getCart();

    cartItemList.forEach((cartItem) => {
      if (colorVal == cartItem.color[0].code && sizeVal == cartItem.size) {
        stockVal -= cartItem.quantity;
      }
    });
  }

  if (stockVal > 0) {
    count.value = 1;
    addtocart.innerText = " 加入購物車";
    plus.style.pointerEvents = "auto";
    addtocart.disabled = false;
    addtocart.classList.remove("disabled");
    countVal = 1;
  } else {
    addtocart.classList.add("disabled");
    addtocart.innerText = "銷售一空";
    addtocart.disabled = true;
    plus.style.pointerEvents = "none";
  }
}

function addItemToCart() {
  let productToAdd = {
    id: 0,
    title: "",
    price: 0,
    color: [
      {
        code: "",
        name: "",
      },
    ],
    size: 0,
    quantity: 0,
    stockquantity: 0,
    image: "",
  };

  if (cartItemArray.length !== 0) {
    cartItemArray.forEach((cartItem) => {
      if (
        productId == cartItem.id &&
        colorVal == cartItem.color[0].code &&
        sizeVal == cartItem.size
      ) {
        cartItemArray.splice(cartItem, 1);
      }
    });
  }

  response.variants.forEach((variant) => {
    if (
      stockVal !== 0 &&
      colorVal == variant.color_code &&
      sizeVal == variant.size
    ) {
      response.colors.forEach((color) => {
        if (colorVal == color.code) {
          productToAdd = {
            id: productId,
            title: response.title,
            price: response.price,
            color: [
              {
                code: colorVal,
                name: color.name,
              },
            ],
            size: sizeVal,
            quantity: countVal,
            stockquantity: originStockVal,
            image: response.main_image,
          };
        }
      });

      cartItemArray.push(productToAdd);
      localStorage.setItem("cartItemList", JSON.stringify(cartItemArray));
      addToCartCount(cartItemArray);
      console.log(cartItemArray.length);
      checkStock();
      alert("商品已加入購物車！");
    }
  });
}

//AJAX actions
//Search
function search(searchVal) {
  window.location = "index.html?keywords=" + searchVal;
  ajax(`${sourceURL}${searchPagePath}${searchVal}${paging}` + nextPage);
}

ajaxForDetails(
  `${sourceURL}${productPagePath}${productDetailPath}` + productId
);
