import React, { useState } from 'react';
import { useCreateInterestMutation, useDeleteInterestMutation } from '../../redux/services/adminApi';
import { useGetInterestsQuery } from '../../redux/services/profileApi';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

export const AdminInterestsPage: React.FC = () => {
  const { data, isLoading, refetch } = useGetInterestsQuery({});
  const [createInterest] = useCreateInterestMutation();
  const [deleteInterest] = useDeleteInterestMutation();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createInterest({ name: name.trim(), category }).unwrap();
      setName('');
      refetch();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInterest(id).unwrap();
      refetch();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
            System Interest & Hobbies Directory
          </h1>
          <Badge variant="rose" dot>Tags</Badge>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Add and manage interest tags used by the Jaccard compatibility index.
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="rounded-2xl glass-container border border-white/20 p-4 flex flex-col sm:flex-row gap-3 shadow-xl backdrop-blur-xl">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Interest Tag (e.g. Scuba Diving, Jazz)..."
          className="flex-grow border-white/20 bg-black/40"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-11 rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
        >
          <option value="General">General</option>
          <option value="Sports">Sports</option>
          <option value="Tech">Tech</option>
          <option value="Arts">Arts</option>
          <option value="Adventure">Adventure</option>
        </select>
        <Button
          type="submit"
          variant="glow"
          size="default"
          className="gap-1.5 text-xs font-bold whitespace-nowrap shadow-lg shadow-rose-500/25"
        >
          <Plus className="w-4 h-4" /> Add Tag
        </Button>
      </form>

      {/* Tag List */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium">Loading tags...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data?.interests?.map((item: any) => (
            <div
              key={item._id || item.id}
              className="rounded-2xl glass-container-card border border-white/20 p-4 flex items-center justify-between shadow-md backdrop-blur-xl hover:border-rose-400/40 transition-all"
            >
              <div>
                <span className="text-sm font-bold text-white font-outfit">#{item.name}</span>
                <span className="block text-[10px] text-rose-300/80 font-medium">{item.category}</span>
              </div>
              <button
                onClick={() => handleDelete(item._id || item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                title="Delete tag"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
