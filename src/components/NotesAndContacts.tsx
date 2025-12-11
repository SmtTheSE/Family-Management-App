import { useState, useEffect } from 'react';
import { FileText, Users, Heart, ShoppingCart, Search, Plus, Filter, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CustomAlert } from './CustomAlert';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export function NotesAndContacts() {
  const [activeTab, setActiveTab] = useState<'notes' | 'contacts'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesSearchTerm, setNotesSearchTerm] = useState('');
  const [contactsSearchTerm, setContactsSearchTerm] = useState('');
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  
  // Form states
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Note form fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('အထွေထွေ');
  const [noteTags, setNoteTags] = useState('');
  
  // Contact form fields
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('အထွေထွေ');
  
  const { user } = useAuth();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });
      
      if (contactsError) throw contactsError;
      
      setNotes(notesData || []);
      setContacts(contactsData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      showAlert('error', 'ข้อมูลโหลดไม่สำเร็จ โปรดลองอีกครั้ง: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle note form submission
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const tagsArray = noteTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            title: noteTitle,
            content: noteContent,
            category: noteCategory,
            tags: tagsArray,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNote.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        showAlert('success', 'โน้ตถูกอัปเดตเรียบร้อยแล้ว');
      } else {
        // Insert new note
        const { error } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: noteTitle,
            content: noteContent,
            category: noteCategory,
            tags: tagsArray
          });
        
        if (error) throw error;
        showAlert('success', 'โน้ตใหม่ถูกสร้างเรียบร้อยแล้ว');
      }
      
      // Reset form and reload data
      resetNoteForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving note:', error);
      showAlert('error', 'บันทึกโน้ตไม่สำเร็จ โปรดลองอีกครั้ง: ' + error.message);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      if (editingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('contacts')
          .update({
            name: contactName,
            role: contactRole,
            phone: contactPhone,
            email: contactEmail,
            category: contactCategory,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContact.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        showAlert('success', 'ผู้ติดต่อถูกอัปเดตเรียบร้อยแล้ว');
      } else {
        // Insert new contact
        const { error } = await supabase
          .from('contacts')
          .insert({
            user_id: user.id,
            name: contactName,
            role: contactRole,
            phone: contactPhone,
            email: contactEmail,
            category: contactCategory
          });
        
        if (error) throw error;
        showAlert('success', 'ผู้ติดต่อใหม่ถูกสร้างเรียบร้อยแล้ว');
      }
      
      // Reset form and reload data
      resetContactForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving contact:', error);
      showAlert('error', 'บันทึกผู้ติดต่อไม่สำเร็จ โปรดลองอีกครั้ง: ' + error.message);
    }
  };

  // Handle note deletion
  const handleDeleteNote = async (id: string) => {
    if (!user) return;
    
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโน้ตนี้?')) return;
    
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      showAlert('success', 'โน้ตถูกลบเรียบร้อยแล้ว');
      loadData();
    } catch (error: any) {
      console.error('Error deleting note:', error);
      showAlert('error', 'ลบโน้ตไม่สำเร็จ โปรดลองอีกครั้ง: ' + error.message);
    }
  };

  // Handle contact deletion
  const handleDeleteContact = async (id: string) => {
    if (!user) return;
    
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ติดต่อนี้?')) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      showAlert('success', 'ผู้ติดต่อถูกลบเรียบร้อยแล้ว');
      loadData();
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      showAlert('error', 'ลบผู้ติดต่อไม่สำเร็จ โปรดลองอีกครั้ง: ' + error.message);
    }
  };

  // Prepare form for editing a note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags(note.tags.join(', '));
    setShowNoteForm(true);
  };

  // Prepare form for editing a contact
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactName(contact.name);
    setContactRole(contact.role);
    setContactPhone(contact.phone);
    setContactEmail(contact.email);
    setContactCategory(contact.category);
    setShowContactForm(true);
  };

  // Reset note form
  const resetNoteForm = () => {
    setShowNoteForm(false);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('အထွေထွေ');
    setNoteTags('');
  };

  // Reset contact form
  const resetContactForm = () => {
    setShowContactForm(false);
    setEditingContact(null);
    setContactName('');
    setContactRole('');
    setContactPhone('');
    setContactEmail('');
    setContactCategory('အထွေထွေ');
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(notesSearchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(notesSearchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(notesSearchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(notesSearchTerm.toLowerCase()))
  );

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(contactsSearchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(contactsSearchTerm.toLowerCase()) ||
    contact.category.toLowerCase().includes(contactsSearchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.toLowerCase().includes(contactsSearchTerm.toLowerCase())) ||
    (contact.email && contact.email.toLowerCase().includes(contactsSearchTerm.toLowerCase()))
  );

  // Categories for notes and contacts
  const categories = [
    { id: 1, name: "ကျန်းမာရေး", icon: Heart, color: "blue", count: notes.filter(n => n.category === 'ကျန်းမာရေး').length + contacts.filter(c => c.category === 'ကျန်းမာရေး').length },
    { id: 2, name: "မိသားစု", icon: Users, color: "green", count: notes.filter(n => n.category === 'မိသားစု').length + contacts.filter(c => c.category === 'မိသားစု').length },
    { id: 3, name: "စျေးဝယ်", icon: ShoppingCart, color: "purple", count: notes.filter(n => n.category === 'စျေးဝယ်').length + contacts.filter(c => c.category === 'စျေးဝယ်').length },
    { id: 4, name: "အထွေထွေ", icon: FileText, color: "gray", count: notes.filter(n => n.category === 'အထွေထွေ').length + contacts.filter(c => c.category === 'အထွေထွေ').length }
  ];

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Component */}
      {alert && (
        <CustomAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="heading-hero text-primary flex items-center">
          <FileText className="mr-3 text-blue-500" size={32} />
          မှတ်စု & ဆက်သွယ်ရန်
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              resetNoteForm();
              setShowNoteForm(true);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <FileText size={18} />
            <span>မှတ်စုအသစ်</span>
          </button>
          <button 
            onClick={() => {
              resetContactForm();
              setShowContactForm(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Users size={18} />
            <span>ဆက်သွယ်ရန်အသစ်</span>
          </button>
        </div>
      </div>

      {/* Note Form Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="apple-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-section">
                  {editingNote ? 'မှတ်စုပြင်ဆင်ရန်' : 'မှတ်စုအသစ်'}
                </h3>
                <button onClick={resetNoteForm} className="btn-icon">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ခေါင်းစဉ်</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="input-apple w-full"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">အကြောင်းအရာ</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={4}
                    className="textarea-apple w-full"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">အမျိုးအစား</label>
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value)}
                      className="select-apple w-full"
                    >
                      <option value="အထွေထွေ">အထွေထွေ</option>
                      <option value="ကျန်းမာရေး">ကျန်းမာရေး</option>
                      <option value="မိသားစု">မိသားစု</option>
                      <option value="စျေးဝယ်">စျေးဝယ်</option>
                      <option value="အလုပ်">အလုပ်</option>
                      <option value="ပညာရေး">ပညာရေး</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag များ (ကော်မာဖြင့် ခွဲ၍ ရိုက်ထည့်ပါ)</label>
                    <input
                      type="text"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      className="input-apple w-full"
                      placeholder="ဥပမာ - အရေးကြီး, သတိပေး"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetNoteForm}
                    className="btn-secondary"
                  >
                    မလုပ်တော့ပါ
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Save className="mr-2" size={18} />
                    {editingNote ? 'မှတ်စုအပ်ဒိတ်' : 'မှတ်စုသိမ်းဆည်း'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="apple-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="heading-section">
                  {editingContact ? 'ဆက်သွယ်ရန်ပြင်ဆင်ရန်' : 'ဆက်သွယ်ရန်အသစ်'}
                </h3>
                <button onClick={resetContactForm} className="btn-icon">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">နာမည်</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="input-apple w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ရာထူး/ဆက်နှုတ်ဆိုင်ရာ</label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="input-apple w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ဖုန်းနံပါတ်</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="input-apple w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">အီးမေးလ်</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="input-apple w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">အမျိုးအစား</label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="select-apple w-full"
                  >
                    <option value="အထွေထွေ">အထွေထွေ</option>
                    <option value="ကျန်းမာရေး">ကျန်းမာရေး</option>
                    <option value="မိသားစု">မိသားစု</option>
                    <option value="စျေးဝယ်">စျေးဝယ်</option>
                    <option value="အလုပ်">အလုပ်</option>
                    <option value="ပညာရေး">ပညာရေး</option>
                    <option value="အရေးပေါ်">အရေးပေါ်</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetContactForm}
                    className="btn-secondary"
                  >
                    မလုပ်တော့ပါ
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Save className="mr-2" size={18} />
                    {editingContact ? 'ဆက်သွယ်ရန်အပ်ဒိတ်' : 'ဆက်သွယ်ရန်သိမ်းဆည်း'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notes Section */}
        <div className="space-y-6">
          <div className="apple-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="heading-section flex items-center">
                  <FileText className="mr-2 text-blue-500" size={24} />
                  မှတ်စုများ
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="မှတ်စုများတွင် ရှာဖွေရန်..." 
                      value={notesSearchTerm}
                      onChange={(e) => setNotesSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-apple"
                    />
                  </div>
                  <button className="btn-icon">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="apple-card hover-lift">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg">{note.title}</h4>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditNote(note)}
                              className="btn-icon"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="btn-icon text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{note.content}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {note.category}
                          </span>
                          {note.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          {new Date(note.created_at).toLocaleDateString('my-MM')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">မှတ်စုများ မရှိပါ</h3>
                    <p className="mt-1 text-sm text-gray-500">မှတ်စုအသစ် ထည့်သွင်း၍ စတင်လိုက်ပါ။</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div className="space-y-6">
          <div className="apple-card">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="heading-section flex items-center">
                  <Users className="mr-2 text-green-500" size={24} />
                  ဆက်သွယ်ရန်များ
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="ဆက်သွယ်ရန်များတွင် ရှာဖွေရန်..." 
                      value={contactsSearchTerm}
                      onChange={(e) => setContactsSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent input-apple"
                    />
                  </div>
                  <button className="btn-icon">
                    <Filter size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div key={contact.id} className="apple-card hover-lift">
                      <div className="p-4 flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <Users className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{contact.name}</h4>
                          <p className="text-gray-600">{contact.role}</p>
                          {contact.phone && <p className="text-sm text-gray-500">{contact.phone}</p>}
                          {contact.email && <p className="text-sm text-gray-500">{contact.email}</p>}
                          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {contact.category}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => handleEditContact(contact)}
                            className="btn-icon"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteContact(contact.id)}
                            className="btn-icon text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">ဆက်သွယ်ရန်များ မရှိပါ</h3>
                    <p className="mt-1 text-sm text-gray-500">ဆက်သွယ်ရန်အသစ် ထည့်သွင်း၍ စတင်လိုက်ပါ။</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Smart Categories */}
          <div className="apple-card">
            <div className="p-6 border-b border-gray-100">
              <h3 className="heading-section">အမျိုးအစားများ</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div 
                      key={category.id} 
                      className="border border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className={`text-${category.color}-600`} size={24} />
                      </div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">စုစုပေါင်း {category.count} ခု</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}