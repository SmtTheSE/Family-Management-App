import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, PieChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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
  { value: 'utilities', label: 'တွန်းအား', color: 'bg-yellow-500' },
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
    } catch (err) {
      setError('စာရင်းများ ဆွဲယူရာတွင် အမှားဖြစ်ခဲ့သည်');
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
      } else {
        // Insert new expense
        const { error } = await supabase
          .from('expenses')
          .insert([expenseData]);

        if (error) throw error;
      }

      // Reset form and reload expenses
      resetForm();
      loadExpenses();
    } catch (err) {
      setError('စာရင်းကို သိမ်းဆည်းရာတွင် အမှားဖြစ်ခဲ့သည်');
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
      loadExpenses();
    } catch (err) {
      setError('စာရင်းကို ဖျက်ရာတွင် အမှားဖြစ်ခဲ့သည်');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="heading-hero text-gray-900">စာရင်းကုန်ကျမှုများ</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2 hover-lift w-full sm:w-auto justify-center py-2.5 sm:py-3"
        >
          {showForm && !editingExpense ? <Trash2 size={18} /> : <Plus size={18} />}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ရက်စွဲ
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent input-apple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  အမျိုးအစား
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent select-apple"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ဖော်ပြချက်
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent textarea-apple"
                  placeholder="ဖော်ပြချက် (မဖြည့်စွက်လည်း ရပါသည်)"
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center py-2.5"
                >
                  <span>{editingExpense ? 'အပ်ဒိတ်လုပ်မည်' : 'ထည့်မည်'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1 flex items-center justify-center py-2.5"
                >
                  <span>မလုပ်တော့ဘူး</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="apple-card">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">စုစုပေါင်းကုန်ကျမှု</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {totalExpenses.toLocaleString()} Ks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-green-100">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">စာရင်းအမျိုးအစားများ</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">{Object.keys(expensesByCategory).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">စာရင်းအရေအတွက်</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {loading ? (
        <div className="text-center py-8 sm:py-12 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100/50">
          <div className="max-w-md mx-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="heading-section text-primary mb-2">Loading...</h3>
            <p className="body-text text-secondary">
              စာရင်းများ ဆွဲယူနေပါသည်...
            </p>
          </div>
        </div>
      ) : expenses.length > 0 ? (
        <div className="space-y-4">
          {expenses.map((expense) => {
            const categoryDetails = getCategoryDetails(expense.category);
            return (
              <div key={expense.id} className="apple-card hover-lift">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${categoryDetails.color} mr-2 sm:mr-3`}></span>
                        <h3 className="heading-card text-gray-900">{expense.title}</h3>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm sm:text-base">{expense.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString('my-MM')}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">{categoryDetails.label}</span>
                      </div>
                    </div>
                    <div className="text-right sm:text-left min-w-fit">
                      <p className="text-lg sm:text-xl font-semibold text-gray-900">
                        {expense.amount.toLocaleString()} Ks
                      </p>
                      <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 mt-3 justify-end sm:justify-start">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="ပြင်ဆင်ရန်"
                        >
                          <Edit2 size={16} className="sm:size-18" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="ဖျက်မည်"
                        >
                          <Trash2 size={16} className="sm:size-18" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100/50">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <PieChart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="heading-section text-primary mb-2">စာရင်းများ မရှိသေးပါ</h3>
            <p className="body-text text-secondary mb-6">
              သင့်ကုန်ကျမှုများကို စီမံခန့်ခွဲရန် စာရင်းအသစ် ထည့်ပါ
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>စာရင်းအသစ်ထည့်မည်</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}