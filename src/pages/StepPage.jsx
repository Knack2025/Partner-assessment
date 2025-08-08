import React from "react";

const OPTIONS = [
  { label: "Level 1", value: 25 },
  { label: "Level 2", value: 50 },
  { label: "Level 3", value: 75 },
  { label: "Level 4", value: 100 }
];

export default function StepPage({ section, sectionIndex, responses, onAnswer, onNext, onPrev, setUserEmail, userEmail }){
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
      <form onSubmit={(e)=>{ e.preventDefault(); onNext(); }}>
        {section.questions.map((q, qIdx) => (
          <div key={qIdx} className="mb-4 p-4 border rounded">
            <p className="mb-2">{q}</p>
            <div className="flex gap-4">
              {OPTIONS.map((opt, oIdx)=>(
                <label key={oIdx} className="flex items-center space-x-2">
                  <input type="radio" name={`q-${sectionIndex}-${qIdx}`} value={opt.value}
                    checked={responses[`${sectionIndex}-${qIdx}`] === opt.value}
                    onChange={()=>onAnswer(sectionIndex, qIdx, opt.value)} />
                  <span>{opt.label} ({opt.value})</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <div>
            {sectionIndex > 0 && <button type="button" onClick={onPrev} className="px-4 py-2 border rounded">Back</button>}
          </div>
          <div className="flex items-center space-x-4">
            {sectionIndex === 0 && <input required type="email" placeholder="Your email" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} className="px-3 py-2 border rounded" />}
            <button type="submit" className="px-6 py-3 rounded bg-coral text-white">Next</button>
          </div>
        </div>
      </form>
    </div>
  )
}
