if (document.getElementById("login") !== null) {
  var capt = document.getElementById("login").innerText.split("\n")[3];
  var capt = capt.split(" ");
  var ans = NaN;
  if (capt.includes("first")) {
    ans = parseInt(capt[4]);
  } else if (capt.includes("second")) {
    ans = parseInt(capt[6]);
  } else if (capt.includes("add")) {
    ans = parseInt(capt[2]) + parseInt(capt[4]);
  } else if (capt.includes("subtract")) {
    ans = parseInt(capt[2]) - parseInt(capt[4]);
  }
  let usr, pwd;
  chrome.storage.sync.get("username", function (data) {
    usr = data.username;
    document.getElementById("username").value = usr;
  });
  chrome.storage.sync.get("password", function (data) {
    pwd = data.password;
    document.getElementById("password").value = pwd;
    document.getElementById("valuepkg3").value = ans;
    document.getElementById("loginbtn").click();
  });
} else {
  var t = document
    .getElementsByClassName("singlebutton")[1]
    .getElementsByTagName("input")[0]
    .click();
}
