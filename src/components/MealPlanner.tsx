import { useState } from 'react';
import { Calendar, ChefHat, ShoppingCart, User, Plus, Filter, Eye } from 'lucide-react';

export function MealPlanner() {
  const [activeTab, setActiveTab] = useState('planner');
  
  // Mock data for demonstration
  const meals = [
    { id: 1, day: 'Monday', breakfast: 'Bread & Tea', lunch: 'Rice & Curry', dinner: 'Noodles' },
    { id: 2, day: 'Tuesday', breakfast: 'Porridge', lunch: 'Chicken Soup', dinner: 'Fried Rice' },
    { id: 3, day: 'Wednesday', breakfast: 'Milk & Bread', lunch: 'Fish Curry', dinner: 'Pasta' },
    { id: 4, day: 'Thursday', breakfast: 'Egg & Toast', lunch: 'Beef Curry', dinner: 'Soup' },
    { id: 5, day: 'Friday', breakfast: 'Pancakes', lunch: 'Pork Curry', dinner: 'Salad' },
    { id: 6, day: 'Saturday', breakfast: 'Sandwich', lunch: 'Vegetable Soup', dinner: 'BBQ' },
    { id: 7, day: 'Sunday', breakfast: 'Cereal', lunch: 'Special Lunch', dinner: 'Family Dinner' },
  ];
  
  const assignments = [
    { id: 1, member: 'Father', task: 'Prepare dinner', day: 'Monday' },
    { id: 2, member: 'Mother', task: 'Prepare lunch', day: 'Tuesday' },
    { id: 3, member: 'Child 1', task: 'Set table', day: 'Wednesday' },
    { id: 4, member: 'Child 2', task: 'Wash dishes', day: 'Thursday' },
  ];
  
  const shoppingList = [
    { id: 1, item: 'Rice', quantity: '5kg', checked: false },
    { id: 2, item: 'Chicken', quantity: '2kg', checked: true },
    { id: 3, item: 'Vegetables', quantity: 'Various', checked: false },
    { id: 4, item: 'Spices', quantity: 'Mixed', checked: false },
    { id: 5, item: 'Oil', quantity: '1L', checked: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="heading-hero text-primary flex items-center">
          <ChefHat className="mr-3 text-green-500" size={32} />
          Meal Planning & Nutrition
        </h2>
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={18} />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="apple-card p-6 mb-8">
        <h3 className="heading-section mb-4">This Week's Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <Calendar className="text-blue-500 mr-3" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Meals Planned</p>
                <p className="text-2xl font-bold">21</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <User className="text-green-500 mr-3" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Family Members</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <ShoppingCart className="text-purple-500 mr-3" size={24} />
              <div>
                <p className="text-gray-500 text-sm">Items to Buy</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('planner')}
          className={`px-4 py-2 font-medium ${activeTab === 'planner' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Calendar className="inline mr-2" size={18} />
          Weekly Planner
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 font-medium ${activeTab === 'assignments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <User className="inline mr-2" size={18} />
          Task Assignments
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2 font-medium ${activeTab === 'shopping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ShoppingCart className="inline mr-2" size={18} />
          Shopping List
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'planner' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Weekly Meal Plan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breakfast</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lunch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dinner</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{meal.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{meal.breakfast}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{meal.lunch}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{meal.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Cooking Assignments</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{assignment.member}</p>
                    <p className="text-gray-600">{assignment.task}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{assignment.day}</p>
                    <button className="mt-2 text-sm text-blue-600 hover:underline">
                      Change Assignment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shopping' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="heading-section">Shopping List</h3>
            <button className="btn-secondary">
              Export List
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {shoppingList.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center">
                <input
                  type="checkbox"
                  checked={item.checked}
                  className="h-5 w-5 text-blue-600 rounded mr-4"
                  onChange={() => {}}
                />
                <div className="flex-grow">
                  <p className={`font-medium ${item.checked ? 'line-through text-gray-400' : ''}`}>{item.item}</p>
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}