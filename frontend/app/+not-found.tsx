import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function NotFound() {
	return (
		<View className='flex-1 items-center justify-center'>
			<View className='rounded p-4'>
				<Text>404 - Page Not Found</Text>
			</View>
		</View>
	);
}
