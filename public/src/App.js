import HomePage from "./pages/HomePage";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navigation from "./components/Navigation";

// Browse pages
import StudentsList from "./pages/browse/StudentsList";
import EventsList from "./pages/browse/EventsList";
import OrganizationsList from "./pages/browse/OrganizationsList"
import LocationsList from "./pages/browse/LocationsList"
import RegistrationsList from "./pages/browse/RegistrationsList"

function App() {
  return (
    <BrowserRouter>
      {/* now just this one line */}
      <Navigation />
      <Routes>

        <Route path="/"             element={<HomePage />} />
        <Route path="/students"     element={<StudentsList />} />
        <Route path="/events"       element={<EventsList />}   />
        <Route path="/locations"       element={<LocationsList />}   />
        <Route path="/organizations"       element={<OrganizationsList />}   />
        <Route path="/registrations"       element={<RegistrationsList />}   />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
