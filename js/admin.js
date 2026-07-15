import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supbaseKey = "sb_publishable_dOaRFmzPIgKgPV5pZDfq0w_vL3GxXdO";
const supbaseUrl = "https://dpheuwopfkpdynfgjthm.supabase.co";
const service_role =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaGV1d29wZmtwZHluZmdqdGhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkyMjM5OSwiZXhwIjoyMDk4NDk4Mzk5fQ.yvmgW9-bzNBspiaqHMKtXf-GlfJaeMrgJxTH40_-gRw";
var supabase = createClient(supbaseUrl, supbaseKey);
const supabaseAdmin = createClient(supbaseUrl, service_role);

let adminPostLogs = document.getElementById("adminPostLogs");

window.onload = function () {
  loadDashboardStats();
  loadAllPost();
  loadUsersControl();
  loadComments();
};
async function loadDashboardStats() {
  // total post
  try {
    const { count, error } = await supabase
      .from("postApp")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.log(error);
    }
    // console.log(count);
    let totalPostsCount = document.getElementById("totalPostsCount");
    totalPostsCount.innerHTML = `${count}`;
  } catch (error) {
    console.log(error);
  }
  //   total comments
  try {
    const { count, error: cError } = await supabase
      .from("commentsApp")
      .select("*", { count: "exact", head: true });
    if (cError) {
      console.log(cError);
    }
    // console.log(count);
    let totalCommentsCount = document.getElementById("totalCommentsCount");
    totalCommentsCount.innerHTML = `${count}`;
  } catch (error) {
    console.log(error);
  }
  //   total user
  try {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();
    // console.log(users.length);

    if (error) {
      console.log(error);
    }
    let activeUsersCount = document.getElementById("activeUsersCount");
    activeUsersCount.innerHTML = `${users.length}`;
  } catch (error) {
    console.log(error);
  }
}
async function loadAllPost() {
  try {
    const { data, error } = await supabase.from("postApp").select("*");
    if (error) {
      console.log(error);
    }
    console.log(data);
    renderAllPost(data);
  } catch (error) {
    console.log(error);
  }
}
async function renderAllPost(data) {
  adminPostLogs.innerHTML = "";
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
    adminPostLogs.innerHTML += `
            <tr>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="user-profile-circle shadow-cyan" style="width: 35px; height: 35px; font-size: 0.8rem; letter-spacing: 0.5px;">${post.author_fname.charAt(0).toUpperCase()}${post.author_lname.charAt(0).toUpperCase()}</div>
                <div>
                  <span class="fw-bold d-block text-white" style="font-size:0.85rem;">${post.author_fname} ${post.author_lname}</span>
                  <span class="text-light opacity-50 d-block" style="font-size:0.7rem;">${post.email || ""}</span>
                </div>
              </div>
            </td>
            <td class="text-cyan fw-semibold" style="font-size:0.9rem;">${post.title}</td>
            <td class="text-light text-truncate" style="max-width: 250px; font-size:0.85rem;">${post.description}</td>
            <td class="text-light opacity-75" style="font-size:0.8rem;">${new Date(post.created_at).toLocaleDateString()}</td>
            <td class="text-nowrap text-end">
  <div class="d-inline-flex gap-1">

    <button  onclick="deleteUserPost('${post.id}')" class="btn btn-sm btn-outline-danger px-2 py-1" style="font-size: 0.75rem;">Delete</button>
  </div>
</td>
          </tr>
            
            `;
  });
}

