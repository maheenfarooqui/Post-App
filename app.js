var supabase = window.supabase.createClient(
  "https://lmqvmgzxbawkkyxmjimh.supabase.co",
  "sb_publishable_htZtKiyxzONa6MDBCw1uWA_kUCJXQT4",
);

// --- DOM Elements & Global State ---
const postContainer = document.getElementById("post");
const bgImages = document.getElementsByClassName("bgimg");
const iconElement = document.getElementById("icon");
const signUpBtn = document.getElementById("sinUp");
const logInBtn = document.getElementById("logIn");
const titleInput = document.getElementById("title");
const descrInput = document.getElementById("body");
const actionBtn = document.getElementById("upBtn"); // Update/Submit Button

// App State
let selectedBgImg = "";
let isEditMode = false;
let editIndex = null;

// Mock User Session (Kyunki humne database/localStorage hata diya hai)
const currentUser = {
  firstName: "Maheen",
  lastName: "Khan",
};

// --- Initialization ---
window.onload = function () {
  dataRender();
  showUserIcon();
};

// --- User Profile Icon ---
function showUserIcon() {
  if (iconElement && currentUser) {
    const firstInitial = currentUser.firstName.charAt(0).toUpperCase();
    const lastInitial = currentUser.lastName.charAt(0).toUpperCase();
    iconElement.innerHTML = firstInitial + lastInitial;
  }
}

