var supabase = window.supabase.createClient(
  "https://dpheuwopfkpdynfgjthm.supabase.co",
  "sb_publishable_dOaRFmzPIgKgPV5pZDfq0w_vL3GxXdO",
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
let currentUserFname;
let currentUserLname;
let currentUserId;
let currentUserEmail;

// onload funtion
window.onload = function () {
  dataRender();
  showUserIcon();
};

// user icon
async function showUserIcon() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    Swal.fire({
      icon: "error",
      title: "Authentication Error",
      text: "Please log in to submit a post!",
      color: "#ffffff",
      background: "#1e293b",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  console.log(user);

  currentUserId = user.id;
  currentUserEmail = user.email;
  currentUserFname = user.user_metadata.first_name;
  currentUserLname = user.user_metadata.last_name;
  console.log(currentUserFname, currentUserLname);

  const firstInitial = currentUserFname.charAt(0).toUpperCase();
  const lastInitial = currentUserLname.charAt(0).toUpperCase();

  const iconElement = document.getElementById("icon");
  if (iconElement) {
    iconElement.innerHTML = firstInitial + lastInitial;
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
   if (data.length === 0) {
  postContainer.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center text-center p-5 my-5 rounded-4 border border-secondary border-opacity-25" style="background-color: #1e293b; min-height: 250px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
      
      <!-- Sleek Glowing Post Icon Placeholder -->
      <div class="mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; background-color: rgba(34, 211, 238, 0.1); border-radius: 50%; color: #22d3ee; box-shadow: 0 0 15px rgba(34, 211, 238, 0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 8h10" />
          <path d="M7 12h10" />
          <path d="M7 16h10" />
        </svg>
      </div>

      <!-- Text Elements -->
      <h5 class="fw-bold mb-1" style="color: #22d3ee; letter-spacing: 0.5px;">No Posts Found</h5>
      
    </div>
  `;
  return; // Taake agay loop na chale agar data khali ho
}

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
// my post toggle

const myPostsToggle = document.getElementById("myPostsToggle");

if (myPostsToggle) {
  myPostsToggle.addEventListener("change", () => {
    dataRender();
  });
}

// supabase data get
// async function dataRender() {
//   try {
//     const isMyPost = myPostsToggle ? myPostsToggle.checked : false;

//     let query = supabase.from("postApp").select("*");
//     if (isMyPost && currentUserId) {
//       query = query.eq("user_id", currentUserId);
//     }
//     const { data, error } = await query.order("id", { ascending: false });
//     console.log(data);

//     if (error) {
//       console.log(error);
//       return;
//     }
//     postContainer.innerHTML = "";
//     data.forEach((post) => {
//       let deletEditBtn = "";
//       if (currentUserId && post.user_id === currentUserId) {
//         deletEditBtn = ` <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(event ,${post.id}, '${post.title}', '${post.description}', '${post.created_at}', '${post.bgImage}')">
//               Edit
//             </button>
//         <button class="btn text-danger p-0 text-decoration-none small" onclick="deletePost(${post.id})">
//               Delete
//             </button>`;
//       }
//       postContainer.innerHTML += `
//       <div class="cardWraper mb-4">
//         <div class="postCard imgContainer p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
//           <div class="d-flex align-items-center mb-3">
//             <div class="user-profile-circle me-3 bg-info text-dark d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%;">
//               ${post.author_fname.charAt(0).toUpperCase()}${post.author_lname.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h6 class="mb-0 text-white fw-bold">${post.author_fname} ${post.author_lname}</h6><span>${post.email}</span>
//               <span class="post-meta small text-muted">Posted${post.created_at}</span>
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
            
//             ${deletEditBtn}
//           </div>
//         </div>
//       </div>
//     `;
//     });
//   } catch (err) {
//     console.log(err);
//     return;
//   }
// }
async function dataRender() {
  try {
    const isMyPost = myPostsToggle ? myPostsToggle.checked : false;

    let query = supabase.from("postApp").select("*");
    if (isMyPost && currentUserId) {
      query = query.eq("user_id", currentUserId);
    }
    const { data, error } = await query.order("id", { ascending: false });
    console.log(data);

    if (error) {
      console.log(error);
      return;
    }
    
    postContainer.innerHTML = "";
    
    data.forEach((post) => {
      let deletEditBtn = "";
      if (currentUserId && post.user_id === currentUserId) {
        deletEditBtn = ` 
          <button class="btn text-white p-0 text-decoration-none small" onclick="editPost(event, ${post.id}, '${post.title}', '${post.description}', '${post.created_at}', '${post.bgImage}')">
            Edit
          </button>
          <button class="btn text-danger p-0 text-decoration-none small" onclick="deletePost(${post.id})">
            Delete
          </button>`;
      }
      
      // Safe Initials handling (agar name kabhi khali ho)
      const fInit = post.author_fname ? post.author_fname.charAt(0).toUpperCase() : "?";
      const lInit = post.author_lname ? post.author_lname.charAt(0).toUpperCase() : "";

      postContainer.innerHTML += `
      <div class="cardWraper mb-4" style="font-family: 'Inter', sans-serif;">
        <div class="postCard imgContainer p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
          <div class="d-flex align-items-center mb-3">
            <div class="user-profile-circle me-3 bg-info text-dark d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%; font-weight:700;">
              ${fInit}${lInit}
            </div>
            <div>
              <h6 class="mb-0 text-white fw-bold">${post.author_fname || 'User'} ${post.author_lname || ''}</h6>
              <span class="text-white small opacity-75">${post.email}</span>
              <br/>
              <span class="post-meta small text-muted">Posted: ${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <h5 class="text-cyan mb-2 text-white">${post.title}</h5>
          <p class="text-light opacity-75">${post.description}</p>
        </div>
        
        <div class="py-3 border-top border-secondary d-flex gap-4 align-items-center">
          <button class="btn p-0 text-decoration-none small" style="color: #6F7A8D;" onclick="toggleLike(this)">
            Like
          </button>
          
          <button class="btn p-0 text-decoration-none small hover-cyan" style="color: #6F7A8D;" onclick="toggleCommentBox(${post.id})">
            Comment
          </button>

          <div class="d-flex gap-4 ms-auto">
            ${deletEditBtn}
          </div>
        </div>

        <div id="commentBox-${post.id}" class="comment-section p-3 rounded-3 mb-3 d-none" style="background-color: #1e293b; border: 1px solid #334155;">
          
          <div class="input-group input-group-sm mb-3">
            <input type="text" id="commentInput-${post.id}" class="form-control bg-transparent text-white border-secondary custom-input" placeholder="Write a comment..." style="box-shadow: none;">
            <button class="btn btn-outline-info text-cyan px-3" type="button" onclick="addComment(${post.id})" style="border-color: #334155;">Post</button>
          </div>

          <div id="commentsList-${post.id}" class="comments-list d-flex flex-column gap-2" style="max-height: 200px; overflow-y: auto;">
            <p class="text-muted small mb-0 opacity-75">No comments yet. Be the first to comment!</p>
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
// comment controll

function toggleCommentBox(postId) {
  const commentBox = document.getElementById(`commentBox-${postId}`);
  if (commentBox) {
    commentBox.classList.toggle("d-none");
    
    // 🔥 Agar box open hua hai, to database se live comments fetch kar ke lao
    if (!commentBox.classList.contains("d-none")) {
      fetchComments(postId);
    }
  }
}

//  insert Comments

async function addComment(postId) {
  const inputField = document.getElementById(`commentInput-${postId}`);
  
  if (!inputField || inputField.value.trim() === "") return;
  const commentText = inputField.value.trim();

  
  if (!currentUserId) {
    Swal.fire({
      icon: "error",
      title: "Authentication Error",
      text: "Please log in to add a comment!",
      background: "#1e293b",
      color: "#ffffff"
    });
    return;
  }

  try {
    
    const { data, error } = await supabase
      .from("commentsApp")
      .insert({
        post_id: postId,
        user_id: currentUserId,
        user_name: `${currentUserFname} ${currentUserLname}`, 
        comment_text: commentText
      })
      .select();

    if (error) {
      console.log("Comment Error:", error);
      return;
    }

    // 3. Input field khali karo
    inputField.value = "";

    // 4. Comments ko refresh karo taake naya comment list me dikhe
    fetchComments(postId);

  } catch (err) {
    console.log(err);
  }
}

//  fetch Comments

async function fetchComments(postId) {
  const commentsList = document.getElementById(`commentsList-${postId}`);
  if (!commentsList) return;

  try {
    
    const { data: comments, error } = await supabase
      .from("commentsApp")
      .select("*")
      .eq("post_id", postId)
      .order("id", { ascending: true }); 

    if (error) {
      console.log("Fetch Comments Error:", error);
      return;
    }

    if (comments.length === 0) {
      commentsList.innerHTML = `<p class="text-muted small mb-0 opacity-75">No comments yet. Be the first to comment!</p>`;
      return;
    }

    
    commentsList.innerHTML = "";
    comments.forEach((comment) => {
      commentsList.innerHTML += `
        <div class="p-2 rounded-2 mb-2" style="background-color: #0f172a;">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-bold text-white" style="font-size: 0.8rem;">${comment.user_name}</span>
            <span class="text-muted" style="font-size: 0.7rem;">${new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p class="text-light mb-0 small opacity-90" style="font-size: 0.85rem;">${comment.comment_text}</p>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
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
          email: currentUserEmail,
          user_id: currentUserId,
          author_fname: currentUserFname,
          author_lname: currentUserLname,
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