window.searchPost = async function () {
  let searchPost = document.getElementById("adminSearch").value;
  try {
    const { data, error } = await supabase
      .from("postApp")
      .select()
      .or(`author_fname.ilike.%${searchPost}%,email.ilike.%${searchPost}%`);
    console.log(data);
    renderAllPost(data);

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

async function loadUsersControl() {
  let adminUserLogs = document.getElementById("adminUserLogs");
  try {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();
    // const { data, error } = await supabase
    //   .from("postApp")
    //   .select("author_fname, author_lname, email, user_id");
    if (error) {
      console.log(error);
    }
    console.log(users);

    users.forEach((userInfo) => {
      // First Name aur Last Name ke safety checks
      const fName = userInfo.user_metadata.first_name || "User";
      const lName = userInfo.user_metadata.last_name || "";
      const email = userInfo.email || "No Email";
      const userId = userInfo.id || "00000000";

      adminUserLogs.innerHTML += `
  <tr class="tablehover">
    <td style="padding: 16px 18px; border-bottom: 1px solid #334155;">
      <div class="d-flex align-items-center gap-3">
        <div class="user-profile-circle shadow-cyan" style="width: 35px; height: 35px; font-size: 0.8rem; letter-spacing: 0.5px;">
          ${fName.charAt(0).toUpperCase()}${lName ? lName.charAt(0).toUpperCase() : ""}
        </div>
        <div>
          <span class="fw-bold d-block text-white" style="font-size: 0.85rem;">${fName} ${lName}</span>
          <span class="text-light opacity-50 d-block" style="font-size: 0.7rem;">${email}</span>
        </div>
      </div>
    </td>
    
     <td class="text-light opacity-50" style="padding: 16px 18px; border-bottom: 1px solid #334155; font-size: 0.8rem; font-family: monospace;">
       ${userId.substring(0, 8)}...${userId.substring(userId.length - 8)}
     </td>
    
    <td style="padding: 16px 18px; border-bottom: 1px solid #334155; text-align: center;">
       <span class="badge" style="background-color: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); font-size: 0.7rem; padding: 4px 8px;">
         Active
       </span>
     </td>
    
     <td class="text-nowrap" style="padding: 16px 18px; border-bottom: 1px solid #334155; text-align: right;">
      <div class="d-inline-flex gap-1">
         <button class="btn btn-sm btn-outline-danger px-2 py-1" 
                 style="font-size: 0.75rem; border-color: #ef4444; color: #f87171;">
           Delete
         </button>
       </div>
     </td>
   </tr>
 `;
    });
    console.log(users);
  } catch (error) {
    console.log(error);
  }
}

async function loadComments() {
  let adminCommentLogs = document.getElementById("adminCommentLogs");
  try {
    const { data, error } = await supabase.from("commentsApp").select("*");

    if (error) {
      console.log(error);
    }
    console.log(data);

    data.forEach((commentInfo) => {
      adminCommentLogs.innerHTML += `
  <tr class="tablehover">
    <td style="padding: 16px 18px; border-bottom: 1px solid #334155;">
      <div class="d-flex align-items-center gap-3">
        <div class="user-profile-circle shadow-cyan" 
             style="width: 35px; height: 35px; font-size: 0.8rem; letter-spacing: 0.5px;">
          ${commentInfo.user_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <span class="fw-bold d-block text-white" style="font-size: 0.85rem;">${commentInfo.user_name}</span>
          
        </div>
      </div>
    </td>
    
    <td class="text-light" style="padding: 16px 18px; border-bottom: 1px solid #334155; font-size: 0.85rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      "${commentInfo.comment_text}"
    </td>
    
    <td class="text-info fw-semibold" style="padding: 16px 18px; border-bottom: 1px solid #334155; font-size: 0.85rem; color: #334155 !important; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
      ${commentInfo.user_id || "Untitled Post"}
    </td>
    
    <td class="text-nowrap" style="padding: 16px 18px; border-bottom: 1px solid #334155; text-align: right;">
      <div class="d-inline-flex gap-1">
      
        <button onclick="deleteComment('${commentInfo.id}')" class="btn btn-sm btn-outline-danger px-2 py-1" 
                style="font-size: 0.75rem; border-color: #ef4444; color: #f87171;">
          Delete
        </button>
      </div>
    </td>
  </tr>
`;
    });
  } catch (error) {
    console.log(error);
  }
}

window.deleteUserPost = async function (userPostId) {
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
          .eq("id", userPostId);
        if (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
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
  renderAllPost();
};

window.deleteComment = async function (commentId) {
  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `Do you really want to delete this comment?`,
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
          .from("commentsApp")
          .delete()
          .eq("id", commentId);
        if (error) {
          throw error;
        }

        Swal.fire({
          title: "Deleted!",
          text: "Your comment has been removed.",
          icon: "success",
          background: "#1e293b",
          color: "#ffffff",
          timer: 1500,
          showConfirmButton: false,
        });

        loadComments();
      } catch (error) {
        console.error("Error deleting comment:", error.message);
      }
    }
  });
};

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
  } catch (error) {
    console.log(error);
  }
  window.location.href = "index.html";
}
