import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text } from '~/components/ui/text';
import { Message } from './Message';

export const ChatArea = ({
	messages,
	isLoading,
	input,
	setInput,
	handleSend,
	uploadedFiles,
	scrollViewRef,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	messages: any[];
	isLoading: boolean;
	input: string;
	setInput: (text: string) => void;
	handleSend: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	uploadedFiles: any[];
	scrollViewRef: React.RefObject<ScrollView | null>;
}) => {
	return (
		<Card className='flex-1 shadow-lg'>
			<CardHeader className='border-b border-gray-200 bg-white/50'>
				<View className='flex-row items-center justify-between'>
					<View className='flex-row items-center'>
						<FontAwesome5 name='robot' size={24} color='black' />
						<Text className='ml-2 text-xl font-semibold'>RAG Chatbot</Text>
					</View>
					<Badge variant='secondary'>
						<Text className='text-xs'>{uploadedFiles.filter((f) => f.status === 'ready').length} documents ready</Text>
					</Badge>
				</View>
			</CardHeader>

			<CardContent className='flex-1 p-0'>
				{/* Messages */}
				<ScrollView
					ref={scrollViewRef}
					className='flex-1 px-4 py-4'
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 20 }}
				>
					{messages.map((message) => (
						<Message key={message.id} message={message} />
					))}

					{isLoading && (
						<View className='mb-4 items-start'>
							<View className='max-w-[85%] flex-row items-start'>
								<Avatar className='mr-2 mt-1 h-8 w-8' alt='Assistant Avatar'>
									<AvatarFallback className='bg-blue-100'>
										<FontAwesome5 name='robot' size={16} color='#2563eb' />
									</AvatarFallback>
								</Avatar>
								<View className='rounded-lg border border-gray-200 bg-white px-4 py-2'>
									<View className='flex-row items-center'>
										<Ionicons name='sync' size={16} color='#2563eb' />
										<Text className='ml-2 text-sm text-gray-500'>Analyzing documents and thinking...</Text>
									</View>
								</View>
							</View>
						</View>
					)}
				</ScrollView>

				{/* Input Area */}
				<View className='border-t border-gray-200 bg-white/50 px-4 py-3'>
					<View className='flex-row items-end'>
						<View className='mr-2 flex-1'>
							<TextInput
								value={input}
								onChangeText={setInput}
								placeholder={
									uploadedFiles.filter((f) => f.status === 'ready').length > 0
										? 'Ask questions based on your documents...'
										: 'Enter your question or upload documents first...'
								}
								multiline
								maxLength={500}
								className='max-h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm'
								editable={!isLoading}
							/>
						</View>
						<TouchableOpacity
							onPress={handleSend}
							disabled={!input.trim() || isLoading}
							className={`h-10 w-10 items-center justify-center rounded-lg ${
								!input.trim() || isLoading ? 'bg-gray-300' : 'bg-blue-600'
							}`}
						>
							{isLoading ? (
								<Ionicons name='sync' size={16} color='white' />
							) : (
								<Ionicons name='send' size={16} color='white' />
							)}
						</TouchableOpacity>
					</View>
					<View className='mt-2 flex-row items-center justify-between'>
						<Text className='text-xs text-gray-500'>Press Enter to send, Shift + Enter for new line</Text>
						<Text className='text-xs text-gray-500'>
							Powered by RAG • {uploadedFiles.filter((f) => f.status === 'ready').length} documents available
						</Text>
					</View>
				</View>
			</CardContent>
		</Card>
	);
};
