import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Clock, Users, Search, Upload, ShoppingCart, ChefHat } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CustomAlert } from './CustomAlert';

interface Recipe {
  id: string;
  name: string;
  cuisine_type: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string | null;
  created_at: string;
}

const cuisineTypes = [
  { value: 'myanmar', label: 'မြန်မာ' },
  { value: 'chinese', label: 'တရုတ်' },
  { value: 'thai', label: 'ထိုင်း' },
  { value: 'indian', label: 'အိန္ဒိယ' },
  { value: 'western', label: 'အနောက်တိုင်း' },
  { value: 'japanese', label: 'ဂျပန်' },
  { value: 'korean', label: 'ကိုရီးယား' },
  { value: 'general', label: 'အခြား' },
];

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    cuisine_type: 'myanmar',
    ingredients: '',
    instructions: '',
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    image_url: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCuisine]);

  const loadRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading recipes:', error);
      showAlert('error', 'ချက်ပြုတ်နည်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
      return;
    }
    
    setRecipes(data || []);
    showAlert('success', 'ချက်ပြုတ်နည်းများ ဆွဲယူပြီးပါပြီ');
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(
        (recipe) => recipe.cuisine_type === selectedCuisine
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
      showAlert('success', 'ဓာတ်ပုံကို အောင်မြင်စွာ တင်ပြီးပါပြီ');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      showAlert('error', 'ဓာတ်ပုံတင်ခြင်း မအောင်မြင်ပါ: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        showAlert('error', 'ဓာတ်ပုံဖိုင်သာ တင်နိုင်ပါသည်');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'ဓာတ်ပုံဖိုင် အရွယ်အစား ၅ MB ထက် ကျော်နေပါသည်');
        return;
      }
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload image
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRecipe.id);

        if (error) throw error;
        
        showAlert('success', 'ချက်နည်းကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ');
        loadRecipes();
        resetForm();
      } else {
        const { error } = await supabase.from('recipes').insert({
          ...formData,
          user_id: user.id,
        });

        if (error) throw error;
        
        showAlert('success', 'ချက်နည်းအသစ်ကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ');
        loadRecipes();
        resetForm();
      }
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      showAlert('error', 'ချက်ပြုတ်နည်းကို သိမ်းဆည်းရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ဤချက်ပြုတ်နည်းကို ဖျက်မှာ သေချာပါသလား?')) return;
    
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      
      if (error) throw error;
      
      showAlert('success', 'ချက်ပြုတ်နည်းကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ');
      loadRecipes();
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      showAlert('error', 'ချက်ပြုတ်နည်းကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      cuisine_type: recipe.cuisine_type,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      servings: recipe.servings,
      image_url: recipe.image_url || '',
    });
    setImagePreview(recipe.image_url);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
    setFormData({
      name: '',
      cuisine_type: 'myanmar',
      ingredients: '',
      instructions: '',
      prep_time: 0,
      cook_time: 0,
      servings: 1,
      image_url: '',
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div id="recipes">
      {/* Alert Component */}
      {alert && (
        <CustomAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">ချက်ပြုတ်နည်းများ</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto hover-lift"
        >
          {showForm ? <X size={18} className="sm:size-20" /> : <Plus size={18} className="sm:size-20" />}
          <span className="text-sm sm:text-base">{showForm ? 'ပိတ်မည်' : 'ချက်နည်းအသစ်'}</span>
        </button>
      </div>

      <div className="mb-4 md:mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ချက်ပြုတ်နည်း ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-apple w-full pl-10 pr-4"
          />
        </div>
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="select-apple w-full md:w-auto"
        >
          <option value="all">အားလုံး</option>
          {cuisineTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingRecipe ? 'ချက်နည်း ပြင်ဆင်ရန်' : 'ချက်နည်းအသစ် ထည့်ရန်'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  အစားအစာအမည်
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-apple w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  အစားအစာအမျိုးအစား
                </label>
                <select
                  value={formData.cuisine_type}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine_type: e.target.value })
                  }
                  className="select-apple w-full"
                >
                  {cuisineTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ပြင်ဆင်ချိန် (မိနစ်)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.prep_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prep_time: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ချက်ပြုတ်ချိန် (မိနစ်)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.cook_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cook_time: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  စားသုံးသူအရေအတွက်
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servings: parseInt(e.target.value) || 1,
                    })
                  }
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ဓာတ်ပုံ
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center space-x-2 cursor-pointer w-full md:w-auto justify-center btn-secondary hover-lift"
                  >
                    <Upload size={18} className="sm:size-20" />
                    <span className="text-sm sm:text-base">ဓာတ်ပုံရွေးရန်</span>
                  </label>
                  {uploading && (
                    <div className="text-sm text-gray-500">တင်နေပါသည်...</div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ပါဝင်ပစ္စည်းများ
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
                rows={4}
                className="textarea-apple w-full"
                placeholder="ဥပမာ: ကြက်သွန် ၂ ကောင်၊ ရေ ၁ လီတာ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ချက်ပြုတ်နည်းလမ်း
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                rows={6}
                className="textarea-apple w-full"
                placeholder="ချက်ပြုတ်နည်းလမ်းကို ရေးပါ"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-4">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center space-x-2 hover-lift w-full sm:w-auto"
              >
                <Save size={18} className="sm:size-20" />
                <span className="text-sm sm:text-base">{editingRecipe ? 'ပြင်ဆင်မည်' : 'သိမ်းမည်'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary hover-lift w-full sm:w-auto text-sm sm:text-base"
              >
                မလုပ်တော့ပါ
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="apple-card hover-lift">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-48 flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{recipe.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="btn-icon"
                      aria-label="Edit"
                    >
                      <Edit2 size={18} className="sm:size-20" />
                    </button>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="btn-icon text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={18} className="sm:size-20" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {cuisineTypes.find(t => t.value === recipe.cuisine_type)?.label || 'အခြား'}
                  </span>
                </div>
                
                {/* Display ingredients */}
                {recipe.ingredients && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 text-sm">ပါဝင်ပစ္စည်းများ</h4>
                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{recipe.ingredients}</p>
                  </div>
                )}
                
                {/* Display instructions */}
                {recipe.instructions && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 text-sm">ချက်ပြုတ်နည်းလမ်း</h4>
                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{recipe.instructions}</p>
                  </div>
                )}
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <Clock className="h-5 w-5 text-gray-500 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1">ပြင်ဆင်ချိန်</p>
                    <p className="text-sm font-medium">{recipe.prep_time} မိနစ်</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <Clock className="h-5 w-5 text-gray-500 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1">ချက်ချိန်</p>
                    <p className="text-sm font-medium">{recipe.cook_time} မိနစ်</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <Users className="h-5 w-5 text-gray-500 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1">စားသုံးသူ</p>
                    <p className="text-sm font-medium">{recipe.servings} ယောက်</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">ချက်ပြုတ်နည်းများ မရှိပါ</h3>
          <p className="text-gray-500 mb-6">ချက်ပြုတ်နည်းအသစ် ထည့်သွင်း၍ စတင်လိုက်ပါ</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center space-x-2 hover-lift"
          >
            <Plus size={18} />
            <span>ချက်နည်းအသစ်</span>
          </button>
        </div>
      )}
    </div>
  );
}