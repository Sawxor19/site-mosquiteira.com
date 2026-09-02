import { HashRouter, Route, Routes } from 'react-router-dom';
import ModeloDetalhe from './pages/ModeloDetalhe';
import SitePublico from './pages/SitePublico';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/modelos/:slug" element={<ModeloDetalhe />} />
        <Route path="/*" element={<SitePublico />} />
      </Routes>
    </HashRouter>
  );
}
