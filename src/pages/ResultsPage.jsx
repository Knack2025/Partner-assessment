import React, { useRef } from "react";
import sections from "../data/sections";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import emailjs from "emailjs-com";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ResultsPage({ responses, userEmail }){
  const analysisRef = useRef();

  const sectionScores = sections.map((sec, sIdx) => 
    sec.questions.reduce((sum, _, qIdx) => sum + (responses[`${sIdx}-${qIdx}`] || 0), 0)
  );

  const totalScore = sectionScores.reduce((a,b)=>a+b, 0);

  const pieData = {
    labels: sections.map(s=>s.name),
    datasets: [{
      data: sectionScores,
      backgroundColor: ['#8884d8','#82ca9d','#ffc658','#FF7052'],
      hoverOffset: 4
    }]
  };

  const barData = {
    labels: sections.map(s=>s.name),
    datasets: [{
      label: 'Section Scores',
      data: sectionScores,
      backgroundColor: '#FF7052'
    }]
  };

  const generatePDF = async () => {
    const input = analysisRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p','pt','a4');
    const imgProps = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('knack-assessment.pdf');
  };

  const sendEmail = () => {
    const templateParams = {
      to_email: userEmail || '',
      total_score: totalScore,
      section_scores: JSON.stringify(sectionScores)
    };
    // Update the following with your EmailJS service/template/user IDs
    emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',templateParams,'YOUR_USER_ID')
      .then(()=>alert('Results emailed (if configured).'))
      .catch(()=>alert('EmailJS send failed. Configure your IDs.'));
  };

  const rating = (score) => {
    if(score >= 400) return 'High Performing';
    if(score >= 300) return 'Maturing';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto" ref={analysisRef}>
      <h2 className="text-2xl font-semibold mb-4">Your Ecosystem Maturity Overview</h2>
      <p className="mb-2"><strong>Total Score:</strong> {totalScore} / 2000</p>
      <p className="mb-6"><strong>Overall Rating:</strong> {rating(totalScore)}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <h3 className="font-semibold mb-2">Performance Breakdown</h3>
          <Bar data={barData} />
        </div>
        <div className="p-4 border rounded bg-white">
          <h3 className="font-semibold mb-2">Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {sections.map((s, idx)=>(
          <div key={idx} className="p-3 border rounded">
            <strong>{s.name}:</strong> {rating(sectionScores[idx])} — Score: {sectionScores[idx]}
            <p className="text-sm text-gray-600 mt-1">Key insight summary for {s.name} goes here.</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={generatePDF} className="px-5 py-3 bg-black text-white rounded">Download PDF</button>
        <button onClick={sendEmail} className="px-5 py-3 bg-coral text-white rounded">Email Results</button>
      </div>
    </div>
  );
}
