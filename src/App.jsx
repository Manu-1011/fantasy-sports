import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamContext';
import Header from './components/Header';
import Home from './pages/Home';
import CreateTeam from './pages/CreateTeam';
import Summary from './pages/Summary';

function App() {
  return (
    <TeamProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/summary" element={<Summary />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TeamProvider>
  );
}

export default App;
