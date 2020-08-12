let userName;
let fbMember = {
  id: "",
  name: "",
  email: "",
};
let loginHref = document.getElementsByClassName("fbMainLogin");

window.addEventListener("load", function() {
  for (let ix = 0; ix < loginHref.length; ix++) {
    loginHref[ix].addEventListener("click", () => {
      checkLoginState();
    });
  }
});

function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log("statusChangeCallback");
  console.log(response); // The current login status of the person.
  if (response.status === "connected") {
    // Logged into your webpage and Facebook.
    getLoginInfo();
    console.log("connected");
  } else {
    for (let ix = 0; ix < loginHref.length; ix++) {
      loginHref[ix].addEventListener("click", () => {
        checkLoginState();
      });
    }
    // Not logged into your webpage or we are unable to tell.
    FB.login(
      function (response) {
        if (response.authResponse) {
          FB.api(
            "/me",
            "GET",
            { fields: "id,name,email,picture{url}" },
            function (response) {
              console.log("unknown: " + response.name + " login");
              fbAccessToken = response.id;
              localStorage.setItem("fbAccessToken", fbAccessToken);
              fbMember = {
                id: response.id,
                name: response.name,
                email: response.email,
              };
              // alert("已登入!");
              localStorage.setItem("fbMember", JSON.stringify(fbMember));
              location.href = "profile.html";
            }
          );
        }
      },
      { scope: "email", return_scopes: true }
    );
  }
}

function checkLoginState() {
  // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response);
    console.log("status: " + response.status);
  });
}

window.fbAsyncInit = function () {
  FB.init({
    appId: "640093323386713",
    status: false,
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: "v7.0", // Use this Graph API version for this call.
  });

  // FB.getLoginStatus(function (response) {
  //   // Called after the JS SDK has been initialized.
  //   statusChangeCallback(response); // Returns the login status.
  // });
};

(function (d, s, id) {
  // Load the SDK asynchronously
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function getLoginInfo() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log("Welcome!  Fetching your information.... ");
  FB.api("/me", "GET", { fields: "id,name,email,picture{url}" }, function (
    response
  ) {
    console.log("Successful login for: " + response.name);
    let loginHref = document.getElementsByClassName("fbMainLogin");
    console.log(loginHref);
    for (let ix = 0; ix < loginHref.length; ix++) {
      loginHref[ix].href = "profile.html";
      loginHref[ix].removeEventListener("click", () => {
        checkLoginState();
      });
    }

    fbMember = {
      id: response.id,
      name: response.name,
      email: response.email,
    };
    console.log(fbMember);
    localStorage.setItem("fbMember", JSON.stringify(fbMember));
    location.href = "profile.html"; 
  });
}
