import { Thermometer, Droplets, Wifi } from 'lucide-react';

function StatusBar({ sensors }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">System Online</span>
          </div>
          
          {sensors?.temperature !== undefined && (
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">
                {sensors.temperature}°C
              </span>
            </div>
          )}
          
          {sensors?.humidity !== undefined && (
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">
                {sensors.humidity}%
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            {sensors?.lastUpdate 
              ? `Updated: ${new Date(sensors.lastUpdate).toLocaleTimeString()}`
              : 'Waiting for data...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
