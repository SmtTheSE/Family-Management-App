import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, PieChart, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CustomAlert } from './CustomAlert';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  created_at: string;
}

const categories = [
  { value: 'food', label: 'အစားအစာ', color: 'bg-red-500' },
  { value: 'transport', label: 'သယ်ယူပို့ဆောင်ရေး', color: 'bg-blue-500' },
  { value: 'housing', label: 'အိမ်နေရာ', color: 'bg-green-500' },
  { value: 'utilities', label: 'အသုံးအဆောင်များ', color: 'bg-yellow-500' },
  { value: 'entertainment', label: 'ဖျော်ဖြေရေး', color: 'bg-purple-500' },
  { value: 'health', label: 'ကျန်းမာရေး', color: 'bg-pink-500' },
  { value: 'education', label: 'ပညာရေး', color: 'bg-indigo-500' },
  { value: 'other', label: 'အခြား', color: 'bg-gray-500' },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  const { user } = useAuth();

  // Load expenses from database
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
      showAlert('success', 'စာရင်းများ ဆွဲယူပြီးပါပြီ');
    } catch (err: any) {
      setError('စာရင်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်');
      showAlert('error', 'စာရင်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်: ' + err.message);
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      setError('ကျေးဇူးပြု၍ မှန်ကန်သော အချက်အလက်များ ဖြည့်ပါ');
      return;
    }

    try {
      setError('');
      const expenseData = {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        date,
        description: description.trim(),
        user_id: user?.id,
      };

      if (editingExpense) {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', editingExpense.id);

        if (error) throw error;
        showAlert('success', 'စာရင်းကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ');
      } else {
        // Insert new expense
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);

        if (error) throw error;
        showAlert('success', 'စာရင်းအသစ်ကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ');
      }

      // Reset form and reload expenses
      resetForm();
      loadExpenses();
    } catch (err: any) {
      setError('စာရင်းကို သိမ်းဆည်းရာတွင် အမှားဖြစ်ခဲ့သည်');
      showAlert('error', 'စာရင်းကို သိမ်းဆည်းရာတွင် အမှားဖြစ်ခဲ့သည်: ' + err.message);
      console.error('Error saving expense:', err);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setDescription(expense.description);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('ဒီစာရင်းကို ဖျက်မှာ သေချာပါသလား?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showAlert('success', 'စာရင်းကို အောင်မြင်စွာ ဖျက်ပြီးပါပြီ');
      loadExpenses();
    } catch (err: any) {
      showAlert('error', 'စာရင်းကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်: ' + err.message);
      console.error('Error deleting expense:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setTitle('');
    setAmount('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
  };

  const getCategoryDetails = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category for chart
  const expensesByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
  };

  const closeAlert = () => {
    setAlert(null);
  };

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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="heading-hero text-gray-900">စာရင်းကုန်ကျမှုများ</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2 hover-lift w-full sm:w-auto justify-center"
        >
          {showForm && !editingExpense ? <X size={18} className="sm:size-20" /> : <Plus size={18} className="sm:size-20" />}
          <span className="text-sm sm:text-base">{showForm && !editingExpense ? 'ပိတ်မည်' : 'စာရင်းအသစ်'}</span>
        </button>
      </div>

      {showForm && (
        <div className="apple-card">
          <div className="p-4 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingExpense ? 'စာရင်းပြင်ဆင်မည်' : 'စာရင်းအသစ်ထည့်မည်'}
            </h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ခေါင်းစဉ် *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-apple w-full"
                  placeholder="ဥပမာ: နှစ်သစ်ကူးပွဲအတွက် စားသောက်ကုန်များ"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ပမာဏ *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-apple w-full"
                    placeholder="ဥပမာ: 10000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    အမျိုးအစား
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ရက်စွဲ
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-apple w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ဖော်ပြချက်
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="textarea-apple w-full"
                  placeholder="ဖော်ပြချက် (မဖြည့်စွက်လည်း ရပါသည်)"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2 hover-lift w-full sm:w-auto"
                >
                  <Save size={18} className="sm:size-20" />
                  <span className="text-sm sm:text-base">{editingExpense ? 'ပြင်ဆင်မည်' : 'သိမ်းမည်'}</span>
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
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="apple-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">စုစုပေါင်း ကုန်ကျမှု</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalExpenses.toLocaleString()} <span className="text-lg">MMK</span>
              </p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">အမျိုးအစားများ</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(expensesByCategory).length}</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Edit2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">စာရင်းများ</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="apple-card">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">စာရင်းများ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ခေါင်းစဉ်
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ပမာဏ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  အမျိုးအစား
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ရက်စွဲ
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  လုပ်ဆောင်ချက်များ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => {
                const categoryDetails = getCategoryDetails(expense.category);
                return (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                      {expense.description && (
                        <div className="text-sm text-gray-500">{expense.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {expense.amount.toLocaleString()} MMK
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryDetails.color} text-white`}>
                        {categoryDetails.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString('my-MM')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="btn-icon"
                          aria-label="Edit"
                        >
                          <Edit2 size={18} className="sm:size-20" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="btn-icon text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} className="sm:size-20" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {expenses.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    စာရင်းများ မရှိသေးပါ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}