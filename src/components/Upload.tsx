import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Key } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';

export default function Upload() {
  const navigate = useNavigate();
  const { apiKey, setApiKey } = useApiKey();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.includes('word') || selectedFile.type.includes('document')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a Word document (.doc or .docx)');
      }
    }
  };

  const handleAnalyze = () => {
    if (!apiKey) {
      setError('Please enter your OpenRouter API key');
      return;
    }
    if (!file) {
      setError('Please select a file first');
      return;
    }
    navigate('/analysis', { state: { file } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Legal Document Analyzer</h1>
          <p className="mt-2 text-gray-600">Upload your legal document for analysis</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-2 p-4 border-2 border-gray-300 border-dashed rounded-lg bg-white">
            <Key className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter OpenRouter API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>

          <label className="flex flex-col items-center p-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
            <UploadIcon className="w-12 h-12 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              {file ? file.name : 'Click to upload or drag and drop'}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </label>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || !apiKey}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Analyze Document
          </button>
        </div>
      </div>
    </div>
  );
}