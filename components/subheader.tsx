import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SubHeaderProps {
  title: string;
  onBack: () => void;
  onEditToggle?: () => void;
  editMode?: boolean;
}

const SubHeader = ({ title, onBack, onEditToggle, editMode }: SubHeaderProps) => {
  return (
    <View className="p-4 bg-white shadow relative">
      <View className="flex-row items-center justify-between">
        {/* Left Icon */}
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-2xl font-bold text-center flex-1">{title}</Text>

        {/* Right Icon */}
        {onEditToggle && (
          <TouchableOpacity onPress={onEditToggle} className="p-4">
            <Ionicons name={editMode ? 'close' : 'pencil'} size={24} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SubHeader;
