import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubjectView from './pages/SubjectView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subject/:subjectName" element={<SubjectView />} />
      </Routes>
    </Router>
  );
}

export default App;