// supabase data get
async function dataRender() {
  try {
    const { data, error } = await supabase
      .from("postApp")
      .select("*")
      .order("id", { ascending: false });
    console.log(data);
    if (error) {
      console.log(error);
      return;
    }
    postContainer.innerHTML = "";
    data.forEach((post) => {
      postContainer.innerHTML += `
      <div class="cardWraper mb-4">
        <div class="postCard p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
          <div class="d-flex align-items-center mb-3">
            <div class="user-profile-circle me-3 bg-info text-white d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
              MZ
            </div>
            <div>
              <h6 class="mb-0 text-white fw-bold">${currentUser.firstName} ${currentUser.lastName}</h6>
              <span class="post-meta small text-muted">Posted${post.created_at}</span>
            </div>
          </div>
          <h5 class="text-cyan mb-2 text-white">${post.title}</h5>
          <p class="text-light opacity-75">${post.description}</p>
        </div>
        
        <div class="py-3 border-top border-secondary d-flex gap-4">
          <button class="btn p-0 text-decoration-none small" style="color: #6F7A8D;" onclick="toggleLike(this)">
            Like
          </button>
          <div class="d-flex gap-4 ms-auto">
            <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(${post.id}, '${post.title}', '${post.description}', '${post.created_at}', '${post.bgImage}')">
              Edit
            </button>
            <button class="btn text-danger p-0 text-decoration-none small" onclick="deletePost(${post.id})">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
    });
  } catch (err) {
    console.log(err);
    return;
  }
}

// --- Render Posts Function ---
// function renderPosts() {
//   if (!postContainer) return;
//   postContainer.innerHTML = "";

//   // if (postsArray.length === 0) {
//   //   postContainer.innerHTML = `<p class="text-light opacity-50 text-center">No posts available. Create one!</p>`;
//   //   return;
//   // }

//  data.forEach((post, index) => {
//     postContainer.innerHTML += `
//       <div class="cardWraper mb-4">
//         <div class="postCard p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
//           <div class="d-flex align-items-center mb-3">
//             <div class="user-profile-circle me-3 bg-info text-white d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
//               ${currentUser.firstName.toLowerCase()}
//             </div>
//             <div>
//               <h6 class="mb-0 text-white fw-bold">${currentUser.firstName} ${currentUser.lastName}</h6>
//               <span class="post-meta small text-muted">Posted</span>
//             </div>
//           </div>
//           <h5 class="text-cyan mb-2 text-white">${post.title}</h5>
//           <p class="text-light opacity-75">${post.description}</p>
//         </div>

//         <div class="py-3 border-top border-secondary d-flex gap-4">
//           <button class="btn p-0 text-decoration-none small" style="color: #6F7A8D;" onclick="toggleLike(this)">
//             Like
//           </button>
//           <div class="d-flex gap-4 ms-auto">
//             <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(${index})">
//               Edit
//             </button>
//             <button class="btn text-danger p-0 text-decoration-none small" onclick="deletePost(${index})">
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//   });
// }

// --- Submit / Update Post ---
async function sumbitPost() {
  const titleVal = titleInput.value.trim();
  const descrVal = descrInput.value.trim();

  if (titleVal === "" || descrVal === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Title and Description are required!",
      color: "#ffffff",
      background: "#1e293b",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  if (isEditMode) {
    try {
      const { data, error } = await supabase
        .from("postApp")
        .update({
          title: titleVal,
          description: descrVal,
          bgImage: selectedBgImg,
        })
        .eq("id", editIndex)
        .select();
      if (error) {
        console.log(error);
        return;
      }
      isEditMode = false;
      editIndex = null;
      if (actionBtn) actionBtn.innerHTML = "Submit";
    } catch (err) {
      console.log(err);
      return;
    }
  } else {
    try {
      const { data, error } = await supabase
        .from("postApp")
        .insert({
          title: titleVal,
          description: descrVal,
          bgImage: selectedBgImg,
        })
        .select();
      console.log(data);
      if (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }

  titleInput.value = "";
  descrInput.value = "";
  selectedBgImg = "";
  removeSelectedBgClass();
 dataRender();
}

// --- Edit Post Trigger ---
function editPost(id, title, description, time, bgimg) {
  Swal.fire({
    icon: "question",
    title: "Are you sure?",
    text: `Do you really want to edit this post, ${currentUser.firstName}?`,
    color: "#ffffff",
    background: "#1e293b",
    showCancelButton: true,
    confirmButtonText: "Yes, edit it",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#64748b",
  }).then((result) => {
    if (result.isConfirmed) {
      // Data ko wapas input fields mein daalna
      titleInput.value = title;
      descrInput.value = description;
      selectedBgImg = bgimg;

      isEditMode = true;
      editIndex = id;

      if (actionBtn) actionBtn.innerHTML = "Update Now";

      // Screen scroll up karke user ko inputs tak le jayein
      titleInput.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// --- Delete Post ---
async function deletePost(id) {
  console.log(id);

  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `Do you really want to delete this post, ${currentUser.firstName}?`,
    color: "#ffffff",
    background: "#1e293b",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Array se post remove karein
      // postsArray.splice(index, 1);

      try {
        const { data, error } = await supabase
          .from("postApp")
          .delete()
          .eq("id", id)
          .select();
        if (error) {
          console.log(error);
          return;
        }
        dataRender();
      } catch (err) {
        console.log(err);
        return;
      }

      Swal.fire({
        title: "Deleted!",
        text: "Your post has been removed.",
        icon: "success",
        background: "#1e293b",
        color: "#ffffff",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// --- Background Image Selection ---
function addClass(src, event) {
  selectedBgImg = src;
  removeSelectedBgClass();
  if (event && event.target) {
    event.target.classList.add("selected");
  }
}

function removeSelectedBgClass() {
  for (let i = 0; i < bgImages.length; i++) {
    bgImages[i].classList.remove("selected");
  }
}

// --- Like Button Toggle ---
function toggleLike(likeBtn) {
  if (likeBtn.innerText.trim() === "Like") {
    likeBtn.style.color = "#22D3EE";
    likeBtn.innerText = "Liked";
  } else {
    likeBtn.style.color = "#6F7A8D";
    likeBtn.innerText = "Like";
  }
}

// --- Sign Up / Login Forms Mock (Kyunki backend nhi hai ab) ---
if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Account Mocked Successfully! Redirecting...",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "login.html";
    });
  });
}

if (logInBtn) {
  logInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Logged In",
      text: "Welcome back!",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  });
}

function logout() {
  window.location.href = "index.html";
}
