import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Home as HomeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const categories = [
  { value: 'general', label: 'အထွေထွေ', color: 'blue' },
  { value: 'maintenance', label: 'ပြုပြင်ထိန်းသိမ်းမှု', color: 'green' },
  { value: 'bills', label: 'ဘေလ်များ', color: 'purple' },
  { value: 'tasks', label: 'လုပ်ငန်းများ', color: 'yellow' },
  { value: 'important', label: 'အရေးကြီးသော', color: 'red' },
];

export function HomeNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Items per page for pagination
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadNotes();
  }, [currentPage]);

  const loadNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Calculate range for pagination
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Load paginated notes
    const { data, error, count } = await supabase
      .from('home_notes')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    setNotes(data);
    if (count) {
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingNote) {
        const { error } = await supabase
          .from('home_notes')
          .update({
            title,
            content,
            category,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNote.id);

        if (error) throw error;
        
        loadNotes();
        resetForm();
      } else {
        const { error } = await supabase.from('home_notes').insert({
          user_id: user.id,
          title,
          content,
          category,
        });

        if (error) throw error;
        
        // Reset to first page to see the new note
        setCurrentPage(1);
        loadNotes();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('မှတ်စုကို သိမ်းဆည်းရာတွင် အမှားဖြစ်ခဲ့သည်');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ဤမှတ်စုကို ဖျက်မှာ သေချာပါသလား?')) return;
    
    try {
      const { error } = await supabase.from('home_notes').delete().eq('id', id);
      
      if (error) throw error;
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('မှတ်စုကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('general');
  };

  // Get category details by value
  const getCategoryDetails = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category || categories[0];
  };

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4">
        {/* Fixed text clipping issue by using solid color instead of gradient */}
        <h2 className="heading-hero text-gray-900">
          အိမ်မှတ်စုများ
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2 hover-lift w-full sm:w-auto justify-center py-2.5 sm:py-3"
        >
          {showForm && !editingNote ? <X size={18} className="sm:size-20" /> : <Plus size={18} className="sm:size-20" />}
          <span className="text-sm sm:text-base">{showForm && !editingNote ? 'ပိတ်မည်' : 'မှတ်စုအသစ်'}</span>
        </button>
      </div>

      {showForm && (
        <div className="apple-card-glass fade-in">
          <div className="p-4 md:p-6">
            <h3 className="heading-section mb-4 md:mb-6 text-primary">
              {editingNote ? 'မှတ်စု ပြင်ဆင်ရန်' : 'မှတ်စုအသစ် ထည့်ရန်'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="form-label">
                  ခေါင်းစဉ်
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-apple"
                  placeholder="မှတ်စု ခေါင်းစဉ်ကို ရိုက်ထည့်ပါ"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  အမျိုးအစား
                </label>
                <div className="select-apple-wrapper">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select-apple w-full"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">
                  အကြောင်းအရာ
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="textarea-apple"
                  placeholder="မှတ်စု အကြောင်းအရာကို ရိုက်ထည့်ပါ"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2 hover-lift w-full sm:w-auto py-2.5 sm:py-3"
                >
                  <Save size={18} className="sm:size-20" />
                  <span className="text-sm sm:text-base">{editingNote ? 'အပ်ဒိတ်လုပ်မည်' : 'သိမ်းမည်'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary hover-lift w-full sm:w-auto py-2.5 sm:py-3 text-sm sm:text-base"
                >
                  မလုပ်တော့ဘူး
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 md:py-16 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100/50">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="heading-section text-primary mb-2">Loading...</h3>
            <p className="body-text text-secondary">
              မှတ်စုများ ထုတ်ဆောင်နေပါသည်...
            </p>
          </div>
        </div>
      ) : notes.length > 0 ? (
        <>
          {/* Div-by-div layout for better mobile experience */}
          <div className="space-y-4">
            {notes.map((note) => {
              const categoryDetails = getCategoryDetails(note.category);
              return (
                <div key={note.id} className="apple-card hover-lift">
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="heading-card text-gray-900">{note.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="btn-icon-secondary hover-lift"
                          aria-label="Edit"
                        >
                          <Edit2 size={18} className="sm:size-20" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="btn-icon-secondary text-red-600 hover:bg-red-50 hover-lift"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} className="sm:size-20" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`status-badge status-badge-${categoryDetails.color}`}>
                        {categoryDetails.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleDateString('my-MM')}
                      </span>
                    </div>
                    
                    <p className="body-text text-gray-700 mt-3">
                      {note.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ရှေ့သို့
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  နောက်သို့
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label="Previous"
                    >
                      <ChevronLeft size={16} className="sm:size-18" />
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isCurrent = page === currentPage;
                      
                      // Show first, last, current, and nearby pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                              isCurrent
                                ? 'z-10 bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            aria-current={isCurrent ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        );
                      }
                      
                      // Show ellipsis for skipped pages
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label="Next"
                    >
                      <ChevronRight size={16} className="sm:size-18" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : !showForm ? (
        <div className="text-center py-12 md:py-16 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100/50">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="text-gray-400" size={24} />
            </div>
            <h3 className="heading-section text-primary mb-2">မှတ်စုများ မရှိသေးပါ</h3>
            <p className="body-text text-secondary mb-6">
              ပိုမိုကောင်းမွန်သော အိမ်စီမံခန့်ခွဲမှုအတွက် မှတ်စုအသစ်များ ထည့်သွင်းပါ
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center space-x-2 hover-lift w-full sm:w-auto justify-center py-2.5 sm:py-3"
            >
              <Plus size={18} className="sm:size-20" />
              <span className="text-sm sm:text-base">မှတ်စုအသစ် ထည့်ရန်</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}