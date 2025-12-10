import { useState } from 'react';
import { Calendar, Heart, Pill, Phone, Plus, Search, User, Clock } from 'lucide-react';

export function FamilyHealthCenter() {
  const [activeTab, setActiveTab] = useState('appointments');
  
  // Mock data for demonstration
  const familyMembers = [
    { id: 1, name: 'Father', avatar: '👨', relation: 'Parent' },
    { id: 2, name: 'Mother', avatar: '👩', relation: 'Parent' },
    { id: 3, name: 'Child 1', avatar: '👦', relation: 'Child' },
    { id: 4, name: 'Child 2', avatar: '👧', relation: 'Child' },
  ];
  
  const appointments = [
    { id: 1, member: 'Father', doctor: 'Dr. Smith', specialty: 'Cardiologist', date: '2025-12-15', time: '10:00 AM', location: 'City Hospital' },
    { id: 2, member: 'Child 1', doctor: 'Dr. Johnson', specialty: 'Pediatrician', date: '2025-12-18', time: '2:30 PM', location: 'Children Clinic' },
  ];
  
  const vaccinations = [
    { id: 1, member: 'Child 1', vaccine: 'MMR', date: '2025-11-20', nextDue: '2026-05-20' },
    { id: 2, member: 'Child 2', vaccine: 'Hepatitis B', date: '2025-12-01', nextDue: '2026-01-01' },
  ];
  
  const medications = [
    { id: 1, member: 'Father', name: 'Blood Pressure', dosage: '10mg', frequency: 'Daily', time: '8:00 AM' },
    { id: 2, member: 'Child 1', name: 'Vitamin D', dosage: '5ml', frequency: 'Weekly', time: 'After breakfast' },
  ];
  
  const emergencyContacts = [
    { id: 1, name: 'Emergency Services', number: '999', type: 'emergency' },
    { id: 2, name: 'Family Doctor', number: '+95 123 456 789', type: 'doctor' },
    { id: 3, name: 'Pharmacy', number: '+95 987 654 321', type: 'pharmacy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="heading-hero text-primary flex items-center">
          <Heart className="mr-3 text-red-500" size={32} />
          Family Health Center
        </h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={18} />
          <span>Add Record</span>
        </button>
      </div>

      {/* Family Members */}
      <div className="apple-card p-6 mb-8">
        <h3 className="heading-section mb-4">Family Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-3xl mr-4">{member.avatar}</div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 font-medium ${activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Calendar className="inline mr-2" size={18} />
          Appointments
        </button>
        <button
          onClick={() => setActiveTab('vaccinations')}
          className={`px-4 py-2 font-medium ${activeTab === 'vaccinations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <User className="inline mr-2" size={18} />
          Vaccinations
        </button>
        <button
          onClick={() => setActiveTab('medications')}
          className={`px-4 py-2 font-medium ${activeTab === 'medications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Pill className="inline mr-2" size={18} />
          Medications
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 font-medium ${activeTab === 'contacts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Phone className="inline mr-2" size={18} />
          Emergency Contacts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'appointments' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Upcoming Appointments</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{appointment.member}</p>
                    <p className="text-gray-600">{appointment.doctor} • {appointment.specialty}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Calendar className="mr-1" size={14} />
                      <span className="mr-4">{appointment.date}</span>
                      <Clock className="mr-1" size={14} />
                      <span>{appointment.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{appointment.location}</p>
                  </div>
                  <button className="btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vaccinations' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Vaccination Records</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {vaccinations.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{record.member}</p>
                    <p className="text-gray-600">{record.vaccine}</p>
                    <div className="flex text-sm text-gray-500 mt-2">
                      <span className="mr-4">Given: {record.date}</span>
                      <span>Next Due: {record.nextDue}</span>
                    </div>
                  </div>
                  <button className="btn-secondary">
                    View History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Medication Reminders</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {medications.map((med) => (
              <div key={med.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{med.member}</p>
                    <p className="text-gray-600">{med.name} • {med.dosage}</p>
                    <div className="flex text-sm text-gray-500 mt-2">
                      <span className="mr-4">{med.frequency}</span>
                      <span>{med.time}</span>
                    </div>
                  </div>
                  <button className="btn-secondary">
                    Edit Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="apple-card">
          <div className="p-6 border-b border-gray-100">
            <h3 className="heading-section">Emergency Contacts</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-gray-600">{contact.number}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary">
                      Call
                    </button>
                    <button className="btn-primary">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}