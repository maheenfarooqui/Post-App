var title = document.getElementById("title");
var descr = document.getElementById("body");
var post = document.getElementById("post");
var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');



function sumbitPost(){
  if(title.value.trim() === "" && descr.value.trim() === ""){
     Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Title and Description required",
    });
  }
    
    else{
      post.innerHTML +=`<div class="postCard p-4 mb-4 border-0 shadow-sm">
                    <div class="d-flex align-items-center mb-3">
                        <div class="user-profile-circle me-3">AS</div>
                        <div>
                            <h6 class="mb-0 text-white fw-bold">Ahmed Sheikh</h6>
                            <span class="post-meta small color">Posted ${currentTime}</span>
                        </div>
                    </div>
                    <h5 class="text-cyan mb-2">${title.value}</h5>
                    <p class="text-light opacity-75">${descr.value}</p>
                    <div class="pt-3 border-top border-secondary d-flex gap-4">
                        <button class="btn btn-link color p-0 text-decoration-none small">Like</button>
                        
                    </div>
                </div>`
    }
title.value = "";
descr.value = "";
}
var userE = document.getElementById("userE");
var userP = document.getElementById("userP");
function authForm() {
  if (userE.value === "" && userE.value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Email and password required",
    });
  } else {
    window.location.href = "index.html";
  }
}

function logout() {
  window.location.href = "login.html";
}
function colorChange(){
    var likeBtn = document.getElementById("like");
    if(likeBtn.innerText === "Like"){
       likeBtn.style.color = "#22D3EE";
    likeBtn.innerText = "Liked"
    }
    else{
        likeBtn.style.color = "#6F7A8D";
        likeBtn.innerText = "Like"
    }
}
