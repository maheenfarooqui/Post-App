import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supbaseKey = "sb_publishable_htZtKiyxzONa6MDBCw1uWA_kUCJXQT4";
const supbaseUrl = "https://lmqvmgzxbawkkyxmjimh.supabase.co";
var supabase = createClient(supbaseUrl, supbaseKey);
const signUpBtn = document.getElementById("sinUp");
const logInBtn = document.getElementById("logIn");

if (signUpBtn) {
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const userP = document.getElementById("userP").value.trim();
    const userE = document.getElementById("userE").value.trim();
    const userN = document.getElementById("userN").value.trim();
    const userL = document.getElementById("userL").value.trim();

    if (!userE || !userP) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please enter both your email and password!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userE,
        password: userP,
        options: {
          data: {
            first_name: userN,
            last_name: userL,
          },
        },
      });

      if (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.message,
        });
        return;
      }

      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account Created Successfully! Redirecting...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "login.html";
      });
    } catch (error) {
      console.log(error.message);
    }
  });
}

if (logInBtn) {
  logInBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const userP = document.getElementById("userP").value.trim();
    const userE = document.getElementById("userE").value.trim();

    if (!userE || !userP) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please enter both your email and password!",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userE,
        password: userP,
      });

      if (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "LogIn Failed",
          text: error.message,
        });
        return;
      }

      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "LogIn Successfully! Redirecting...",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "dashboard.html";
      });
    } catch (error) {
      console.log(error.message);
    }
  });
}

