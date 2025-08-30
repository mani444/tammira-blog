import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetails'>

export default function BlogDetailsScreen({ route }: Props) {
  const { id, title } = route.params ?? {}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Blog Details'}</Text>
      <Text style={styles.subtitle}>ID: {id ?? '-'}</Text>
      <Text style={styles.content}>Content coming soon…</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 6 },
  content: { fontSize: 16, marginTop: 12 },
})

