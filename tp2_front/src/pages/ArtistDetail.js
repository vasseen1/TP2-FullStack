import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editArtist, setEditArtist] = useState({ label: "" });

  useEffect(() => {
    fetch(`http://localhost:8080/artists/${id}`)
      .then(res => res.json())
      .then(data => {
        setArtist(data);
        setEditArtist({ label: data.label });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = e => {
    setEditArtist({ ...editArtist, [e.target.name]: e.target.value });
  };

  const handleUpdate = e => {
    e.preventDefault();
    fetch(`http://localhost:8080/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editArtist)
    })
      .then(res => res.json())
      .then(data => {
        setArtist(data);
        setIsEditing(false);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet artiste ?")) {
      fetch(`http://localhost:8080/artists/${id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la suppression");
          navigate("/artists");
        })
        .catch(err => console.error(err));
    }
  };

  if (!artist) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{artist.label}</h1>
      {!isEditing ? (
        <>
          <button onClick={() => setIsEditing(true)}>Modifier</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px", color: "red" }}>
            Supprimer
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="label"
            value={editArtist.label}
            onChange={handleChange}
            required
          />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
        </form>
      )}
    </div>
  );
}
