import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWordStore } from '../store/useWordStore';

const EditWordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    germanWord: '',
    translation: '',
    article: '',
    wordType: 'Noun',
  });
  const [formError, setFormError] = useState('');
  const { updateWord, currentWord, fetchWordById, isLoading, error: apiError } = useWordStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchWordById(id);
    }
  }, [id, fetchWordById]);

  useEffect(() => {
    if (currentWord && currentWord.id === id) {
      setFormData({
        germanWord: currentWord.germanWord,
        translation: currentWord.translation,
        article: currentWord.article || '',
        wordType: currentWord.wordType || 'Noun',
      });
    }
  }, [currentWord, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!id) return;

    if (!formData.germanWord.trim() || !formData.translation.trim()) {
      setFormError('REQUIRED_FIELDS_MISSING: German word and translation.');
      return;
    }

    const success = await updateWord(id, formData);
    if (success) {
      navigate(`/words/${id}`);
    }
  };

  if (isLoading && !currentWord) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="border-b border-outline-variant/20 pb-8">
        <p className="font-headline text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 cyan-glow">SYSTEM // UPDATE_PROTOCOL</p>
        <h2 className="font-headline text-5xl font-black tracking-tighter text-on-surface crt-glow uppercase">MODIFY_DATA_ENTRY</h2>
      </div>

      <div className="bg-surface-container-high relative p-8 md:p-12 border-l border-outline-variant/10 shadow-[20px_0_60px_rgba(0,0,0,0.3)]">
        {(formError || apiError) && (
          <div className="bg-error-container/20 border-l-4 border-error p-4 text-error font-headline tracking-widest text-xs mb-8 uppercase">
            {formError || apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* German Word - Terminal Pit */}
          <div className="space-y-2 group">
            <label className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/60 uppercase">
              INPUT_GERMAN_LEXEME
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="germanWord"
                value={formData.germanWord}
                onChange={handleChange}
                placeholder="E.G. KATZE..." 
                className="w-full bg-surface-container-lowest border-none focus:ring-0 px-6 py-4 text-on-surface font-headline tracking-widest text-lg placeholder:text-purple-400/20"
                disabled={isLoading}
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <div className="absolute bottom-0 left-0 h-[1px] bg-secondary shadow-[0_0_8px_#00f1fd] transition-all duration-500 group-focus-within:w-full w-0"></div>
            </div>
          </div>

          {/* Translation - Terminal Pit */}
          <div className="space-y-2 group">
            <label className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/60 uppercase">
              INPUT_TRANSLATION
            </label>
            <div className="relative">
              <input 
                type="text" 
                name="translation"
                value={formData.translation}
                onChange={handleChange}
                placeholder="E.G. CAT..." 
                className="w-full bg-surface-container-lowest border-none focus:ring-0 px-6 py-4 text-on-surface font-headline tracking-widest text-lg placeholder:text-purple-400/20"
                disabled={isLoading}
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
              <div className="absolute bottom-0 left-0 h-[1px] bg-primary shadow-[0_0_8px_#ff7cf5] transition-all duration-500 group-focus-within:w-full w-0"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Article - Terminal Pit */}
            <div className="space-y-2 group">
              <label className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/60 uppercase">
                SELECT_ARTICLE
              </label>
              <div className="relative">
                <select 
                  name="article"
                  value={formData.article}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border-none focus:ring-0 px-6 py-4 text-on-surface font-headline tracking-widest text-sm appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="">NONE</option>
                  <option value="der">DER (MASCULINE)</option>
                  <option value="die">DIE (FEMININE)</option>
                  <option value="das">DAS (NEUTER)</option>
                </select>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-secondary">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>

            {/* Word Type - Terminal Pit */}
            <div className="space-y-2 group">
              <label className="font-headline text-[10px] font-bold tracking-[0.2em] text-purple-400/60 uppercase">
                DEFINE_CATEGORY
              </label>
              <div className="relative">
                <select 
                  name="wordType"
                  value={formData.wordType}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border-none focus:ring-0 px-6 py-4 text-on-surface font-headline tracking-widest text-sm appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="Noun">NOUN</option>
                  <option value="Verb">VERB</option>
                  <option value="Adjective">ADJECTIVE</option>
                  <option value="Adverb">ADVERB</option>
                  <option value="Preposition">PREPOSITION</option>
                  <option value="Other">OTHER</option>
                </select>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-primary">
                  <span className="material-symbols-outlined">category</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-10 border-t border-outline-variant/10">
            <button 
              type="button" 
              onClick={() => navigate(`/words/${id}`)} 
              className="w-full md:w-auto px-8 py-4 font-headline text-xs font-bold tracking-[0.2em] text-purple-400/60 hover:text-on-surface transition-colors uppercase"
              disabled={isLoading}
            >
              ABORT_CHANGES
            </button>
            <button 
              type="submit" 
              className={`w-full md:w-auto px-12 py-5 bg-primary text-on-primary font-headline font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(255,124,245,0.4)] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner loading-xs"></span>}
              COMMIT_CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWordPage;
