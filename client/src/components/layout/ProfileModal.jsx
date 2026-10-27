import React, { useState, useEffect } from 'react';
import { User, BookMarked, Trash2, X, Plus, ExternalLink, GraduationCap, Building2 } from 'lucide-react';
import { useLensStore } from '../../store/useLensStore';

export function ProfileModal() {
  const {
    isProfileModalOpen,
    toggleProfileModal,
    studentProfile,
    updateStudentProfile,
    setActiveDevice,
    setSelectedPin,
    language
  } = useLensStore();

  const [notes, setNotes] = useState([]);
  const [filterCourse, setFilterCourse] = useState('ALL');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const profile = studentProfile || {
    name: 'Student Member',
    studentId: '2024-STU',
    university: 'Engineering Faculty',
    enrolledCourses: []
  };

  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [university, setUniversity] = useState(profile.university);

  useEffect(() => {
    if (studentProfile) {
      setName(studentProfile.name || '');
      setStudentId(studentProfile.studentId || '');
      setUniversity(studentProfile.university || '');
    }
  }, [studentProfile]);

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
    if (isProfileModalOpen) {
      fetchNotes();
    }
  }, [isProfileModalOpen]);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateStudentProfile({ name, studentId, university });
    setIsEditingProfile(false);
  };

  if (!isProfileModalOpen) return null;

  const filteredNotes = notes.filter((n) => {
    if (filterCourse === 'ALL') return true;
    return n.course_code.includes(filterCourse);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40 shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold line-clamp-1">
                {language === 'bn' ? 'শিক্ষার্থী প্রোফাইল ও ল্যাব ডায়েরি (SQLite)' : 'Student Profile & Lab Diary (SQLite)'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                {profile.name} • {profile.studentId} ({profile.university})
              </p>
            </div>
          </div>
          <button onClick={toggleProfileModal} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card & Editing */}
        <div className="p-3.5 sm:p-5 bg-slate-50 border-b border-slate-200 shrink-0">
          {!isEditingProfile ? (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{profile.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    ID: {profile.studentId}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {profile.university}
                  </span>
                  {profile.department && (
                    <span className="text-slate-400">• {profile.department}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Semester {profile.semester || '4-1'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors shadow-2xs"
              >
                {language === 'bn' ? 'প্রোফাইল পরিবর্তন' : 'Edit Profile'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Student Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                  required
                />
                <input
                  type="text"
                  placeholder="University / Department"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Notes Filter Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-sky-600" />
            {language === 'bn' ? 'সংরক্ষিত ল্যাব নোটসমূহ' : 'Saved Lab Observations & Notes'}
            <span className="text-slate-400 font-normal">({filteredNotes.length})</span>
          </span>

          <div className="flex items-center gap-1">
            {['ALL', 'CSE-311', 'EEE-401', 'CSE-313'].map((code) => (
              <button
                key={code}
                onClick={() => setFilterCourse(code)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                  filterCourse === code
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Notes List from SQLite DB */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {language === 'bn'
                ? 'এই কোর্সের জন্য কোনো নোট সেভ করা নেই।'
                : 'No notes saved yet. Inspect any pin in 3D and save your lab observations!'}
            </div>
          ) : (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors space-y-2 relative"
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
                        toggleProfileModal();
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-2 py-1 rounded-md"
                      title="Jump to this pin in 3D"
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
                  <span className="capitalize">Hardware: {n.device_id.replace('_', ' ')}</span>
                  <span>{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
