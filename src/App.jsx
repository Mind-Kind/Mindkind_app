import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout.jsx';
import Dashboard from '../Pages/Dashboard.jsx';
import MoodTracker from '../Pages/MoodTracker.jsx';
import Journal from '../Pages/Journal.jsx';
import Meditations from '../Pages/Meditations.jsx';
import AudioLibrary from '../Pages/AudioLibrary.jsx';
import Challenges from '../Pages/Challenges.jsx';
import ChallengeDetail from '../Pages/ChallengeDetail.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mood-tracker" element={<MoodTracker />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/audio-library" element={<AudioLibrary />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge-detail" element={<ChallengeDetail />} />
        <Route path="/ai-chat" element={<div className="p-8 text-center">AI Chat coming soon!</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
