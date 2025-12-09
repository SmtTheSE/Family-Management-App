import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ShoppingList {
  id: string;
  title: string;
  week_date: string;
  is_completed: boolean;
  created_at: string;
}

interface ShoppingItem {
  id: string;
  shopping_list_id: string;
  item_name: string;
  quantity: string;
  is_checked: boolean;
}

export function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [showListForm, setShowListForm] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [weekDate, setWeekDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const { user } = useAuth();

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      loadItems(selectedList.id);
    }
  }, [selectedList]);

  const loadLists = async () => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .order('week_date', { ascending: false });

    if (!error && data) {
      setLists(data);
    }
  };

  const loadItems = async (listId: string) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('shopping_list_id', listId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setItems(data);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: user.id,
        title: listTitle,
        week_date: weekDate,
      })
      .select()
      .single();

    if (!error && data) {
      loadLists();
      setSelectedList(data);
      setShowListForm(false);
      setListTitle('');
      setWeekDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (confirm('ဤစျေးဝယ်စာရင်းကို ဖျက်မှာ သေချာပါသလား?')) {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id);

      if (!error) {
        loadLists();
        if (selectedList?.id === id) {
          setSelectedList(null);
          setItems([]);
        }
      }
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedList) return;

    const { error } = await supabase.from('shopping_items').insert({
      shopping_list_id: selectedList.id,
      item_name: newItemName,
      quantity: newItemQuantity,
    });

    if (!error) {
      loadItems(selectedList.id);
      setNewItemName('');
      setNewItemQuantity('1');
    }
  };

  const handleToggleItem = async (item: ShoppingItem) => {
    const { error } = await supabase
      .from('shopping_items')
      .update({ is_checked: !item.is_checked })
      .eq('id', item.id);

    if (!error) {
      loadItems(selectedList!.id);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (!error) {
      loadItems(selectedList!.id);
    }
  };

  const handleToggleListCompletion = async (list: ShoppingList) => {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ is_completed: !list.is_completed })
      .eq('id', list.id);

    if (!error) {
      loadLists();
      if (selectedList?.id === list.id) {
        setSelectedList({ ...list, is_completed: !list.is_completed });
      }
    }
  };

  return (
    <div id="shopping">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          စျေးဝယ်စာရင်းများ
        </h2>
        <button
          onClick={() => setShowListForm(!showListForm)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto py-2.5 sm:py-3"
        >
          {showListForm ? <X size={18} className="sm:size-20" /> : <Plus size={18} className="sm:size-20" />}
          <span className="text-sm sm:text-base">{showListForm ? 'ပိတ်မည်' : 'စာရင်းအသစ်'}</span>
        </button>
      </div>

      {showListForm && (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            စျေးဝယ်စာရင်းအသစ် ထည့်ရန်
          </h3>
          <form onSubmit={handleCreateList} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                စာရင်းခေါင်းစဉ်
              </label>
              <input
                type="text"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base input-apple"
                placeholder="ဥပမာ: စနေနေ့ စျေးဝယ်စာရင်း"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                အပတ်/ရက်စွဲ
              </label>
              <input
                type="date"
                value={weekDate}
                onChange={(e) => setWeekDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base input-apple"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto py-2.5 sm:py-3"
              >
                <Plus size={18} className="sm:size-20" />
                <span className="text-sm sm:text-base">စာရင်းအသစ် ထည့်မည်</span>
              </button>
              <button
                type="button"
                onClick={() => setShowListForm(false)}
                className="btn-secondary w-full sm:w-auto py-2.5 sm:py-3 text-sm sm:text-base"
              >
                မလုပ်တော့ဘူး
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`apple-card cursor-pointer transition-all hover-lift ${
              selectedList?.id === list.id
                ? 'ring-2 ring-green-500 border-green-500'
                : ''
            }`}
            onClick={() => setSelectedList(list)}
          >
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      list.is_completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {list.title}
                  </h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Calendar size={16} className="mr-2 sm:size-18" />
                    <span className="text-sm">
                      {new Date(list.week_date).toLocaleDateString('my-MM')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleListCompletion(list);
                    }}
                    className={`p-2 rounded-lg ${
                      list.is_completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    aria-label={list.is_completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <Check size={18} className="sm:size-20" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                    aria-label="Delete list"
                  >
                    <Trash2 size={18} className="sm:size-20" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedList && (
        <div className="apple-card">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  {selectedList.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {new Date(selectedList.week_date).toLocaleDateString('my-MM')}
                </p>
              </div>
              <button
                onClick={() => setSelectedList(null)}
                className="mt-4 md:mt-0 flex items-center text-gray-600 hover:text-gray-800 py-2.5 sm:py-3"
              >
                <X size={18} className="mr-1 sm:size-20" />
                <span className="text-sm sm:text-base">စာရင်းပိတ်မည်</span>
              </button>
            </div>

            <form onSubmit={handleAddItem} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ပစ္စည်းအမည်
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base input-apple"
                    placeholder="ဥပမာ: ဆန်"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    အရေအတွက်
                  </label>
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base input-apple"
                    placeholder="ဥပမာ: ၁ ကီလို"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center py-2.5 sm:py-3"
                  >
                    <Plus size={18} className="mr-1 sm:size-20" />
                    <span className="text-sm sm:text-base">ထည့်မည်</span>
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleItem(item)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        item.is_checked
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}
                      aria-label={item.is_checked ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {item.is_checked && <Check size={16} className="text-white sm:size-18" />}
                    </button>
                    <div>
                      <span
                        className={`${
                          item.is_checked ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {item.item_name}
                      </span>
                      <span className="text-gray-600 ml-2">({item.quantity})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    aria-label="Delete item"
                  >
                    <Trash2 size={18} className="sm:size-20" />
                  </button>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                စျေးဝယ်စာရင်းတွင် ပစ္စည်းများ မရှိသေးပါ
              </div>
            )}
          </div>
        </div>
      )}

      {lists.length === 0 && !showListForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            စျေးဝယ်စာရင်းများ မရှိသေးပါ
          </p>
          <p className="text-gray-400 text-sm mt-2">
            အပေါ်ရှိ "စာရင်းအသစ်" ခလုတ်ကို နှိပ်၍ စတင်ပါ
          </p>
        </div>
      )}
    </div>
  );
}
