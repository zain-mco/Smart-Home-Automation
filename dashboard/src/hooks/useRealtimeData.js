import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';

export function useRealtimeData(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dataRef = ref(db, path);
    
    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData(null);
      }
      setLoading(false);
    };

    const handleError = (err) => {
      console.error('Firebase error:', err);
      setError(err.message);
      setLoading(false);
    };

    // Subscribe to realtime updates
    onValue(dataRef, handleData, handleError);

    // Cleanup subscription
    return () => {
      off(dataRef);
    };
  }, [path]);

  return { data, loading, error };
}
