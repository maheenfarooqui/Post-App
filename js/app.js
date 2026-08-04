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

  currentUserId = user.id;
  currentUserEmail = user.email;
  currentUserFname = user.user_metadata.first_name;
  currentUserLname = user.user_metadata.last_name;
  // console.log(currentUserFname, currentUserLname);

  const firstInitial = currentUserFname.charAt(0).toUpperCase();
  const lastInitial = currentUserLname.charAt(0).toUpperCase();

  const iconElement = document.getElementById("icon");
  if (iconElement) {
    iconElement.innerHTML = firstInitial + lastInitial;
  }
   if (user.user_metadata.role === "admin") {
    iconElement.innerHTML = '<span style="font-size:12px;">Admin</span>'
    let menu = document.getElementById("dropdownMenu");
    menu.insertAdjacentHTML(
      "afterbegin",
      `
  <li>
    <a class="dropdown-item text-white fw-bold" href="adminDashboard.html">
      <i class="bi bi-speedometer2 me-2"></i>Admin Dashboard
    </a>
  </li>
  <li><hr class="dropdown-divider border-secondary"></li>
`,
    );
  }

}

function renderPosts(data) {
  postContainer.innerHTML = "";

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
    return;
  }

  data.forEach((post) => {
    console.log(post);

    let deletEditBtn = "";
    if (
      (typeof currentUserId !== "undefined" &&
        currentUserId &&
        post.user_id === currentUserId) ||
      (typeof currentUserEmail !== "undefined" &&
        currentUserEmail === "maheenzuhra@gmail.com")
    ) {
      deletEditBtn = ` 
        <button class="btn p-0 text-decoration-none small hover-cyan" style="color: #6F7A8D;" onclick="editPost(event, ${post.id}, '${post.title.replace(/'/g, "\\'")}', '${post.description.replace(/'/g, "\\'")}', '${post.created_at}', '${post.bgImage}')">
          Edit
        </button>
        <button class="btn p-0 text-decoration-none small hover-cyan" style="color: #6F7A8D;" onclick="deletePost(${post.id})">
          Delete
        </button>`;
    }

    const fInit = post.author_fname
      ? post.author_fname.charAt(0).toUpperCase()
      : "?";
    const lInit = post.author_lname
      ? post.author_lname.charAt(0).toUpperCase()
      : "";

    postContainer.innerHTML += `
      <div class="cardWraper mb-4" style="font-family: 'Inter', sans-serif;">
        <div class="postCard imgContainer p-4 border-0 shadow-sm mb-2" style="background-image: url('${post.bgImage}'); background-size: cover; background-position: center; min-height: 150px;">
          <div class="d-flex align-items-center mb-3">
            <div class="user-profile-circle me-3 bg-info text-dark d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; border-radius: 50%; font-weight:700;">
              ${fInit}${lInit}
            </div>
            <div>
              <h6 class="mb-0 text-white fw-bold">${post.author_fname || "User"} ${post.author_lname || ""}</h6>
              <span class="text-white small opacity-75">${post.email || ""}</span>
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
            <p class="text-black small mb-0 opacity-75">No comments yet. Be the first to comment!</p>
          </div>
        </div>
      </div>
    `;
  });
  gsap.utils.toArray(".cardWraper").forEach((card) => {
  gsap.from(card, {
    opacity: 0,
    y: 50,
    duration: 0.5,
    scrollTrigger: {
      trigger: card,
      start: "top 95%", // Jab ye specific card screen par aaye
    }
  });
});
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
    renderPosts(data);
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

async function dataRender() {
  try {
    const isMyPost = myPostsToggle ? myPostsToggle.checked : false;

    let query = supabase.from("postApp").select("*");
    if (isMyPost && currentUserId) {
      query = query.eq("user_id", currentUserId);
    }
    const { data, error } = await query.order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    postContainer.innerHTML = "";
    renderPosts(data);
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
      color: "#ffffff",
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
        comment_text: commentText,
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

    reader.onload = function (e) {
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
  const file = imageInput.files[0];
  let bgImageUrl = "";
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
  if (file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);
    // console.log(fileName);

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    bgImageUrl = publicUrlData.publicUrl;

    selectedBgImg = bgImageUrl;
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
  // console.log(id);

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

supabase
  .channel("postAPp Channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "postApp" },
    async (payload) => {
      try {
        const { data, error } = await supabase
          .from("postApp")
          .select("*")
          .order("id", { ascending: false });
        renderPosts(data);
      } catch (error) {
        console.log(error);
      }
    },
  )
  .subscribe((status) => {
    console.log(status);
  });



  // gsap

  
  // 1. Container aur settings configure karien
const container = document.getElementById('particle-container');
const numParticles = 50; // Kitne particles chaye

// 2. Loop chala kr particles create karien
for (let i = 0; i < numParticles; i++) {
    createParticle();
}

function createParticle() {
    // A. Element create karien
    const particle = document.createElement('div');
    particle.className = 'particle';
    container.appendChild(particle);

    // B. Random size set karien (small)
    const size = Math.random() * 2 + 2; // 2px se 7px tak
    
    // C. Initial position random set karien (screen ke bahr ya edge par)
    gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        width: size,
        height: size,
        opacity: Math.random() * 0.5 + 0.2 // Random dhundla-pan
    });

    // D. GSAP Animation apply karien (Slow floating movement)
    animateParticle(particle);
}

function animateParticle(particle) {
    // GSAP se random movement create karien
    gsap.to(particle, {
        // Random destination position
        x: `+=${Math.random() * 200 - 100}`, // -100px se +100px tak movement
        y: `+=${Math.random() * 200 - 100}`,
        
        // Random animation duration (slow)
        duration: Math.random() * 10 + 5, // 5s se 15s tak
        
        // Linear ease taake movement constant rhe
        ease: "none",
        
        // Jab animation khtm ho, dobara start karo new random values ke sath
        onComplete: () => animateParticle(particle) 
    });

    // Fade in/out animation alag se taake wo chamakte hue lagein
    gsap.to(particle, {
        opacity: Math.random() * 0.8 + 0.1,
        duration: Math.random() * 2 + 1,
        repeat: -1, // Infinite loop
        yoyo: true, // Fade in phir fade out
        ease: "sine.inOut"
    });
}

const btn = document.getElementById("upBtn");
const hlLine = btn.querySelector(".hl-line");

// Hover In: Border Line Draw & Move Effect
btn.addEventListener("mouseenter", () => {
  gsap.to(hlLine, {
    strokeDashoffset: 0, // Line charon taraf move hokar complete karegi
    duration: 0.8,
    ease: "power2.out",
  });

  // Optional: Subtle button scale for premium feel
  gsap.to(btn, { scale: 1.02, duration: 0.3 });
});

// Hover Out: Reset Line Position
btn.addEventListener("mouseleave", () => {
  gsap.to(hlLine, {
    strokeDashoffset: 480, // Reset back to initial hidden state
    duration: 0.6,
    ease: "power2.in",
  });

  gsap.to(btn, { scale: 1, duration: 0.3 });
});