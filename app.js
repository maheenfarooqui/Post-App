var title = document.getElementById("title");
var descr = document.getElementById("body");
var post = document.getElementById("post");
var bgImg = document.getElementsByClassName("bgimg");
var userE = document.getElementById("userE");
var userP = document.getElementById("userP");
var userN = document.getElementById("userN");
var userIcon = document.getElementById("userIcon");

var cardBg = "";
var editPostText = "";
var currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

function authForm() {
  if (userE.value === "" && userE.value === "" && userN.value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email and password required",
    });
  } else {
    localStorage.setItem("userName", userN.value);
    window.location.href = "index.html";
  }
}
var userNAme = localStorage.getItem("userName");
userIcon.innerText = userNAme.charAt(0).toUpperCase();

Swal.fire({
  position: "top-end",
  icon: "success",
  title: "LogIn Successfully",
  text: "Welcome to VibeNet " + userNAme,
  color: "#ffffff",
  background: "#1e293b",
  showConfirmButton: false,
  timer: 3000,
  customClass: {
    popup: "vibenet-popup",
    title: "vibenet-title",
    htmlContainer: "vibenet-content",
  },
});

function sumbitPost() {
  if (title.value.trim() === "" && descr.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Title and Description required",
    });
    return;
  }
  if (editPostText === "") {
    post.innerHTML += `<div class="cardWraper">
    <div class="postCard p-4 mb-4 border-0 shadow-sm mb-2" style="background-image: url(${cardBg}); background-attachment: fixed; background-size: cover; background-position: center;">
                <div class="d-flex align-items-center mb-3">
                <div class="user-profile-circle me-3 bg-info">${userNAme.charAt(0).toUpperCase()}</div>
                <div>
                  <h6 class="mb-0 text-white fw-bold">${userNAme.charAt(0).toUpperCase() + userNAme.slice(1)}</h6>
                  <span class="post-meta small color">Posted ${currentTime}</span>
                </div>
              </div>
              <h5 class="text-cyan mb-2">${title.value}</h5>
              <p class="text-light opacity-75">
               ${descr.value}
              </p>
            </div>
            <div class="py-3 border-top border-secondary d-flex gap-4">
                <button
                  class="btn  color p-0 text-decoration-none small" onclick="colorChange(this)"
                >
                  Like
                </button>
                <div class="d-flex gap-4  ms-auto">
                  <button class="btn color p-0 text-decoration-none small" onclick="editPost(this)">
                Edit
            </button>

            <button class="btn color p-0 text-decoration-none small" onclick="deletePost(this)">
                Delete
            </button>
                </div>
              </div>
    <div/>
              `;
  } else {
    editPostText.querySelector("h5").innerText = title.value;
    editPostText.querySelector("p").innerText = descr.value;
    var mainCard = editPostText.querySelector(".postCard");
    mainCard.style.backgroundImage = `url(${cardBg})`;
  }

  title.value = "";
  descr.value = "";
  editPostText = "";

  removeSelected();
}

function editPost(editBtn) {
  var getEL = editBtn.closest(".cardWraper");
  var maintitle = getEL.querySelector("h5").innerText.trim();
  var mainText = getEL.querySelector("p").innerText.trim();
  title.value = maintitle;
  descr.value = mainText;
  editPostText = getEL;

  var mainCard = getEL.querySelector(".postCard");
  var editBg = mainCard.style.backgroundImage;
  cardBg = editBg;
}

function deletePost(deleteBtn) {
  var getCard = deleteBtn.closest(".cardWraper");
  // getCard.style.display = "none";
  getCard.remove();
}
function addClass(src) {
  cardBg = src;
  for (var i = 0; i < bgImg.length; i++) {
    bgImg[i].className = "bgimg";
  }

  event.target.classList.add("selected");
}
function colorChange(likeBtn) {
  if (likeBtn.innerText === "Like") {
    likeBtn.style.color = "#22D3EE";
    likeBtn.innerText = "Liked";
  } else {
    likeBtn.style.color = "#6F7A8D";
    likeBtn.innerText = "Like";
  }
}
function removeSelected() {
  for (var i = 0; i < bgImg.length; i++) {
    bgImg[i].className = "bgimg";
  }
}
function logout() {
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}
