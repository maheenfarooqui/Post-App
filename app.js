var supabase = window.supabase.createClient(
  "https://lmqvmgzxbawkkyxmjimh.supabase.co",
  "sb_publishable_htZtKiyxzONa6MDBCw1uWA_kUCJXQT4",
);



// DOM Elements
const postContainer = document.getElementById("post");
const bgImages = document.getElementsByClassName("bgimg");
const iconElement = document.getElementById("icon");
const titleInput = document.getElementById("title");
const descrInput = document.getElementById("body");
const actionBtn = document.getElementById("upBtn");
const imageInput = document.getElementById("imgInput");
const previewImg = document.getElementById("previewImg");


// App State
let selectedBgImg = "";
let isEditMode = false;
let editIndex = null;
let userFname = null;
let userLname = null;


// onload funtion
window.onload = function () {
  dataRender();
  showUserIcon();
};

// user icon
async function showUserIcon() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("No user logged in");
    return;
  }

  if (user.user_metadata) {
    const firstName = user.user_metadata.first_name || "";
    const lastName = user.user_metadata.last_name || "";

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    const iconElement = document.getElementById("icon");
    if (iconElement) {
      iconElement.innerHTML = firstInitial + lastInitial;
    }
    userFname = firstName;
    userLname = lastName;
  }
}

// search post
async function searchPost() {
  let searchPost = document.getElementById("searchPost").value;
  try {
    const { data, error } = await supabase
      .from("postApp")
      .select()
      .or(`title.ilike.%${searchPost},description.ilike.%${searchPost}`);

    console.log(data);
    postContainer.innerHTML = "";
    data.forEach((post) => {
      postContainer.innerHTML += `
      <div class="cardWraper mb-4">
        <div class="postCard imgContainer p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
          <div class="d-flex align-items-center mb-3">
            <div class="user-profile-circle me-3 bg-info text-dark d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
              ${userFname.charAt(0).toUpperCase()}${userLname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h6 class="mb-0 text-white fw-bold">${userFname} ${userLname}</h6>
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
            <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(event ,${post.id}, '${post.title}', '${post.description}', '${post.created_at}', '${post.bgImage}')">
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

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

// supabase data get
async function dataRender() {
  try {
    const { data, error } = await supabase
      .from("postApp")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }
    postContainer.innerHTML = "";
    data.forEach((post) => {
      postContainer.innerHTML += `
      <div class="cardWraper mb-4">
        <div class="postCard imgContainer p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
          <div class="d-flex align-items-center mb-3">
            <div class="user-profile-circle me-3 bg-info text-dark d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
              ${userFname.charAt(0).toUpperCase()}${userLname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h6 class="mb-0 text-white fw-bold">${userFname} ${userLname}</h6>
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
            <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(event ,${post.id}, '${post.title}', '${post.description}', '${post.created_at}', '${post.bgImage}')">
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

// upload image

imageInput.addEventListener("change", function () {
  var file = imageInput.files[0];
  if (file) {
    var reader = new FileReader();
    console.log(reader);
    reader.onload = function (e) {
      // console.log("event",e.target.result);
      const uploadedSrc = e.target.result;
      previewImg.src = uploadedSrc;
      previewImg.style.display = "block";
      addClass(uploadedSrc, { target: previewImg });
    };
  }
  reader.readAsDataURL(file);
});

//  Submit / Update Post 
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
  previewImg.style.display = "none";
  previewImg.src = "";
  removeSelectedBgClass();
  dataRender();
}

// Edit Post
function editPost(e, id, title, description, time, bgimg) {
  Swal.fire({
    icon: "question",
    title: "Are you sure?",
    text: `Do you really want to edit this post?`,
    color: "#ffffff",
    background: "#1e293b",
    showCancelButton: true,
    confirmButtonText: "Yes, edit it",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#64748b",
  }).then((result) => {
    if (result.isConfirmed) {
      titleInput.value = title;
      descrInput.value = description;
      selectedBgImg = bgimg;

      isEditMode = true;
      editIndex = id;
      var card = e.target.parentNode.parentNode.parentNode;
      card.remove();
      if (actionBtn) actionBtn.innerHTML = "Update Now";

      titleInput.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Delete Post 
async function deletePost(id) {
  console.log(id);

  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `Do you really want to delete this post?`,
    color: "#ffffff",
    background: "#1e293b",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
  }).then(async (result) => {
    if (result.isConfirmed) {
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

// Background Image Selection 
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

// Like Button Toggle
function toggleLike(likeBtn) {
  if (likeBtn.innerText.trim() === "Like") {
    likeBtn.style.color = "#22D3EE";
    likeBtn.innerText = "Liked";
  } else {
    likeBtn.style.color = "#6F7A8D";
    likeBtn.innerText = "Like";
  }
}

// logOut
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
  } catch (error) {
    console.log(error);
  }
  window.location.href = "index.html";
}
