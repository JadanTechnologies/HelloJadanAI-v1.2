import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Generation } from '../types';

const Gallery = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Generation | null>(null);

  const filteredGenerations = state.generations.filter(g => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return g.isFavorite;
    return g.type === filter;
  });

  const toggleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
    if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, isFavorite: !selectedItem.isFavorite });
    }
  };

  const deleteGeneration = (id: string) => {
    dispatch({ type: 'DELETE_GENERATION', payload: id });
    setSelectedItem(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('galleryTitle')}</h1>
        <p className="text-slate-400 mt-1">All your creative works in one place.</p>
      </div>

      <Card>
        <div className="flex space-x-2">
          {['all', 'image', 'video', 'ad', 'favorites'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-brand-indigo text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredGenerations.map(gen => (
          <div key={gen.id} className="relative group aspect-square" onClick={() => setSelectedItem(gen)}>
            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-slate-700 group-hover:border-brand-cyan transition-all cursor-pointer">
              {gen.type === 'video' ? (
                <video src={gen.url} className="w-full h-full object-cover" />
              ) : (
                <img src={gen.url} alt={gen.prompt} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {gen.isFavorite && <span className="text-yellow-400">★</span>}
            </div>
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Generation Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   {selectedItem.type === 'video' ? (
                        <video src={selectedItem.url} controls autoPlay loop className="w-full rounded-lg" />
                    ) : (
                        <img src={selectedItem.url} alt={selectedItem.prompt} className="w-full rounded-lg" />
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-slate-300">{selectedItem.prompt}</p>
                    <p className="text-xs text-slate-500">Created on: {new Date(selectedItem.createdAt).toLocaleString()}</p>
                    <div className="flex flex-col space-y-2">
                        {selectedItem.type === 'image' && (
                          <Link to="/app/generate-image" state={selectedItem}>
                            <Button variant="secondary" className="w-full">{t('useAgain')}</Button>
                          </Link>
                        )}
                         <Button onClick={() => toggleFavorite(selectedItem.id)}>
                            {selectedItem.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </Button>
                        <Button variant="secondary">Download</Button>
                        <Button variant="secondary" className="bg-red-600/50 hover:bg-red-600" onClick={() => deleteGeneration(selectedItem.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default Gallery;