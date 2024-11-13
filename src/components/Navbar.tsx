import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollText, Key } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import { useApiKey } from '../context/ApiKeyContext';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { apiKey } = useApiKey();
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <ScrollText className="h-8 w-8 text-indigo-600" />
                <span className="font-semibold text-xl text-gray-900">LegalDocs</span>
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Key className="h-4 w-4" />
                <span className="text-sm">{apiKey ? 'Update API Key' : 'Set API Key'}</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Upload
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}