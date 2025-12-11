import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Calendar, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CustomAlert } from './CustomAlert';

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
  const [showItemForm, setShowItemForm] = useState(true); // New state for item form toggle
  const [showItemsSection, setShowItemsSection] = useState(true); // Toggle for items detail section
  const [listTitle, setListTitle] = useState('');
  const [weekDate, setWeekDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      loadItems(selectedList.id);
      setShowItemForm(true); // Show the item form when a list is selected
    }
  }, [selectedList]);

  const loadLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('week_date', { ascending: false });

      if (error) throw error;
      setLists(data || []);
      showAlert('success', 'စျေးဝယ်စာရင်းများ ဆွဲယူပြီးပါပြီ');
    } catch (error: any) {
      console.error('Error loading shopping lists:', error);
      showAlert('error', 'စျေးဝယ်စာရင်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const loadItems = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('shopping_list_id', listId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error loading shopping items:', error);
      showAlert('error', 'စျေးဝယ်ပစ္စည်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          title: listTitle,
          week_date: weekDate,
        })
        .select()
        .single();

      if (error) throw error;
      
      showAlert('success', 'စျေးဝယ်စာရင်းအသစ်ကို အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ');
      loadLists();
      setSelectedList(data);
      setShowListForm(false);
      setListTitle('');
      setWeekDate(new Date().toISOString().split('T')[0]);
    } catch (error: any) {
      console.error('Error creating shopping list:', error);
      showAlert('error', 'စျေးဝယ်စာရင်းကို ဖန်တီးရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (!confirm('ဤစျေးဝယ်စာရင်းကို ဖျက်မှာ သေချာပါသလား?')) return;
    
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showAlert('success', 'စျေးဝယ်စာရင်းကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ');
      loadLists();
      if (selectedList?.id === id) {
        setSelectedList(null);
        setItems([]);
      }
    } catch (error: any) {
      console.error('Error deleting shopping list:', error);
      showAlert('error', 'စျေးဝယ်စာရင်းကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedList) return;

    try {
      const { error } = await supabase.from('shopping_items').insert({
        shopping_list_id: selectedList.id,
        item_name: newItemName,
        quantity: newItemQuantity,
      });

      if (error) throw error;
      
      showAlert('success', 'စျေးဝယ်ပစ္စည်းအသစ်ကို အောင်မြင်စွာ ထည့်ပြီးပါပြီ');
      loadItems(selectedList.id);
      setNewItemName('');
      setNewItemQuantity('1');
    } catch (error: any) {
      console.error('Error adding shopping item:', error);
      showAlert('error', 'စျေးဝယ်ပစ္စည်းကို ထည့်ရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleToggleItem = async (item: ShoppingItem) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({ is_checked: !item.is_checked })
        .eq('id', item.id);

      if (error) throw error;
      loadItems(selectedList!.id);
      showAlert('success', 'စျေးဝယ်ပစ္စည်းအခြေအနေကို အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ');
    } catch (error: any) {
      console.error('Error toggling shopping item:', error);
      showAlert('error', 'စျေးဝယ်ပစ္စည်းအခြေအနေကို ပြောင်းလဲရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showAlert('success', 'စျေးဝယ်ပစ္စည်းကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ');
      loadItems(selectedList!.id);
    } catch (error: any) {
      console.error('Error deleting shopping item:', error);
      showAlert('error', 'စျေးဝယ်ပစ္စည်းကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const handleToggleListCompletion = async (list: ShoppingList) => {
    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update({ is_completed: !list.is_completed })
        .eq('id', list.id);

      if (error) throw error;
      
      showAlert('success', 'စာရင်းအခြေအနေကို အောင်မြင်စွာ ပြောင်းလဲပြီးပါပြီ');
      loadLists();
      if (selectedList?.id === list.id) {
        setSelectedList({ ...list, is_completed: !list.is_completed });
      }
    } catch (error: any) {
      console.error('Error toggling list completion:', error);
      showAlert('error', 'စာရင်းအခြေအနေကို ပြောင်းလဲရာတွင် အမှားဖြစ်ခဲ့သည်: ' + error.message);
    }
  };

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  // Reset item form visibility when selecting a new list
  const handleSelectList = (list: ShoppingList) => {
    setSelectedList(list);
    setShowItemForm(true); // Show the item form by default when selecting a new list
  };

  // Modified version of setSelectedList that also shows the item form
  const selectListWithItemForm = (list: ShoppingList) => {
    setSelectedList(list);
    setShowItemForm(true);
  };

  return (
    <div id="shopping">
      {/* Alert Component */}
      {alert && (
        <CustomAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert} 
        />
      )}
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          စျေးဝယ်စာရင်းများ
        </h2>
        <button
          onClick={() => setShowListForm(!showListForm)}
          className="btn-primary flex items-center justify-center space-x-2 w-full md:w-auto hover-lift"
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
                className="input-apple w-full"
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
                className="input-apple w-full"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowListForm(false)}
                className="btn-secondary hover-lift"
              >
                မလုပ်တော့ပါ
              </button>
              <button
                type="submit"
                className="btn-primary hover-lift"
              >
                သိမ်းမည်
              </button>
            </div>
          </form>
        </div>
      )}

      {lists.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lists sidebar */}
          <div className="lg:col-span-1">
            <div className="apple-card">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">စာရင်းများ</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {lists.map((list) => (
                  <div
                    key={list.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedList?.id === list.id
                        ? 'bg-blue-50 border-r-2 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectListWithItemForm(list)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4
                          className={`font-medium ${
                            list.is_completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {list.title}
                        </h4>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(list.week_date).toLocaleDateString('my-MM')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleListCompletion(list);
                          }}
                          className={`btn-icon ${
                            list.is_completed
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          aria-label={
                            list.is_completed ? 'Mark as incomplete' : 'Mark as complete'
                          }
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list.id);
                          }}
                          className="btn-icon text-red-600 hover:bg-red-50"
                          aria-label="Delete list"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items detail */}
          <div className="lg:col-span-2">
            {selectedList ? (
              <div className="apple-card">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedList.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(selectedList.week_date).toLocaleDateString('my-MM')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleListCompletion(selectedList)}
                      className={`btn-icon ${
                        selectedList.is_completed
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      aria-label={
                        selectedList.is_completed
                          ? 'Mark as incomplete'
                          : 'Mark as complete'
                      }
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-medium text-gray-900">ပစ္စည်းများ</h4>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowItemsSection(!showItemsSection)}
                        className="btn-secondary flex items-center space-x-1 text-sm"
                      >
                        {showItemsSection ? (
                          <>
                            <X size={16} />
                            <span>ဖုံးကွယ်မည်</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>ပြမည်</span>
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setShowItemForm(!showItemForm)}
                        className="btn-secondary flex items-center space-x-1 text-sm"
                      >
                        {showItemForm ? (
                          <>
                            <X size={16} />
                            <span>ပိတ်မည်</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>ပစ္စည်းအသစ်</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {showItemForm && showItemsSection && (
                    <form onSubmit={handleAddItem} className="flex space-x-3 mb-6">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="input-apple w-full"
                          placeholder="ပစ္စည်းအမည်"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(e.target.value)}
                          className="input-apple w-full"
                          placeholder="အရေအတွက်"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                      >
                        <Plus size={18} />
                      </button>
                    </form>
                  )}

                  {showItemsSection && (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <button
                              onClick={() => handleToggleItem(item)}
                              className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                                item.is_checked
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}
                              aria-label={
                                item.is_checked ? 'Mark as unchecked' : 'Mark as checked'
                              }
                            >
                              {item.is_checked && <Check size={14} className="text-white" />}
                            </button>
                            <div>
                              <span
                                className={
                                  item.is_checked
                                    ? 'line-through text-gray-500'
                                    : 'text-gray-900'
                                }
                              >
                                {item.item_name}
                              </span>
                              {item.quantity && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({item.quantity})
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn-icon text-red-600 hover:bg-red-50"
                            aria-label="Delete item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          ပစ္စည်းများ မရှိသေးပါ
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="apple-card">
                <div className="p-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    စာရင်း မရွေးချယ်ရသေးပါ
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    စာရင်းတစ်ခု ရွေးချယ်၍ စတင်လိုက်ပါ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            စျေးဝယ်စာရင်းများ မရှိသေးပါ
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            စျေးဝယ်စာရင်းအသစ် ထည့်သွင်း၍ စတင်လိုက်ပါ
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowListForm(true)}
              className="btn-primary inline-flex items-center space-x-2 hover-lift"
            >
              <Plus size={18} />
              <span>စာရင်းအသစ်</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}