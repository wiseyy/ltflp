if (document.getElementById("rcmloginuser") !== null) {
  let capt = "";
  let img = document.getElementById("captcha_image").src;
  let url = "http://127.0.0.1:5000/" + img.substring(58);

  console.log(url);
  console.log(img);

  capt = fetch(url, { method: "GET" })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
      document.getElementsByName("captcha_input")[0].value = data;
      document.getElementsByTagName("button")[0].click();
    });

  let usr, pwd;
  chrome.storage.sync.get("username", function (data) {
    usr = data.username;
    document.getElementById("rcmloginuser").value = usr;
  });
  chrome.storage.sync.get("password", function (data) {
    pwd = data.password;
    document.getElementById("rcmloginpwd").value = pwd;
    //document.getElementsByName("captcha_input")[0].value = capt;
    // document.getElementsByTagName("button")[0].click();
  });
}
