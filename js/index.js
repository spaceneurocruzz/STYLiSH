const productConatainer = document.getElementsByClassName(
  "product_container"
)[0];
const bannerConatainer = document.getElementsByClassName("banner_container")[0];
const categoryURL = new URL(window.location.href).searchParams.get("category");
const indexURL = window.location.origin
  .toString()
  .concat("/students/sandy/Stylish/index.html");

let isLoad = false;
let nextPage = 0;
let bannerIdx = 1;
let inputText = "";
let category = "all";
let timer;
let searchId = new URL(window.location.href).searchParams.get("keywords");

window.onload = function () {
  localStorage.setItem("fbAccessToken", 0);
  if (localStorage.length !== 0) {
    let cartItemList = JSON.parse(localStorage.getItem("cartItemList"));
    addToCartCount(cartItemList);
  }
};

function ajax(src) {
  isLoad = true;
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let response = data.data;
      nextPage = data.next_paging;
      if (nextPage !== undefined) {
        isLoad = false;
      }
      if (!Object.keys(response).length) {
        productConatainer.innerHTML = `無此搜尋結果`;
      }
      renderProductList(response);
    } else if (xhr.status === 400) {
      console.log("Error");
    }
  };
  xhr.open("GET", src);
  xhr.send();
}

function ajaxForCategory() {
  ajax(`${sourceURL}${productPagePath}${category}${pagingAll}` + nextPage);
  inputText = "";
}

function ajaxForSearch() {
  category = "all";
  ajax(`${sourceURL}${searchPagePath}${inputText}${paging}` + nextPage);
  inputText = "";
}

function renderProductList(response) {
  Object.values(response).forEach((element) => {
    console.log(`id: ${element.id}`);
    const productTemplate = `
      <div class="product">
        <a href="product.html?id=${element.id}"><img src=${element.main_image}></a>
        <div class="colors" id ="${element.id}"></div>
            <p><a href="product.html?id=${element.id}">${element.title}</a></p>
            <p>TWD. ${element.price}</p>
      </div>`;

    productConatainer.innerHTML += productTemplate;

    element.colors.forEach((color) => {
      let colorNode =
        '<div class="colorbox" style="background-color:#' +
        color.code +
        '"></div>';
      document.getElementById(element.id).innerHTML += colorNode;
    });
  });
}

//Render by categories
function renderProductListByCategory(categoryClicked) {
  productConatainer.innerHTML = "";
  nextPage = 0;
  document.getElementById(category).setAttribute("style", "color:gray;");
  category = categoryClicked;
  document
    .getElementById(categoryClicked)
    .setAttribute("style", "color:#8b572a;");
  ajaxForCategory();
}

function renderProductListByCategoryClicked(categoryClicked) {
  document
    .getElementById(categoryClicked)
    .addEventListener("click", function () {
      renderProductListByCategory(categoryClicked);
    });
}

//expand search textarea for mobile
const searchIconElem = document.getElementById("searchIcon");
const searchTextElem = document.getElementById("searchText");
searchIconElem.addEventListener("click", () => {
  searchTextElem.classList.toggle("forlargescreen");
});

//search by keywords
getProductListByKeywords = function (input) {
  productConatainer.innerHTML = "";
  nextPage = null;
  inputText = input;
  input !== "" ? ajaxForSearch() : ajaxForCategory();
};

//window scrolling event
window.onscroll = function () {
  let triggerDistance = 200;
  let distance =
    productConatainer.getBoundingClientRect().bottom - window.innerHeight;

  if (distance < triggerDistance && !isLoad) {
    inputText !== "" ? ajaxForSearch() : ajaxForCategory();

    console.log(`Page ${nextPage} loaded.`);
  }
};

function ajaxForCampaigns(src) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      let response = data.data;
      renderCampaignList(response);
    } else if (xhr.status === 400) {
      console.log("Error");
    }
  };
  xhr.open("GET", src);
  xhr.send();
}

function renderCampaignList(response) {
  Object.values(response).forEach((element) => {
    const campaignTemplate = `<img src="https://api.appworks-school.tw/${
      element.picture
    }" class="banner"/>
           <div class="banner_text">
               "${element.story.replace(/\n/g, "<br/>")}" <br/>
           </div>`;

    if (document.getElementsByClassName("banner").length < response.length) {
      bannerConatainer.innerHTML += campaignTemplate;
    }

    let dot_group = document.getElementById("dot_group");
    let dot = document.createElement("span");
    dot.className = "dot";
    if (document.getElementsByClassName("dot").length < response.length) {
      dot_group.appendChild(dot);
    }
    dot.setAttribute("onclick", `showCurrentSlide(${bannerIdx++})`);
  });

  triggerSlideEvent(bannerIdx);
}

function triggerSlideEvent() {
  let bannerImgList = document.getElementsByClassName("banner");
  let bannerTextList = document.getElementsByClassName("banner_text");
  let dotList = document.getElementsByClassName("dot");
  let slideCount = bannerImgList.length;

  if (
    slideCount != bannerTextList.length ||
    bannerTextList.length != dotList.length
  ) {
    console.log("Data counts not matched.");
    return;
  }

  if (bannerIdx < 1) {
    bannerIdx = slideCount;
  }

  if (bannerIdx > slideCount) {
    bannerIdx = 1;
  }

  for (let ix = 0; ix < slideCount; ix++) {
    bannerImgList[ix].style.display = "none";
    bannerTextList[ix].style.display = "none";
    dotList[ix].classList.remove("active");
  }

  bannerTextList[bannerIdx - 1].style.display = "block";
  bannerImgList[bannerIdx - 1].style.display = "block";
  dotList[bannerIdx - 1].className += " active";

  timer = setTimeout(triggerSlideEvent, 10000);
  bannerIdx++;
}

showCurrentSlide = function (n) {
  clearTimeout(timer);
  bannerIdx = n;
  triggerSlideEvent();
};

//AJAX actions
if (searchId !== null) {
  inputText = searchId;
  productConatainer.innerHTML = "";
  ajaxForSearch();
} else if (categoryURL) {
  renderProductListByCategory(categoryURL);
} else {
  ajaxForCategory();
}

ajaxForCampaigns(`${sourceURL}${marketPagePath}${campaignsPath}`);

renderProductListByCategoryClicked("women");
renderProductListByCategoryClicked("men");
renderProductListByCategoryClicked("accessories");
renderProductListByCategoryClicked("all");
