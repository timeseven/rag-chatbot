import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text } from '~/components/ui/text';

export const Message = ({
	message,
}: {
	message: {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		relatedFiles?: string[];
		sources?: {
			title: string;
			fileName?: string;
			score?: number;
			content: string;
		}[];
		timestamp: Date;
	};
}) => {
	return (
		<View
			key={message.id}
			className={`mb-4 w-full  flex-row ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
		>
			{message.role === 'assistant' && (
				<Avatar className='mr-2 mt-1 h-8 w-8' alt='Assistant Avatar'>
					<AvatarFallback className='bg-blue-100'>
						<FontAwesome5 name='robot' size={16} color='#2563eb' />
					</AvatarFallback>
				</Avatar>
			)}

			<View
				className={`max-w-[90%] rounded-lg px-4 py-2 ${
					message.role === 'user' ? 'bg-blue-600' : 'border border-gray-200 bg-white'
				}`}
			>
				<Text className={`text-sm leading-5 ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
					{message.content}
				</Text>

				{message.relatedFiles && message.relatedFiles.length > 0 && (
					<View className='mt-2 border-t border-gray-200 pt-2'>
						<View className='mb-1 flex-row items-center'>
							<Ionicons name='attach' size={12} color='#6b7280' />
							<Text className='ml-1 text-xs font-medium text-gray-500'>Based on documents</Text>
						</View>
						<View className='flex-row flex-wrap'>
							{message.relatedFiles.map((fileName, index) => (
								<Badge key={index} variant='outline' className='mb-1 mr-1'>
									<Text className='text-xs'>{fileName}</Text>
								</Badge>
							))}
						</View>
					</View>
				)}

				{message.sources && message.sources.length > 0 && (
					<View className='mt-3 border-t border-gray-200 pt-3'>
						<View className='mb-2 flex-row items-center'>
							<Ionicons name='document-text' size={12} color='#6b7280' />
							<Text className='ml-1 text-xs font-medium text-gray-500'>Sources</Text>
						</View>
						{message.sources.map((source, index) => (
							<View key={index} className='mb-2 rounded bg-gray-50 p-2'>
								<View className='mb-1 flex-row items-center justify-between'>
									<Text className='flex-1 text-xs font-medium text-gray-700'>{source.title}</Text>
									<View className='flex-row'>
										{source.fileName && (
											<Badge variant='outline' className='mr-1'>
												<Text className='text-xs'>{source.fileName}</Text>
											</Badge>
										)}
										{source.score && (
											<Badge variant='outline'>
												<Text className='text-xs'>{Math.round(source.score * 100)}%</Text>
											</Badge>
										)}
									</View>
								</View>
								<Text className='text-xs text-gray-600'>{source.content}</Text>
							</View>
						))}
					</View>
				)}

				<View className='mt-2 flex-row justify-end'>
					<Text className='text-xs text-gray-400'>
						{message.timestamp.toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</Text>
				</View>
			</View>

			{message.role === 'user' && (
				<Avatar className='ml-2 mt-1 h-8 w-8' alt='User Avatar'>
					<AvatarFallback className='bg-gray-100'>
						<Ionicons name='person' size={16} color='#6b7280' />
					</AvatarFallback>
				</Avatar>
			)}
		</View>
	);
};
