import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/events">Événements</Link> | <Link to="/artists">Artistes</Link>
      </nav>
      <Routes>
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
