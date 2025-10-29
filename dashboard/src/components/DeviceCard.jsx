import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase';
import { 
  Lightbulb, 
  Wind, 
  Thermometer, 
  Power, 
  Loader2,
  Zap
} from 'lucide-react';

const deviceIcons = {
  lamp: Lightbulb,
  fan: Wind,
  ac: Thermometer,
  default: Power,
};

function DeviceCard({ id, device }) {
  const [updating, setUpdating] = useState(false);
  const isOn = device.status === 'on';
  
  const Icon = deviceIcons[id.toLowerCase().includes('lamp') ? 'lamp' :
                          id.toLowerCase().includes('fan') ? 'fan' :
                          id.toLowerCase().includes('ac') ? 'ac' : 'default'];

  const toggleDevice = async () => {
    setUpdating(true);
    try {
      const deviceRef = ref(db, `devices/${id}`);
      await update(deviceRef, {
        status: isOn ? 'off' : 'on'
      });
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Failed to update device. Check Firebase permissions.');
    } finally {
      setTimeout(() => setUpdating(false), 500);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
      updating ? 'scale-95' : 'scale-100'
    }`}>
      <div className={`p-6 ${isOn ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-lg ${isOn ? 'bg-white/20' : 'bg-gray-200'}`}>
            <Icon className={`h-8 w-8 ${isOn ? 'text-white' : 'text-gray-600'}`} />
          </div>
          {isOn && (
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />
              <span className="text-xs text-white font-medium">Active</span>
            </div>
          )}
        </div>
        <h3 className={`mt-4 text-xl font-bold ${isOn ? 'text-white' : 'text-gray-800'}`}>
          {device.name || id}
        </h3>
        <p className={`text-sm ${isOn ? 'text-white/80' : 'text-gray-500'}`}>
          Status: {isOn ? 'ON' : 'OFF'}
        </p>
        {device.temperature && (
          <p className={`text-sm ${isOn ? 'text-white/80' : 'text-gray-500'}`}>
            Temperature: {device.temperature}°C
          </p>
        )}
      </div>

      <div className="p-4 bg-white">
        <button
          onClick={toggleDevice}
          disabled={updating}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isOn
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {updating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Power className="h-5 w-5" />
              <span>Turn {isOn ? 'OFF' : 'ON'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DeviceCard;
