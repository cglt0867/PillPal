import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

type ReminderModalProps = {
  visible: boolean;
  meds: any[];
  onClose: () => void;
  onConfirm: (med: any) => void;
  onSkip: (med: any) => void;
};

const ReminderModal = ({ visible, meds, onClose, onConfirm, onSkip }: ReminderModalProps) => {
  const [respondedMeds, setRespondedMeds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setRespondedMeds([]);
    }
  }, [visible]);

  const handleResponse = (med: any, action: 'confirm' | 'skip') => {
    if (respondedMeds.includes(med.id)) return;

    if (action === 'confirm') onConfirm(med);
    else onSkip(med);

    setRespondedMeds(prev => [...prev, med.id]);
  };

  const allAnswered = respondedMeds.length === meds.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-8 rounded-xl w-80">
          <Text className="text-2xl font-bold mb-4">Medication Reminders</Text>

          {meds.map((med) => (
            <View key={med.id} className="mb-4 border-b pb-4 border-gray-200">
              <Text className="mb-2 text-center text-lg">
                Have you taken <Text className="font-semibold text-xl">{med.name}</Text>?
              </Text>

              {respondedMeds.includes(med.id) ? (
                <Text className="text-center text-gray-500 italic text-lg">Response recorded</Text>
              ) : (
                <View className="flex-row justify-between mt-7">
                  <TouchableOpacity
                    onPress={() => handleResponse(med, 'confirm')}
                    className="bg-green-600 py-3 rounded-xl w-1/2 mr-2"
                  >
                    <Text className="text-white text-center font-bold">Yes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleResponse(med, 'skip')}
                    className="bg-red-600 py-3 rounded-xl w-1/2 mr-2"
                  >
                    <Text className="text-white font-bold text-center">No</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {allAnswered && (
            <TouchableOpacity
              onPress={onClose}
              className="mt-2 bg-gray-300 py-2 px-4 rounded-lg"
            >
              <Text className="text-center font-semibold">Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ReminderModal;
