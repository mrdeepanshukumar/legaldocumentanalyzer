import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import DocumentEditorComponent from './DocumentEditor';
import { analyzeDocument } from '../utils/documentAnalysis';
import { useApiKey } from '../contexts/ApiKeyContext';
import type { DocumentAnalysis } from '../types';

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiKey } = useApiKey();
  const [content, setContent] = useState<string>('');
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const file = location.state?.file;
    if (!file) {
      navigate('/');
      return;
    }

    const analyzeFile = async () => {
      try {
        setLoading(true);
        const result = await analyzeDocument(file, apiKey);
        setAnalysis(result);
        
        // Read file content for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setContent(e.target?.result as string);
        };
        reader.readAsText(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze document');
      } finally {
        setLoading(false);
      }
    };

    analyzeFile();
  }, [location.state, apiKey, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Analyzing document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to upload</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="flex-1 overflow-auto p-6">
          <DocumentEditorComponent content={content} />
        </div>
        
        <div className="w-96 bg-white p-6 overflow-auto border-l">
          <h2 className="text-xl font-bold mb-6">Document Analysis</h2>
          {analysis && (
            <dl className="space-y-4">
              {Object.entries(analysis).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-gray-500">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}