import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // pour revenir à la liste après suppression
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editEvent, setEditEvent] = useState({ label: "", startDate: "", endDate: "" });

  useEffect(() => {
    fetch(`http://localhost:8080/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setEditEvent({
          label: data.label,
          startDate: data.startDate,
          endDate: data.endDate
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = e => {
    setEditEvent({ ...editEvent, [e.target.name]: e.target.value });
  };

  const handleUpdate = e => {
    e.preventDefault();
    fetch(`http://localhost:8080/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editEvent)
    })
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        setIsEditing(false);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      fetch(`http://localhost:8080/events/${id}`, {
        method: "DELETE"
      })
        .then(res => {
          if (!res.ok) throw new Error("Erreur lors de la suppression");
          navigate("/events"); // revenir à la liste
        })
        .catch(err => console.error(err));
    }
  };

  if (!event) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{event.label}</h1>
      {!isEditing ? (
        <>
          <p>Début : {event.startDate}</p>
          <p>Fin : {event.endDate}</p>
          <h3>Artistes :</h3>
          <ul>
            {event.artists.map(artist => (
              <li key={artist.id}>{artist.label}</li>
            ))}
          </ul>
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
            value={editEvent.label}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="startDate"
            value={editEvent.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={editEvent.endDate}
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
