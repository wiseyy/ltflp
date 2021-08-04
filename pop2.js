if (document.getElementById("login") !== null) {
  document.getElementById("login").addEventListener("click", function () {
    window.location.href = "pop2.html";
  });
}
if (document.getElementById("sub") !== null) {
  document.getElementById("sub").addEventListener("click", function () {
    var usr = document.getElementById("usr").value;
    var pwd = document.getElementById("pwd").value;

    chrome.storage.sync.set({ username: usr, password: pwd }, function () {
      alert("stored and updated");
    });
  });
  document.getElementById("back").onclick = function () {
    window.location.href = "pop-up.html";
  };
}
