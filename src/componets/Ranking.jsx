import { db } from "../firebase";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import "../Ranking.css";

function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function fetchRanking() {
      const q = query(collection(db, "Ranking"), orderBy("Points", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const topUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRanking(topUsers);
    }

    fetchRanking();
  }, []);

  return (
    <div className="ranking-container">
      <h2 className="ranking-title">Top Players</h2>
      <ol className="ranking-list">
        {ranking.map((user, index) => (
          <li key={user.id} className="ranking-item">
            <span className="ranking-position">{index + 1}.</span>
            <span className="ranking-name">{user.userName} </span>
            <span className="ranking-points">{user.Points} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );  
}

export default Ranking;
