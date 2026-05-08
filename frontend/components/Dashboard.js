import { motion } from 'framer-motion';
import { 
  Briefcase, CheckCircle, Target, TrendingUp,
  AlertTriangle, Lightbulb, ExternalLink, RefreshCw,
  Award, DollarSign, MessageSquare, FileText, Star
} from 'lucide-react';

export default function Dashboard({ data, onReset }) {
  if (!data) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Analysis Results
          </h2>
          <p className="text-slate-400 mt-2">Here is a detailed breakdown of your resume against industry standards.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all shadow-lg hover:shadow-blue-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-medium">Analyze Another</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Top Roles & Scores */}
        <div className="col-span-1 lg:col-span-4 space-y-8">
          {/* Main Scores */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col space-y-6"
          >
            <div className="flex items-center justify-around">
              <div className="text-center relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 mb-1">{data.match_score || 0}%</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-2">Match Score</div>
              </div>
              <div className="w-px h-16 bg-slate-700/50"></div>
              <div className="text-center relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-600 mb-1">{data.benchmark_score || 0}%</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-2">Benchmark</div>
              </div>
            </div>

            {data.keyword_match_rate !== undefined && (
              <>
                <div className="h-px w-full bg-slate-700/50"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-300">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="font-medium">Keyword Match Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{data.keyword_match_rate}%</div>
                </div>
              </>
            )}
          </motion.div>

          {/* Top Roles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-slate-200 flex items-center mb-6">
              <Briefcase className="w-6 h-6 mr-3 text-blue-400" />
              Predicted Roles
            </h3>
            {data.roles?.map((role, idx) => (
              <div key={idx} className="glass-card p-6 relative overflow-hidden group hover:border-slate-600 transition-colors">
                <div 
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" 
                  style={{ width: `${role.match_percentage || role.score || 0}%` }}
                ></div>
                
                <div className="flex justify-between items-start mt-2 mb-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{role.name}</h4>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                      {role.match_percentage || role.score || 0}% Match
                    </span>
                    {role.ats_score && (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold flex items-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <Award className="w-3 h-3 mr-1" /> ATS {role.ats_score}
                      </span>
                    )}
                  </div>
                </div>

                {role.salary_estimate && (
                  <div className="flex items-center text-emerald-400 text-sm font-medium mb-3 bg-emerald-400/5 inline-flex px-2 py-1 rounded">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {role.salary_estimate}
                  </div>
                )}

                {role.description && (
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed border-b border-slate-700/50 pb-3">
                    {role.description}
                  </p>
                )}
                
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 italic">
                    <span className="font-semibold text-slate-300 not-italic block mb-1">Why this fits:</span>
                    {role.reason}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Deep Analysis */}
        <div className="col-span-1 lg:col-span-8 space-y-8">
          {/* Gap Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold text-slate-200 flex items-center mb-6">
              <Target className="w-6 h-6 mr-3 text-indigo-400" />
              Advanced Gap Analysis
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {data.advanced_gap_analysis?.map((item, idx) => {
                const isStrong = item.status.includes('Strongly');
                const isPartial = item.status.includes('Partially');
                const isMentioned = item.status.includes('Mentioned');
                
                let statusColor = "text-red-400 bg-red-400/10 border-red-400/20";
                if (isStrong) statusColor = "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
                else if (isPartial) statusColor = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
                else if (isMentioned) statusColor = "text-orange-400 bg-orange-400/10 border-orange-400/20";

                return (
                  <div key={idx} className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <span className="font-bold text-lg text-white">{item.skill}</span>
                      <span className={`text-xs px-3 py-1.5 rounded-full border mt-2 md:mt-0 w-max font-medium tracking-wide ${statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 flex items-start bg-slate-900/50 p-3 rounded-lg">
                      <Lightbulb className="w-5 h-5 mr-3 shrink-0 text-yellow-500/80" />
                      <span className="leading-relaxed">{item.suggestion}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Roadmap */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-slate-200 flex items-center mb-6">
                <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                Personalized Roadmap
              </h3>
              <ul className="space-y-4">
                {data.roadmap?.map((step, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300 group">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 mr-3 shrink-0 text-xs font-bold border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Suggestions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-slate-200 flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
                Resume Suggestions
              </h3>
              <ul className="space-y-4">
                {data.suggestions?.map((sugg, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 mr-3 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <span className="leading-relaxed">{sugg}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* New Sections: Interview Prep & Formatting Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.interview_questions && data.interview_questions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card p-6 md:p-8 border-t-4 border-t-purple-500/50"
              >
                <h3 className="text-xl font-bold text-slate-200 flex items-center mb-6">
                  <MessageSquare className="w-6 h-6 mr-3 text-purple-400" />
                  Interview Prep
                </h3>
                <ul className="space-y-3">
                  {data.interview_questions.map((q, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-300 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <span className="text-purple-400 font-bold mr-2">Q:</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {data.formatting_tips && data.formatting_tips.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 md:p-8 border-t-4 border-t-blue-500/50"
              >
                <h3 className="text-xl font-bold text-slate-200 flex items-center mb-6">
                  <FileText className="w-6 h-6 mr-3 text-blue-400" />
                  ATS Formatting Tips
                </h3>
                <ul className="space-y-3">
                  {data.formatting_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 mr-3 shrink-0 text-blue-500 mt-0.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Job Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold text-slate-200 flex items-center mb-6">
              <ExternalLink className="w-6 h-6 mr-3 text-blue-400" />
              Quick Apply Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.job_links?.map((job, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group">
                  <h4 className="font-bold text-white mb-4 text-sm truncate" title={job.role}>{job.role}</h4>
                  <div className="flex space-x-3 text-sm font-medium">
                    <a href={job.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-3 py-2 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#4B84E3] rounded-lg hover:bg-[#0A66C2]/20 transition-all">
                      LinkedIn
                    </a>
                    <a href={job.indeed} target="_blank" rel="noopener noreferrer" className="flex-1 text-center px-3 py-2 bg-[#003A9B]/10 border border-[#003A9B]/20 text-[#4B84E3] rounded-lg hover:bg-[#003A9B]/20 transition-all">
                      Indeed
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
