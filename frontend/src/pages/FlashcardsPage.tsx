import React, { useState, useEffect } from 'react';
import { useWordStore } from '../store/useWordStore';

const FlashcardsPage: React.FC = () => {
  const { words, fetchWords, isLoading, updateProgress } = useWordStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const handleKnown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentWord = words[currentIndex];
    if (currentWord) {
      await updateProgress(currentWord.id, true);
      handleNext();
    }
  };

  const handleUnknown = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentWord = words[currentIndex];
    if (currentWord) {
      await updateProgress(currentWord.id, false);
      handleNext();
    }
  };

  if (isLoading && words.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="bg-surface-container-low p-12 text-center border border-outline-variant/10 max-w-2xl mx-auto mt-10">
        <p className="font-headline tracking-widest text-on-surface-variant uppercase">DATABASE_EMPTY. NO_FLASHCARDS_AVAILABLE.</p>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-outline-variant/20 pb-8">
        <div>
          <p className="font-headline text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 cyan-glow">SESSION // NEURAL_DRILL_V.01</p>
          <h2 className="font-headline text-5xl font-black tracking-tighter text-on-surface crt-glow uppercase">FLASHCARDS</h2>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low px-4 py-2 border-r-4 border-secondary">
            <p className="text-[8px] font-bold text-purple-400/60 uppercase tracking-widest">PROGRESS</p>
            <p className="text-xl font-headline font-black text-on-surface uppercase">
              {currentIndex + 1} / {words.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-12">
        {/* Flashcard container with flip animation */}
        <div 
          className="relative w-full aspect-[16/9] md:aspect-[2/1] cursor-pointer perspective-1000 group"
          onClick={handleFlip}
        >
          <div 
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-surface-container-high border-l-4 border-primary flex flex-col items-center justify-center p-12 shadow-[0_0_40px_rgba(255,124,245,0.1)] overflow-hidden">
              <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
              <span className="font-headline text-xl font-black text-primary italic mb-6 uppercase tracking-widest">{currentWord?.article}</span>
              <h2 className="font-headline text-6xl md:text-8xl font-black text-center text-on-surface crt-glow leading-none uppercase">{currentWord?.germanWord}</h2>
              <div className="mt-12 font-headline text-[10px] text-purple-400/40 uppercase tracking-[0.4em] animate-pulse">TAP_TO_REVEAL_DATA</div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-surface-container-highest border-l-4 border-secondary flex flex-col items-center justify-center p-12 shadow-[0_0_40px_rgba(0,241,253,0.1)] overflow-hidden">
              <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
              <h2 className="font-headline text-5xl md:text-7xl font-black text-center text-secondary cyan-glow mb-6 uppercase">{currentWord?.translation}</h2>
              <span className="font-headline text-xs font-bold text-on-surface-variant tracking-[0.3em] bg-black/40 px-4 py-2 uppercase mb-12 border border-outline-variant/20">{currentWord?.wordType}</span>
              
              <div className="flex gap-6 z-10">
                <button 
                  onClick={handleUnknown}
                  className="px-6 py-3 border border-error/40 text-error font-headline text-[10px] font-black tracking-widest uppercase hover:bg-error/10 transition-colors"
                >
                  STILL_LEARNING
                </button>
                <button 
                  onClick={handleKnown}
                  className="px-6 py-3 bg-secondary text-on-secondary font-headline text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(0,241,253,0.3)] hover:brightness-110 transition-all"
                >
                  DATA_MASTERED
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev} 
            className="w-12 h-12 bg-surface-container-low text-secondary flex items-center justify-center border border-secondary/20 hover:bg-secondary/10 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <button 
            onClick={handleFlip} 
            className="px-10 py-4 bg-surface-bright text-primary font-headline font-black text-xs tracking-[0.2em] uppercase border-r-4 border-primary shadow-[0_0_20px_rgba(255,124,245,0.2)] hover:bg-surface-container-highest transition-all active:scale-95"
          >
            {isFlipped ? 'RELOAD' : 'SHOW_DATA'}
          </button>
          
          <button 
            onClick={handleNext} 
            className="w-12 h-12 bg-surface-container-low text-secondary flex items-center justify-center border border-secondary/20 hover:bg-secondary/10 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl space-y-4 pt-12">
          <div className="flex justify-between items-center font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/40 uppercase">
            <span>BIT_STREAM_PROGRESS</span>
            <span>{Math.round(((currentIndex + 1) / words.length) * 100)}%</span>
          </div>
          <div className="w-full bg-surface-container-lowest h-[2px] relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 bg-primary h-full transition-all duration-500 shadow-[0_0_8px_#ff7cf5]"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
