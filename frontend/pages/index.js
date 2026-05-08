import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisData(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        'Failed to analyze resume. Please ensure the backend is running and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <Head>
        <title>AI Resume Analysis Pro</title>
      </Head>

      <main className="container mx-auto">
        <AnimatePresence mode="wait">
          {!analysisData ? (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center min-h-[80vh]"
            >
              <FileUpload onUpload={handleUpload} isLoading={loading} error={error} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Dashboard data={analysisData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
