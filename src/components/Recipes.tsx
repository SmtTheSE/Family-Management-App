import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Clock, Users, Search, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

    if (!error && data) {
      setRecipes(data);
    }
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
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('ဓာတ်ပုံတင်ခြင်း မအောင်မြင်ပါ');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('ဓာတ်ပုံဖိုင်သာ တင်နိုင်ပါသည်');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('ဓာတ်ပုံဖိုင် အရွယ်အစား ၅ MB ထက် ကျော်နေပါသည်');
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

    if (editingRecipe) {
      const { error } = await supabase
        .from('recipes')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingRecipe.id);

      if (!error) {
        loadRecipes();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('recipes').insert({
        ...formData,
        user_id: user.id,
      });

      if (!error) {
        loadRecipes();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ဤချက်ပြုတ်နည်းကို ဖျက်မှာ သေချာပါသလား?')) {
      const { error } = await supabase.from('recipes').delete().eq('id', id);

      if (!error) {
        loadRecipes();
      }
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

  return (
    <div id="recipes">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">ချက်ပြုတ်နည်းများ</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto py-2.5 sm:py-3"
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base input-apple"
          />
        </div>
        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base select-apple w-full md:w-auto"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base input-apple"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base select-apple"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base input-apple"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base input-apple"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base input-apple"
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
                    className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer w-full md:w-auto justify-center btn-secondary"
                  >
                    <Upload size={18} className="sm:size-20" />
                    <span className="text-sm sm:text-base">ဓာတ်ပုံရွေးရန်</span>
                  </label>
                  {uploading && (
                    <div className="text-sm text-gray-500">တင်နေပါသည်...</div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base textarea-apple"
                placeholder="တစ်ကြောင်းချင်းစီ ထည့်ပါ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ချက်ပြုတ်နည်း
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base textarea-apple"
                placeholder="အဆင့်ဆင့် ချက်ပြုတ်နည်း ရေးပါ"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto justify-center py-2.5 sm:py-3"
                disabled={uploading}
              >
                <Save size={18} className="sm:size-20" />
                <span className="text-sm sm:text-base">{editingRecipe ? 'အပ်ဒိတ်လုပ်မည်' : 'သိမ်းမည်'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary w-full sm:w-auto py-2.5 sm:py-3 text-sm sm:text-base"
              >
                မလုပ်တော့ဘူး
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="apple-card hover-lift"
          >
            <div className="p-4 md:p-6">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-40 md:h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
                  <div className="text-gray-400 text-center px-4">
                    <div className="text-lg mb-1">ဓာတ်ပုံမရှိပါ</div>
                    <div className="text-sm">ဓာတ်ပုံထည့်ရန် ပြင်ဆင်ပါ</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  {
                    cuisineTypes.find((c) => c.value === recipe.cuisine_type)
                      ?.label
                  }
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(recipe)}
                    className="text-gray-600 hover:text-teal-600 transition-colors p-2"
                    aria-label="Edit"
                  >
                    <Edit2 size={18} className="sm:size-20" />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-gray-600 hover:text-red-600 transition-colors p-2"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} className="sm:size-20" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {recipe.name}
              </h3>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock size={16} className="sm:size-18" />
                  <span>{recipe.prep_time + recipe.cook_time} မိနစ်</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} className="sm:size-18" />
                  <span>{recipe.servings} ဦး</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  ပါဝင်ပစ္စည်းများ:
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                  {recipe.ingredients}
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  ချက်ပြုတ်နည်း:
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                  {recipe.instructions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || selectedCuisine !== 'all'
              ? 'ရှာဖွေမှု ရလဒ် မရှိပါ'
              : 'ချက်ပြုတ်နည်းများ မရှိသေးပါ'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm || selectedCuisine !== 'all'
              ? 'အခြားသော ရှာဖွေမှု စကားလုံးများကို ကြိုးစားကြည့်ပါ'
              : 'အပေါ်ရှိ "ချက်နည်းအသစ်" ခလုတ်ကို နှိပ်၍ စတင်ပါ'}
          </p>
        </div>
      )}
    </div>
  );
}
