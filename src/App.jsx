import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ArticleDetails from './pages/ArticleDetails';
import DetailedResults from "./pages/DetailedResults";
import Home from "./pages/Home";
import Results from "./pages/Results";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/results" element={<Results/>} />
        <Route path="/detailed-results" element={<DetailedResults />} />
        <Route path="/article-details" element={<ArticleDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App