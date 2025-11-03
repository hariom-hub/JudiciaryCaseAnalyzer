import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CaseDetail = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cases/${id}`);
        if (res.data.success) {
          setCaseData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching case detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetail();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading case details...</p>;
  if (!caseData) return <p className="text-center mt-5">Case not found.</p>;

  return (
    <div className="p-6">
      <Link to="/cases" className="bg-gray-100 px-3 py-2 rounded">← Back to Cases</Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">{caseData.title}</h1>
        <div className="flex gap-4 items-center">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded">{caseData.status}</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{caseData.caseType}</span>
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded">{caseData.caseNumber}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Case Information</h2>
          <p><strong>Case Number:</strong> {caseData.caseNumber}</p>
          <p><strong>Type:</strong> {caseData.caseType}</p>
          <p><strong>Status:</strong> {caseData.status}</p>
          <p><strong>Court:</strong> {caseData.court}</p>
          <p><strong>Filing Date:</strong> {new Date(caseData.filingDate).toLocaleDateString()}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Parties</h2>
          <p><strong>Plaintiffs:</strong> {caseData.plaintiffs?.join(", ")}</p>
          <p><strong>Defendants:</strong> {caseData.defendants?.join(", ")}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Case Text</h2>
        <pre className="bg-gray-50 p-4 rounded border">{caseData.caseText}</pre>
      </div>
    </div>
  );
};

export default CaseDetail;
