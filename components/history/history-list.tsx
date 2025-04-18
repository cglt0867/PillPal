import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useAuth } from '@/context/authContext';
import HistoryItem from './history-item';

const HistoryList = () => {
  const { fireuser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!fireuser) return;
    const q = query(collection(db, 'medicationHistory'), where('userId', '==', fireuser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Ensure timeTaken is valid
        if (docData.timeTaken && docData.timeTaken.seconds) {
          data.push({ id: doc.id, ...docData });
        }
      });
      setHistory(data.sort((a, b) => b.timeTaken.seconds - a.timeTaken.seconds));
    });
    return () => unsubscribe();
  }, [fireuser]);

  if (!history.length) {
    return <Text className="text-center text-gray-500 mt-4">No history yet.</Text>;
  }

  return (
    <View className="px-6">
      {history.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default HistoryList;
