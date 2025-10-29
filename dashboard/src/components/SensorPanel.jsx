import { Thermometer, Droplets, Clock } from 'lucide-react';

function SensorPanel({ sensors }) {
  if (!sensors) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">No sensor data available. Check ESP32 connection.</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Temperature Card */}
      {sensors.temperature !== undefined && (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Thermometer className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800">{sensors.temperature}°C</p>
              <p className="text-sm text-gray-500">Temperature</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Last update: {formatTimestamp(sensors.lastUpdate)}
            </div>
          </div>
        </div>
      )}

      {/* Humidity Card */}
      {sensors.humidity !== undefined && (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800">{sensors.humidity}%</p>
              <p className="text-sm text-gray-500">Humidity</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Last update: {formatTimestamp(sensors.lastUpdate)}
            </div>
          </div>
        </div>
      )}

      {/* Additional Sensors */}
      {Object.entries(sensors)
        .filter(([key]) => key !== 'temperature' && key !== 'humidity' && key !== 'lastUpdate')
        .map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Thermometer className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 capitalize">{key}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SensorPanel;
