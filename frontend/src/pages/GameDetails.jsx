import { useParams } from "react-router-dom";

export default function GameDetails() {
  const { id } = useParams();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📄 Game Details</h1>
      <p>Details for game ID: {id}</p>
    </div>
  );
}
