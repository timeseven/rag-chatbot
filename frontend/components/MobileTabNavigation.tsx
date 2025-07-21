import { View, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Text } from '~/components/ui/text';

export const MobileTabNavigation = ({
	uploadedFiles,
	activeTab,
	setActiveTab,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	uploadedFiles: any[];
	activeTab: string;
	setActiveTab: (tab: string) => void;
}) => {
	return (
		<View className='border-b border-gray-200 bg-white'>
			<View className='flex-row'>
				<TouchableOpacity
					className={`flex-1 items-center py-3 ${activeTab === 'chat' ? 'border-b-2 border-blue-600' : ''}`}
					onPress={() => setActiveTab('chat')}
				>
					<View className='flex-row items-center'>
						<Ionicons name='chatbubble' size={16} color={activeTab === 'chat' ? '#2563eb' : '#6b7280'} />
						<Text className={`ml-1 font-medium ${activeTab === 'chat' ? 'text-blue-600' : 'text-gray-600'}`}>Chat</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					className={`flex-1 items-center py-3 ${activeTab === 'files' ? 'border-b-2 border-blue-600' : ''}`}
					onPress={() => setActiveTab('files')}
				>
					<View className='flex-row items-center'>
						<Ionicons name='folder' size={16} color={activeTab === 'files' ? '#2563eb' : '#6b7280'} />
						<Text className={`ml-1 font-medium ${activeTab === 'files' ? 'text-blue-600' : 'text-gray-600'}`}>
							Files ({uploadedFiles.length})
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};
