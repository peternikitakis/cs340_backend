import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/students">Students</Link>
      <Link to="/events">Events</Link>
      <Link to="/organizations">Organizations</Link>
      <Link to="/locations">Locations</Link>
      <Link to="/registrations">Registrations</Link>
    </nav>
  );
}
