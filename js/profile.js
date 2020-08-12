const profileContainer = document.getElementById("profile_container");
let cartItemList;
let fbMemberGet = {
  id: "",
  name: "",
  email: "",
};
let fbAccessToken;

window.onload = function () {
  console.log(localStorage);
  if (localStorage.length !== 0) {
    cartItemList = JSON.parse(localStorage.getItem("cartItemList"));
    addToCartCount(cartItemList);

    fbMemberGet = JSON.parse(localStorage.getItem("fbMember"));
    document.getElementById("username").innerHTML = fbMemberGet.name;
    document.getElementById("email").innerHTML = fbMemberGet.email;
    document.getElementById("pic").src =
      "http://graph.facebook.com/" + fbMemberGet.id + "/picture?type=normal";
  } else {
    document.getElementById("username").innerHTML = "none";
    document.getElementById("email").innerHTML = "none";
    document.getElementById("pic").src = "imgs/defaultFB.png";
  }
};

window.fbAsyncInit = function () {
  FB.init({
    appId: "640093323386713",
    status: false,
    cookie: true,
    xfbml: true,
    version: "v7.0",
  });
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

function statusChangeCallback(response) {
  fbAccessToken = response.authResponse.accessToken;
  localStorage.setItem("fbAccessToken", fbAccessToken);

  if (response.status === "connected") {
    console.log("已經登入");
    FB.api("/me", "GET", { fields: "id,name,email,picture{url}" }, function (
      response
    ) {
      console.log("connected: " + response.name + " login");
      renderProfile(response);
    });
  } else if (
    response.status === "not_authorized" ||
    response.status === "unknown"
  ) {
    console.log("未登入");
    renderProfile();
    FB.login(
      function (response) {
        FB.api(
          "/me",
          "GET",
          { fields: "id,name,email,picture{url}" },
          function (response) {
            console.log("unknown: " + response.name + " login");
            renderProfile(response);
          }
        );
      },
      { scope: "email", return_scopes: true }
    );
  } else {
    console.log("unexpected errorcode");
  }
}

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function renderProfile(response) {
  let profileTemplate;

  if (response == undefined || fbAccessToken == 0) {
    profileTemplate = `
        <div class="profile_title">
            <h2 id= "member_title">會員基本資料</h2>
            <button id="fbLogin" onclick="checkLoginState()">登入</button>
        </div>
        <hr>會員未登入！`;
    profileContainer.innerHTML = profileTemplate;
    return;
  }

  profileTemplate = `
        <div class="profile_title">
            <h2 id= "member_title">會員基本資料</h2>
            <button id="fbLogout" onclick="logout()">登出</button>
        </div>
        <hr>
        <h3>Email</h3>${response.email}
        <h3>照片</h3>
        <img src="http://graph.facebook.com/${response.id}/picture?type=normal"/>`;
  profileContainer.innerHTML = profileTemplate;
}

function logout() {
  localStorage.clear();
  try {
    if (FB.getAccessToken() != null) {
      FB.logout(function (response) {
        alert("已登出");
        window.location.replace("index.html");
      });
    } else {
      window.location.replace("index.html");
    }
  } catch (err) {
    window.location.replace("index.html");
  }
}
