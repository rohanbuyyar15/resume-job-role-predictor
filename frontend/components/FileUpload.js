import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ onUpload, isLoading, error }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
          AI Resume Analysis Pro
        </h1>
        <p className="text-slate-400 text-lg">
          Upload your resume (up to 20 pages) for deep AI analysis and role prediction.
        </p>
      </motion.div>

      <div
        {...getRootProps()}
        className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700/50 hover:border-slate-600'}
          ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
          ${isLoading ? 'opacity-80 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-slate-200">Analyzing your resume...</h3>
                <p className="text-sm text-slate-400">Our AI is processing your experience and skills.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/80 text-slate-400'}`}>
                {isDragReject ? <AlertCircle className="w-12 h-12 text-red-500" /> : <UploadCloud className="w-12 h-12" />}
              </div>
              <div className="space-y-1">
                <p className="text-xl font-medium text-slate-200">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your PDF resume"}
                </p>
                <p className="text-sm text-slate-500">
                  or click to browse files
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
