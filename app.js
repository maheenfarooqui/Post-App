// var title = document.getElementById("title");
// var descr = document.getElementById("body");
// var post = document.getElementById("post");

// function sumbitPost(){
//     console.log(title.value , descr.value);
//     post.innerHTML =`<h3>${title.value}</h3>
// <p>${descr.value}</p>`
    
// }
var userE =document.getElementById("userE");
var userP = document.getElementById("userP");
function authForm(){
    if(userE.value === "" && userE.value === ""){
        Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Email and password required",
});

    }else{
         window.location.href = "index.html";
        
        }
   
}

function logout(){
     window.location.href = "login.html";
}