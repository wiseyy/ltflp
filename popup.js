var moodle = document.getElementById("moodle");
var webmail = document.getElementById("webmail");
var eacad = document.getElementById("eacad");

moodle.addEventListener("click", () => {
  window.open("https://moodle.iitd.ac.in/login/index.php", "_blank");
});
webmail.addEventListener("click", () => {
  window.open("https://webmail.iitd.ac.in/roundcube/", "_blank");
});
eacad.addEventListener("click", () => {
  window.open("https://eacademics.iitd.ac.in/sportal/login", "_blank");
});
