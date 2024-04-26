import React, { useEffect, useState } from "react";
import "../css_class/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameSignUp, setUsernameSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    const container = document.getElementById("container");
    container.classList.add("right-panel-active");
  };

  const handleSignInClick = () => {
    const container = document.getElementById("container");
    container.classList.remove("right-panel-active");
  };

  const handleLogin = async (e) => {
    let accessToken;
    e.preventDefault();
    setLoading(true);
    try {
      console.log(username, password);
      const response = await axios.post("http://localhost:3000/auth/login", {
        username: username,
        password: password,
      });
      if (response) {
        accessToken = response.data.token;
      } else {
        throw new Error("Invalid response from server");
      }
      const decoded = jwtDecode(accessToken);
      document.cookie = `accessToken=${accessToken}; path=/`;
      if (decoded.admin === true || decoded.admin === false) {
        setTimeout(() => {
          setLoading(false);
          navigate("/");
        }, 1500);
      } else {
        setLoading(false);
        alert("sai thông tin đăng nhập");
        console.error("Invalid role");
      }
    } catch (err) {
      console.log(err);
      console.error("Error during login:", err);
      alert("Đăng nhập không thành công. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded.admin === true || decoded.admin === false) {
        navigate("/");
      } else {
        console.error("Invalid role");
      }
    }
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!usernameSignUp || !email) {
        alert("Chưa nhập Username hoặc email");
        return;
      }
      const passwordError = validatePassword(passwordSignUp);
      if (passwordError) {
        alert(passwordError);
        return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        alert("Invalid phone number");
        return;
      }

      const response = await axios.post("http://localhost:3000/auth/register", {
        username: usernameSignUp,
        password: passwordSignUp,
        email: email,
        telephone: phoneNumber,
      });
      if (response) {
        alert("đăng ký thành công");
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      console.error("Error during sign up:", err);
      alert("Đăng ký không thành công. Vui lòng thử lại sau.");
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  return (
    <div>
      <div className="big">
        <div className="container" id="container">
          <div className="form-container sign-up-container">
            <form action="#" onSubmit={handleSignUp}>
              <h1 className="tag_h1">Create Account</h1>
              <span className="tag_span">
                or use your email for registration
              </span>
              <input
                type="text"
                placeholder="Name"
                id="name"
                value={usernameSignUp}
                onChange={(e) => setUsernameSignUp(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordSignUp}
                onChange={(e) => setPasswordSignUp(e.target.value)}
              />
              <button className="tag_button" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="#" onSubmit={handleLogin}>
              <h1 className="tag_h1">Sign in</h1>
              <span className="tag_span">or use your account</span>
              <input
                type="text"
                placeholder="Username"
                id="username"
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#">Forgot your password?</a>
              <button className="tag_button" onClick={handleSignInClick}>
                Sign In
              </button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="tag_h1">Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="tag_h1">Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
