
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EconomicData } from './pages/EconomicData';
import { News } from './pages/News';
import { AssetDetail } from './pages/AssetDetail';
import { MacroDetail } from './pages/MacroDetail';
import { Settings } from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/economic" element={<EconomicData />} />
          <Route path="/macro/:id" element={<MacroDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
