import React, { useState, useEffect } from 'react';
import { BookMarked, Search, Trash2, X, Plus, ExternalLink } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

export function NotesModal() {
  const {
    isNotesModalOpen,
    toggleNotesModal,
    setSelectedPin,
    setActiveDevice,
    language
  } = useLensStore();

  const [notes, setNotes] = useState([]);
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [search, setSearch] = useState('');

  // Fetch all notes from SQLite backend
  const fetchNotes = () => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNotes(data.notes || []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (isNotesModalOpen) {
      fetchNotes();
    }
  }, [isNotesModalOpen]);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isNotesModalOpen) return null;

  const filtered = notes.filter((n) => {
    const matchCourse = filterCourse === 'ALL' || n.course_code.includes(filterCourse);
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.pin_id.toLowerCase().includes(search.toLowerCase());
    return matchCourse && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold">
                {language === 'bn' ? 'স্টুডেন্ট ল্যাব নোটস ও রিভিউ (SQLite)' : 'Student Lab Notes & Viva Prep (SQLite)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'bn'
                  ? 'সবগুলো পিনের সংরক্ষিত ব্যক্তিগত নোট ও কোর্স প্রশ্নাবলী'
                  : 'Centralized database records of your annotated hardware pins'}
              </p>
            </div>
          </div>
          <button onClick={toggleNotesModal} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'নোট খুঁজুন...' : 'Search notes...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none bg-transparent w-48 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1">
            {['ALL', 'CSE-311', 'EEE-401', 'CSE-313'].map((code) => (
              <button
                key={code}
                onClick={() => setFilterCourse(code)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  filterCourse === code
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {language === 'bn' ? 'কোনো নোট খুঁজে পাওয়া যায়নি।' : 'No matching notes found.'}
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition-colors space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {n.course_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveDevice(n.device_id);
                        setSelectedPin(n.pin_id);
                        toggleNotesModal();
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-2 py-1 rounded-md"
                      title="Jump camera to this pin in 3D"
                    >
                      <span>{n.pin_id.replace('Pin_', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">{n.content}</p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="capitalize">Device: {n.device_id.replace('_', ' ')}</span>
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
