import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../firebase"; 
import Header from "./Header";
import "../Login.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();
    setEmailError("");
    setPassError("");
    setConfirmPassError("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPassError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPassError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password);
        navigate("/Pokemons");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            setEmailError("The email does not have a valid format");
            break;
          case "auth/email-already-in-use":
            setEmailError("The email is already registered");
            break;
          case "auth/weak-password":
            setPassError("The password is too weak. It must be at least 6 characters long");
            break;
          default:
            console.error("Error en el registro:", error);
            break;
        }
      });
  };

  const back = () => {
    navigate("/Login");
  };

  return (
    <>
      <Header />
      <div className="container">
        <form onSubmit={handleRegister}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="error">{emailError}</p>

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="error">{passError}</p>

          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" type="password" placeholder="Confirm Password..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <p className="error">{confirmPassError}</p>

          <button className="log" type="submit">Sign up</button>
        </form>
        <div className="back" onClick={back}><i className="fa-solid fa-angle-left"></i> Back</div>
      </div>
    </>
  );
}

export default Register;
