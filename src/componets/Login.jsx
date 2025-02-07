import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import Header from "./Header";
import "../Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setEmailError("");
    setPassError("");
    
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/Pokemons");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            setPassError("Incorrect password");
            break;
          default:
            console.error("Error en el registro:", error);
            break;
        }
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/Pokemons");
      })
      .catch(() => {
        console.error("Failed sign");
      });
  };

  const handleGithubLogin = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/Pokemons");
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión con GitHub:", error);
      });
  };

  const goRegister = () => {
    navigate("/Register");
  };

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="container">
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="error">{emailError}</p>
          
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="error">{passError}</p>
          
          <button className="log" type="submit">Login</button>
          <p className="regP">If you haven't registered yet, don't hesitate to join us</p>
          <button className="log" type="button" onClick={goRegister}>Sign up</button>
        </form>

        <div className="back" onClick={back}><i className="fa-solid fa-angle-left"></i> Back</div>

        <div className="social" onClick={handleGoogleLogin}>
          <i className="fa-brands fa-google"></i> Login With Google
        </div>

        <div className="social" onClick={handleGithubLogin}>
          <i className="fa-brands fa-github"></i> Login With Github
        </div>
      </div>
    </>
  );
}

export default Login;
