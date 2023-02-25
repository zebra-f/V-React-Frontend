import { Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Vees from "./components/Vees";
import About from "./components/About";
import Length from "./components/Length";
import Speed from "./components/Speed";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="xl">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="vees" element={<Vees />}>
            <Route path="length" element={<Length />} />
            <Route path="" element={<Speed />} />
          </Route>
          <Route path="about" element={<About />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
