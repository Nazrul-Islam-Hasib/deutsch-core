import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWordStore } from '../store/useWordStore';
import { useDebounce } from '../hooks/useDebounce';

const WordListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { words, isLoading, error, fetchWords, deleteWord, pagination } = useWordStore();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchWords(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm, fetchWords]);

  const handlePageChange = (newPage: number) => {
    fetchWords(debouncedSearchTerm, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteWord(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  if (isLoading && words.length === 0 && !debouncedSearchTerm) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-outline-variant/20 pb-8">
        <div>
          <p className="font-headline text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 cyan-glow">DIRECTORY // GERMAN_VOCABULARY</p>
          <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface crt-glow uppercase">VOCABULARY_DATA</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-surface-container-low px-4 py-2 border-r-4 border-secondary flex-1 md:flex-none">
            <p className="text-[8px] font-bold text-purple-400/60 uppercase tracking-widest">TOTAL_ENTRIES</p>
            <p className="text-xl font-headline font-black text-on-surface">{pagination.total}</p>
          </div>
          <div className="bg-surface-container-low px-4 py-2 border-r-4 border-primary flex-1 md:flex-none">
            <p className="text-[8px] font-bold text-purple-400/60 uppercase tracking-widest">STATUS</p>
            <p className="text-xl font-headline font-black text-primary uppercase">SYNCHRONIZED</p>
          </div>
        </div>
      </div>

      {/* Search Bar - Terminal Pit Style */}
      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-secondary text-sm">search</span>
        </div>
        <input 
          type="text" 
          placeholder="QUERY_DATABASE..." 
          className="w-full bg-surface-container-lowest border-none focus:ring-0 pl-12 pr-4 py-4 text-on-surface font-headline tracking-widest text-sm placeholder:text-purple-400/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-outline-variant/30"></div>
        <div className="absolute bottom-0 left-0 h-[2px] bg-secondary shadow-[0_0_8px_#00f1fd] transition-all duration-500 group-focus-within:w-full w-0"></div>
      </div>

      {error && (
        <div className="bg-error-container/20 border-l-4 border-error p-4 text-error font-headline tracking-widest text-xs">
          ERROR_LOG: {error}
        </div>
      )}

      {isLoading && words.length === 0 ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      ) : words.length === 0 ? (
        <div className="bg-surface-container-low p-12 text-center border border-outline-variant/10">
          <p className="font-headline tracking-widest text-on-surface-variant">
            {searchTerm ? `NO_RESULTS_FOUND_FOR: "${searchTerm.toUpperCase()}"` : "DATABASE_EMPTY. APPEND_NEW_DATA_TO_INITIALIZE."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {words.map((word) => (
              <div key={word.id} className="bg-surface-container-high group relative p-6 border-l border-outline-variant/10 hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Link to={`/words/${word.id}`} className="material-symbols-outlined text-primary hover:scale-110 transition-transform">info</Link>
                  <button 
                    onClick={(e) => handleDeleteClick(e, word.id)}
                    className="material-symbols-outlined text-error hover:scale-110 transition-transform"
                  >
                    delete
                  </button>
                </div>
                <div className="mb-8">
                  <span className={`font-headline text-[10px] tracking-[0.2em] font-bold px-2 py-1 border ${
                    word.article?.toLowerCase() === 'der' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                    word.article?.toLowerCase() === 'die' ? 'bg-primary/10 text-primary border-primary/30' : 
                        word.article?.toLowerCase() === 'das' ? 'bg-on-secondary/10 text-success border-on-secondary/30' :
                    'bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/30'
                  } uppercase`}>
                    {word.article || 'N/A'}
                  </span>
                </div>
                <h3 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2 group-hover:text-primary transition-colors truncate">
                  {word.germanWord}
                </h3>
                <p className="text-on-surface-variant font-body text-sm mb-6 tracking-wide italic">
                  {word.translation}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {word.wordType?.toLowerCase() === 'noun' ? 'layers' : 'bolt'}
                    </span>
                    <span className="text-[10px] font-bold font-headline text-secondary tracking-widest uppercase">{word.wordType}</span>
                  </div>
                  <span className="text-[10px] text-outline tracking-widest uppercase">ID: {word.id.substring(0, 5)}</span>
                </div>
              </div>
            ))}

            {/* Add New Word Pit */}
            <Link to="/add" className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center p-8 group hover:border-secondary transition-all">
              <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-all mb-4">
                <span className="material-symbols-outlined text-secondary text-3xl">add</span>
              </div>
              <span className="font-headline font-bold text-xs tracking-widest text-on-surface-variant group-hover:text-secondary uppercase text-center">APPEND_NEW_DATA</span>
            </Link>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-outline-variant/10">
              <div className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/40 uppercase">
                PAGE_IDENTIFIER: {pagination.page} // {pagination.totalPages}
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`w-12 h-12 flex items-center justify-center border transition-all ${
                    pagination.page === 1 
                      ? 'border-outline-variant/10 text-outline-variant/20 cursor-not-allowed' 
                      : 'border-secondary/20 text-secondary hover:bg-secondary/10 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pagination.totalPages > 7 && 
                      pageNum !== 1 && 
                      pageNum !== pagination.totalPages && 
                      Math.abs(pageNum - pagination.page) > 1
                    ) {
                      if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                        return <span key={pageNum} className="text-outline-variant/40 px-1">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 font-headline text-xs font-bold transition-all ${
                          pagination.page === pageNum
                            ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(0,241,253,0.3)]'
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-bright border border-outline-variant/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`w-12 h-12 flex items-center justify-center border transition-all ${
                    pagination.page === pagination.totalPages
                      ? 'border-outline-variant/10 text-outline-variant/20 cursor-not-allowed' 
                      : 'border-secondary/20 text-secondary hover:bg-secondary/10 active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              <div className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/40 uppercase hidden md:block">
                ENTRIES_PER_PROTOCOL: {pagination.limit}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Cluster */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 bg-surface-bright relative p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h4 className="font-headline text-3xl font-black mb-4 crt-glow uppercase">NEURAL_DRILL_V.01</h4>
              <p className="text-on-surface-variant text-sm max-w-md mb-8">Execute linguistic protocols to reinforce lexical archives through repetitive stimulus patterns.</p>
              <Link to="/quiz" className="inline-block px-8 py-4 bg-primary text-on-primary font-headline font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,124,245,0.4)] hover:scale-105 transition-transform active:scale-95">
                INITIALIZE_SESSION
              </Link>
            </div>
            <div className="w-48 h-48 bg-black/40 border border-primary/20 flex items-center justify-center p-4">
               <span className="material-symbols-outlined text-primary text-8xl opacity-60">psychology</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-high p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-headline text-xs font-bold tracking-[0.3em] uppercase text-on-surface-variant mb-6">SYSTEM_LOGS</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                 <span className="text-[10px] text-outline">UPTIME:</span>
                 <span className="text-[10px] text-secondary font-bold">99.98% STABLE</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                 <span className="text-[10px] text-outline">MEMORY:</span>
                 <span className="text-[10px] text-primary font-bold">OPTIMIZED</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[8px] font-bold text-outline uppercase tracking-widest mb-1">AUTH_LEVEL</p>
            <p className="text-sm font-headline font-bold text-secondary tracking-widest uppercase">ADMINISTRATOR</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="relative bg-surface-container-high border-l-4 border-error p-8 max-w-md w-full shadow-[0_0_50px_rgba(215,51,87,0.2)]">
            <h3 className="font-headline text-2xl font-black text-on-surface mb-4 crt-glow uppercase">CONFIRM_DELETION</h3>
            <p className="font-body text-on-surface-variant mb-8 tracking-wide">
              ARE YOU SURE YOU WANT TO REMOVE THIS ENTRY FROM THE ARCHIVE? THIS ACTION CANNOT BE REVERSED.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-3 font-headline text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-on-surface transition-colors"
              >
                ABORT
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-3 bg-error text-on-error font-headline text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(215,51,87,0.4)] hover:scale-105 transition-transform"
              >
                EXECUTE_DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordListPage;
