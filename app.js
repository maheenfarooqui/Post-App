var title = document.getElementById("title");
var descr = document.getElementById("body");
var post = document.getElementById("post");
var bgImg = document.getElementsByClassName("bgimg");
var userE = document.getElementById("userE");
var userL = document.getElementById("userL");
var userP = document.getElementById("userP");
var userN = document.getElementById("userN");
var icon = document.getElementById("icon");
var cardBg = "";
var currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

function authForm() {
  if (userE.value === "" || userL.value === "" || userN.value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email and password required",
    });
  }
  var storage = JSON.parse(localStorage.getItem("userData"));

  if (!storage) {
    storage = [];
  }

  var userDetails = {
    userFName: userN.value,
    userLName: userL.value,
    userEmail: userE.value,
    userPass: userP.value,
  };

  storage.push(userDetails);

  localStorage.setItem("userData", JSON.stringify(storage));

  Swal.fire({
    icon: "success",
    title: "Account create Successfully",
    text: "Welcome to VibeNet " + userN.value.toUpperCase(),
    color: "#ffffff",
    background: "#1e293b",
    showConfirmButton: false,
    timer: 3000,
    customClass: {
      title: "vibenet-title",
    },
  }).then(() => {
    window.location.href = "login.html";
  });
}

function logIn() {
  var userData = localStorage.getItem("userData");
  var userInfo = JSON.parse(userData);
  if (!userData) {
    Swal.fire({
      icon: "error",
      title: "No account found",
      text: "Please create an account first",
    });
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify(foundUser));
  var foundUser = userInfo.find(function (user) {
    return (
      user.userFName === userN.value &&
      user.userEmail === userE.value &&
      user.userPass === userP.value
    );
  });

  if (foundUser) {
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "LogIn Successfully",
      text: "Welcome to VibeNet " + userN.value.toUpperCase(),
      color: "#ffffff",
      background: "#1e293b",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        title: "vibenet-title",
      },
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid name, email, or password",
    });
  }
}
function showUserIcon() {
  var currentUser = localStorage.getItem("currentUser");

  if (!currentUser) return;

  var userInfo = JSON.parse(currentUser);

  var icon = document.getElementById("icon");

  if (icon) {
    icon.innerHTML =
      userInfo.userFName.charAt(0).toUpperCase() +
      userInfo.userLName.charAt(0).toUpperCase();
  }
}
window.onload = function () {
  showUserIcon();
};

function sumbitPost() {
  if (title.value.trim() === "" && descr.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Title and Description are required!",
      color: "#ffffff",
      background: "#1e293b",
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#ef4444",
      customClass: {
        popup: "vibenet-popup",
        title: "vibenet-title",
        htmlContainer: "vibenet-content",
      },
    });
    return;
  } else {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

var firstName = currentUser.userFName;
var lastName = currentUser.userLName;
    post.innerHTML += `<div class="cardWraper">
    <div class="postCard p-4 mb-4 border-0 shadow-sm mb-2" style="background-image: url(${cardBg}); background-attachment: fixed; background-size: cover; background-position: center;">
                <div class="d-flex align-items-center mb-3">
                <div class="user-profile-circle me-3 bg-info">${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}</div>
                <div>
                  <h6 class="mb-0 text-white fw-bold">${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}</h6>
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
  }

  title.value = "";
  descr.value = "";
  removeSelected();
}

function editPost(editBtn) {
  Swal.fire({
    icon: "question",
    title: "Are you sure?",
    text: "Do you really want to edit this post " + userNAme + "?",
    color: "#ffffff",
    background: "#1e293b",
    confirmButtonText: "Yes, edit it",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#64748b",
    customClass: {
      title: "vibenet-title",
    },
  });
  var getEL = editBtn.closest(".cardWraper");
  var maintitle = getEL.querySelector("h5").innerText.trim();
  var mainText = getEL.querySelector("p").innerText.trim();
  title.value = maintitle;
  descr.value = mainText;
  getEL.remove();
}

function deletePost(deleteBtn) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "Do you really want to delete this post " + userNAme + "?",
    color: "#ffffff",
    background: "#1e293b",
    confirmButtonText: "Yes, delete it",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    customClass: {
      popup: "vibenet-popup",
      title: "vibenet-title",
      htmlContainer: "vibenet-content",
    },
  });
  var getCard = deleteBtn.closest(".cardWraper");
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
  window.location.href = "index.html";
}
