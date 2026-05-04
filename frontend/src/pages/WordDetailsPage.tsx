import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordStore } from '../store/useWordStore';

const WordDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWord, isLoading, error, fetchWordById } = useWordStore();

  const playPronunciation = () => {
    if (!currentWord?.germanWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.germanWord);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (id) {
      fetchWordById(id);
    }
  }, [id, fetchWordById]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !currentWord) {
    return (
      <div className="bg-error-container/20 border-l-4 border-error p-8 max-w-2xl mx-auto mt-10">
        <p className="font-headline tracking-widest text-error mb-4 uppercase">ERROR_DETECTION: {error || 'WORD_NOT_FOUND'}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-surface-container-high text-on-surface font-headline text-xs tracking-widest uppercase hover:bg-surface-bright transition-colors">
          RETURN_TO_BASE
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Detail Header */}
      <div className="border-b border-outline-variant/20 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-headline text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 cyan-glow">VOCABULARY // DATA_VISUALIZATION</p>
          <div className="flex items-baseline gap-4">
             {currentWord.article && (
               <span className="font-headline text-3xl font-black text-primary italic uppercase">
                 {currentWord.article}
               </span>
             )}
             <h2 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-on-surface crt-glow uppercase leading-none">
               {currentWord.germanWord}
             </h2>
             <button 
               onClick={playPronunciation}
               className="group flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/30 hover:bg-secondary/20 transition-all"
               title="PLAY_AUDIO_SIGNAL"
             >
               <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">volume_up</span>
               <span className="font-headline text-[8px] font-bold text-secondary tracking-widest hidden md:block">SIGNAL_OUTPUT</span>
             </button>
          </div>
          <p className="font-headline text-2xl text-purple-400/60 mt-4 tracking-widest uppercase">{currentWord.translation}</p>
        </div>
        <div className="bg-secondary/10 px-4 py-2 border-r-4 border-secondary">
          <p className="text-[8px] font-bold text-secondary uppercase tracking-widest">CATEGORY</p>
          <p className="text-xl font-headline font-black text-secondary uppercase">{currentWord.wordType}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Grammar Slab */}
        <div className="md:col-span-2 bg-surface-container-low p-8 border-l border-primary/20">
          <h3 className="font-headline text-xs font-bold tracking-[0.3em] uppercase text-on-surface-variant mb-8">GRAMMATICAL_STRUCTURE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/20 p-4 border-l-2 border-primary">
              <p className="text-[8px] text-primary/60 font-bold uppercase mb-1">ARTICLE_TYPE</p>
              <p className="font-headline text-xl text-on-surface uppercase tracking-widest">{currentWord.article || 'NONE'}</p>
            </div>
            <div className="bg-black/20 p-4 border-l-2 border-secondary">
              <p className="text-[8px] text-secondary/60 font-bold uppercase mb-1">WORD_CLASS</p>
              <p className="font-headline text-xl text-on-surface uppercase tracking-widest">{currentWord.wordType}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Status Slab */}
        <div className="space-y-8">
          <div className="bg-surface-bright p-8 border-l border-outline-variant/10 h-full flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 scanlines opacity-10 pointer-events-none"></div>
             <div>
                <h3 className="font-headline text-xs font-bold tracking-[0.3em] uppercase text-on-surface-variant mb-6">PROGRESS_REPORT</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                      <span className="text-[10px] text-outline uppercase">MASTERY:</span>
                      <span className={`font-headline text-sm font-bold ${currentWord.progress?.isKnown ? 'text-secondary' : 'text-primary'}`}>
                         {currentWord.progress?.isKnown ? 'OPTIMIZED' : 'IN_LEARNING'}
                      </span>
                   </div>
                   <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                      <span className="text-[10px] text-outline uppercase">DRILLS_COUNT:</span>
                      <span className="font-headline text-sm text-on-surface">{currentWord.progress?.reviewCount || 0}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                      <span className="text-[10px] text-outline uppercase">LAST_ACCESS:</span>
                      <span className="font-headline text-[10px] text-on-surface-variant">
                         {currentWord.progress?.lastReviewed ? new Date(currentWord.progress.lastReviewed).toLocaleDateString() : 'NEVER'}
                      </span>
                   </div>
                </div>
             </div>

             <div className="mt-12 space-y-4">
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full py-4 border border-outline-variant/20 font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/60 hover:text-on-surface hover:bg-white/5 transition-all uppercase"
                >
                  RETURN_TO_ARCHIVE
                </button>
                <button 
                  className="w-full py-4 bg-primary text-on-primary font-headline font-black text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(255,124,245,0.3)] hover:brightness-110 transition-all"
                  onClick={() => navigate(`/edit/${currentWord.id}`)}
                >
                  MODIFY_DATA
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailsPage;
