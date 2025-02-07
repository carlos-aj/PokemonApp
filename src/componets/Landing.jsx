import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../Landing.css";

function Landing() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);


  const handleDiscoverClick = () => {
    navigate(user ? "/Pokemons" : "/Login");
  };

  return (
    <div className="landing-container">
      <h1 class="title">Pokémon App</h1>
      <button className="discover-button" onClick={handleDiscoverClick}>
        Discover
      </button>
      <div className="info-section">
        <div className="info-box">
          <h3>Explore the Pokédex</h3>
          <p>Access a complete list of Pokémon with detailed information on their abilities, types, and stats.</p>
        </div>
        <div className="info-box">
          <h3>Individual Pokémon Details</h3>
          <p>Get specific data on each Pokémon, including evolution, moves, and unique trivia.</p>
        </div>
        <div className="info-box">
          <h3>Compete in the Ranking System</h3>
          <p>Test your skills in our interactive game and climb the leaderboard by competing with other trainers.</p>
        </div>
        <div className="info-box">
          <h3>Built with React & Firebase</h3>
          <p>This app is developed using React for the UI and Firebase for authentication and data storage, ensuring a fast and secure experience.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
