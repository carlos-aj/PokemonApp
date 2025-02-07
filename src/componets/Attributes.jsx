import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import "../Attributes.css";

export function Attributes() {
  const { id } = useParams();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spriteIndex, setSpriteIndex] = useState(0); 

  const spriteOptions = [
    selectedPokemon?.sprites?.front_default,
    selectedPokemon?.sprites?.other.dream_world.front_default,
    selectedPokemon?.sprites?.other.home.front_default,
    selectedPokemon?.sprites?.other["official-artwork"].front_default,
  ].filter(Boolean); 

  const handleNextSprite = () => {
    setSpriteIndex((prevIndex) => (prevIndex + 1) % spriteOptions.length);
  };

  const handlePreviousSprite = () => {
    setSpriteIndex(
      (prevIndex) => (prevIndex - 1 + spriteOptions.length) % spriteOptions.length
    );
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se pudo encontrar el Pokémon');
          }
          return response.json();
        })
        .then((pokemon) => {
          setSelectedPokemon(pokemon);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Header />
      <div className="pokemon-detail-container">
        <h2 className="pokemon-title">{selectedPokemon.name}</h2>

        <div className="sprite-navigation">
          <button onClick={handlePreviousSprite} disabled={spriteOptions.length <= 1} className="nav-button"><i className="fa-solid fa-angle-left"/></button>
          <img src={spriteOptions[spriteIndex]} alt={selectedPokemon.name} className="pokemon-image" />
          <button onClick={handleNextSprite} disabled={spriteOptions.length <= 1} className="nav-button"><i className="fa-solid fa-angle-right"/></button>
        </div>

        <div className="pokemon-info-container">
          <div className="pokemon-info-box"><strong>Height:</strong> {selectedPokemon.height / 10} m</div>
          <div className="pokemon-info-box"><strong>Weight:</strong> {selectedPokemon.weight / 10} kg</div>
          <div className="pokemon-info-box"><strong>Base Experience:</strong> {selectedPokemon.base_experience}</div>
        </div>

        <div className="pokemon-details">
          <div className="pokemon-stats">
            <h3>Stats</h3>
            <ul>
              {selectedPokemon.stats.map((stat) => (
                <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
              ))}
            </ul>
          </div>
          <div className="pokemon-moves">
            <h3>Movements</h3>
            <ul>
              {selectedPokemon.moves.slice(0, 5).map((move) => (
                <li key={move.move.name}>{move.move.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Attributes;
