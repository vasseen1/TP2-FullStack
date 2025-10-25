import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newArtist, setNewArtist] = useState({ label: "" });

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = () => {
    fetch("http://localhost:8080/artists")
      .then(res => res.json())
      .then(data => setArtists(data.content))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:8080/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArtist)
    })
      .then(res => res.json())
      .then(() => {
        fetchArtists();
        setShowForm(false);
        setNewArtist({ label: "" });
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Artistes</h1>
      <button onClick={() => setShowForm(!showForm)}>+ Ajouter un artiste</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="label"
            placeholder="Nom de l'artiste"
            value={newArtist.label}
            onChange={handleChange}
            required
          />
          <button type="submit">Créer</button>
          <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
        </form>
      )}

      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            <Link to={`/artists/${artist.id}`}>{artist.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
