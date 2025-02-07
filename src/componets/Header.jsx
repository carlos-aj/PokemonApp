import { Link, useNavigate } from "react-router-dom";
import pokeIcon from "../assets/Poké_Ball_icon.png";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../Header.css";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sesión cerrada")
        navigate("/"); 
    })
      .catch((error) => console.error("Error al cerrar sesión", error));
  };

  return (
    <header>
    <nav>
  <div className="nav-logo">
    <Link to="/">
      <img src={pokeIcon} alt="Poke Icon" />
    </Link>
  </div>
  <ul className="nav">
    <li className="nav-item">
      <Link to="/Pokemons" className="nav-link">Pokémons</Link>
    </li>
    <li className="nav-item">
      <Link to="/Game" className="nav-link">Game</Link>
    </li>
    <li className="nav-item">
      {user ? (
        <button onClick={handleLogout} className="nav-link">Logout</button>
      ) : (
        <Link to="/Login" className="nav-link">Login</Link>
      )}
    </li>
  </ul>
</nav>

    </header>
  );
}

export default Header;
