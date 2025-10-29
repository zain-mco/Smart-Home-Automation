import { useState } from 'react';
import { LogOut, Home, Activity, Settings } from 'lucide-react';
import { useRealtimeData } from '../hooks/useRealtimeData';
import DeviceCard from './DeviceCard';
import SensorPanel from './SensorPanel';
import StatusBar from './StatusBar';

function Dashboard({ user, onLogout }) {
  const { data: devices, loading: devicesLoading } = useRealtimeData('devices');
  const { data: sensors, loading: sensorsLoading } = useRealtimeData('sensors');
  const [activeTab, setActiveTab] = useState('devices');

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Home</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <StatusBar sensors={sensors} />

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              activeTab === 'devices'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Devices</span>
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
              activeTab === 'sensors'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span className="font-medium">Sensors</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'devices' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Devices</h2>
            {devicesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
              </div>
            ) : devices ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(devices).map(([id, device]) => (
                  <DeviceCard key={id} id={id} device={device} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No devices found. Add devices in Firebase.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sensors' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Sensor Data</h2>
            {sensorsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
              </div>
            ) : (
              <SensorPanel sensors={sensors} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
