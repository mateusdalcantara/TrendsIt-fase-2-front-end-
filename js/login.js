const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Save the JWT token (from Supabase/Spring)
      localStorage.setItem("token", data.token);
      // Redirect to dashboard (client-side routing)
      window.location.href = "/dashboard.html";
    } else {
      alert("Login failed: " + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});