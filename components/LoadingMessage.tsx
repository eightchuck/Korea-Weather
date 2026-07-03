import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props = {
  message?: string;
};

export default function LoadingMessage({ message = '날씨 정보를 불러오는 중입니다...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#007aff" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 15,
    color: '#3a3a3c',
    marginLeft: 10,
  },
});
