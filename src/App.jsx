import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import StepPage from "./pages/StepPage";
import ResultsPage from "./pages/ResultsPage";
import sections from "./data/sections";

function App(){
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [userEmail, setUserEmail] = useState("");

  const handleAnswer = (sectionIndex, questionIndex, value) => {
    setResponses(prev => ({ ...prev, [`${sectionIndex}-${questionIndex}`]: value }));
  };

  const next = (currentIndex) => {
    if(currentIndex < sections.length - 1){
      navigate(`/step/${currentIndex+1}`);
    } else {
      navigate('/results');
    }
  };

  const prev = (currentIndex) => {
    if(currentIndex > 0){
      navigate(`/step/${currentIndex-1}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-work">
      <header className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <img src="/knack-logo.png" alt="Knack Collective" className="h-10"/>
          <h1 className="text-xl font-semibold">Knack Collective — Partner Assessment</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <Routes>
          {sections.map((section, idx) => (
            <Route key={idx} path={`/step/${idx}`} element={
              <StepPage
                section={section}
                sectionIndex={idx}
                responses={responses}
                onAnswer={handleAnswer}
                onNext={() => next(idx)}
                onPrev={() => prev(idx)}
                setUserEmail={setUserEmail}
                userEmail={userEmail}
              />
            }/>
          ))}
          <Route path="/" element={<div className="p-8"><button className="px-6 py-3 bg-coral text-white rounded" onClick={()=>navigate('/step/0')}>Start Assessment</button></div>} />
          <Route path="/results" element={<ResultsPage responses={responses} userEmail={userEmail} />} />
        </Routes>
      </main>

      <footer className="p-6 text-center text-sm border-t">
        © {new Date().getFullYear()} Knack Collective
      </footer>
    </div>
  )
}

export default App;
