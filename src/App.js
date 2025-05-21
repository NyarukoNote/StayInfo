import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import MotelPage from "./pages/motelpage/Motelpage";
import MotelDetailPage from "./pages/moteldetailpage/Moteldetailpage";
import MotelComparison from "./pages/motelcomparison/MotelComparison";
import AIChatbot from "./pages/aichatbot/Aichatbot";
import TourInfo from "./pages/tourinfo/Tourinfo";
import TourDetail from "./pages/tourdetail/Tourdetail";
import MotelMapPage from "./pages/motelmappage/Motelmappage";
import MotelSelectPage from "./pages/tourplan/MotelSelectPage";
import TourSelectPage from "./pages/tourplan/TourSelectPage";
import TourplanPage from "./pages/tourplan/Tourplan";
import TourResultPage from "./pages/tourplan/TourResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motel" element={<MotelPage />} />
        <Route path="/motelmap" element={<MotelMapPage />} />
        <Route path="/motel/:name" element={<MotelDetailPage />} />
        <Route path="/motelcomparison" element={<MotelComparison />} />
        <Route path="/aichatbot" element={<AIChatbot />} />
        <Route path="/tourinfo" element={<TourInfo />} />
        <Route path="/tour/:contentid" element={<TourDetail />} />
        <Route path="/plan/motel" element={<MotelSelectPage />} />
        <Route path="/plan/tour" element={<TourSelectPage />} />
        <Route path="/plan" element={<TourplanPage />} />
        <Route path="/plan/result" element={<TourResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
