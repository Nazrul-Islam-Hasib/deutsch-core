import React, { useState, useEffect } from 'react';
import { quizApi } from '../services/api/quizApi';
import type { QuizQuestion } from '../types/index';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await quizApi.getQuiz(5);
      if (response.success) {
        setQuestions(response.data);
        setCurrentIdx(0);
        setScore(0);
        setShowResults(false);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setError(String(response.error));
      }
    } catch (err) {
      setError('QUIZ_LOAD_FAILURE: ADD_MINIMUM_4_ENTRIES_TO_GENERATE.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    if (option === questions[currentIdx]?.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-high border-l-4 border-error p-10 text-center max-w-xl mx-auto mt-10">
        <p className="font-headline text-xl font-bold text-error mb-4 uppercase tracking-widest">QUIZ_INTERFACE_ERROR</p>
        <p className="font-body text-on-surface-variant mb-8">{error}</p>
        <button onClick={fetchQuiz} className="px-8 py-3 bg-primary text-on-primary font-headline text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,124,245,0.4)]">
          REINITIALIZE_SYSTEM
        </button>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-12">
        <div className="bg-surface-container-high p-12 text-center border-l-4 border-primary shadow-[0_0_60px_rgba(255,124,245,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
          <h2 className="font-headline text-5xl font-black mb-8 crt-glow uppercase">SESSION_COMPLETE</h2>
          
          <div className="flex justify-center mb-10">
            <div className="relative w-48 h-48 flex items-center justify-center border-2 border-primary/20 bg-black/40">
              <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
              <div className="text-center z-10">
                <p className="text-6xl font-headline font-black text-primary crt-glow">{score}</p>
                <div className="h-[2px] w-12 bg-on-surface/20 mx-auto my-2"></div>
                <p className="text-2xl font-headline font-bold text-on-surface-variant">{questions.length}</p>
              </div>
            </div>
          </div>

          <p className="font-headline text-xl mb-12 tracking-widest text-on-surface uppercase">
            {percentage === 100 ? "PERFECT_SCORE! NEURAL_MAPPING_OPTIMIZED." : 
             percentage > 50 ? "THRESHOLD_PASSED. STABILITY_REACHED." : 
             "LOWER_THRESHOLD_DETECTED. REPETITION_REQUIRED."}
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button onClick={fetchQuiz} className="px-10 py-4 bg-primary text-on-primary font-headline font-black text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(255,124,245,0.4)] hover:scale-105 transition-all">
              RESTART_DRILL
            </button>
            <button onClick={() => window.location.href = '/'} className="px-10 py-4 border border-outline-variant/30 text-on-surface font-headline font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-all">
              EXIT_TO_LEXICON
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-6">
      <div className="flex justify-between items-end border-b border-outline-variant/20 pb-8">
        <div>
          <p className="font-headline text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 cyan-glow">SESSION // DRILL_IDENTIFIER</p>
          <h2 className="font-headline text-5xl font-black tracking-tighter text-on-surface crt-glow uppercase">NEURAL_PROBE</h2>
        </div>
        <div className="flex gap-4">
           <div className="bg-surface-container-low px-4 py-2 border-r-4 border-secondary">
              <p className="text-[8px] font-bold text-purple-400/60 uppercase tracking-widest">SCORE</p>
              <p className="text-xl font-headline font-black text-on-surface">{score}</p>
           </div>
           <div className="bg-surface-container-low px-4 py-2 border-r-4 border-primary">
              <p className="text-[8px] font-bold text-purple-400/60 uppercase tracking-widest">ITEM</p>
              <p className="text-xl font-headline font-black text-on-surface">{currentIdx + 1} / {questions.length}</p>
           </div>
        </div>
      </div>

      <div className="bg-surface-container-high p-10 border-l border-outline-variant/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
        <div className="text-center space-y-4 mb-12 relative z-10">
          <span className="font-headline text-xl text-primary font-black uppercase italic tracking-widest drop-shadow-[0_0_8px_rgba(255,124,245,0.3)]">
            {currentQuestion?.article}
          </span>
          <h2 className="font-headline text-6xl md:text-7xl font-black text-on-surface crt-glow uppercase leading-none">{currentQuestion?.germanWord}</h2>
          <p className="font-headline text-[10px] text-purple-400/40 tracking-[0.4em] pt-4 uppercase">SELECT_CORRECT_TRANSLATION</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {currentQuestion?.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelect(option)}
              className={`p-6 font-headline text-lg font-bold tracking-widest uppercase transition-all duration-300 border-l-4 text-left relative overflow-hidden ${
                isAnswered 
                  ? option === currentQuestion.correctAnswer 
                    ? 'bg-secondary/20 border-secondary text-secondary cyan-glow' 
                    : option === selectedAnswer 
                      ? 'bg-error/20 border-error text-error' 
                      : 'bg-black/10 border-outline-variant/20 text-on-surface/20'
                  : 'bg-surface-container-lowest border-primary/40 text-on-surface hover:bg-primary/10 hover:border-primary group'
              }`}
              disabled={isAnswered}
            >
              {option}
              {!isAnswered && <div className="absolute bottom-0 left-0 h-[1px] bg-primary w-0 group-hover:w-full transition-all duration-500"></div>}
            </button>
          ))}
        </div>

        <div className="mt-12 flex justify-end h-16">
          {isAnswered && (
            <button 
              onClick={nextQuestion} 
              className="px-12 py-4 bg-primary text-on-primary font-headline font-black text-xs tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(255,124,245,0.4)] hover:scale-105 transition-all flex items-center gap-3 animate-pulse"
            >
              {currentIdx + 1 === questions.length ? 'FINALIZE_SESSION' : 'NEXT_PROBE'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="w-full bg-surface-container-lowest h-[2px] relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 bg-secondary h-full transition-all duration-700 shadow-[0_0_8px_#00f1fd]"
          style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizPage;
