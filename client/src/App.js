import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Appbar from './components/appbar';
import Zones from './pages/zones.js';
import Records from './pages/records.js';
import Compartments from './pages/compartments.js';

function App() {
  return (
    <div className="App">
      <Appbar></Appbar>
      <Router>
        <Routes>
          <Route path="/zones/:compartmentID" element={<Zones/>}/>
          <Route path="/:compartmentID/records/:ocid/:name" element={<Records />} />
          <Route path="/" Component={Compartments}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
