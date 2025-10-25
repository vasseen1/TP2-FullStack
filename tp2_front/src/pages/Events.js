import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    label: "",
    startDate: "",
    endDate: ""
  });

useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:8080/events")
      .then(res => res.json())
      .then(data => setEvents(data.content))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:8080/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur à l'ajout de l'événement");
        return res.json();
      })
      .then(() => {
        fetchEvents();      // rafraîchir la liste
        setShowForm(false);  // fermer le formulaire
        setNewEvent({ label: "", startDate: "", endDate: "" });
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Événements</h1>
      <button onClick={() => setShowForm(!showForm)}>+ Ajouter un événement</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="label"
            placeholder="Nom de l'événement"
            value={newEvent.label}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="startDate"
            value={newEvent.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleChange}
            required
          />
          <button type="submit">Créer</button>
        </form>
      )}

      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
