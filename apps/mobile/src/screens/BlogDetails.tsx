import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetails'>

export default function BlogDetailsScreen({ route }: Props) {
  const { blog } = route.params
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{blog.title}</Text>
      {!!blog.sub_title && <Text style={styles.subtitle}>{blog.sub_title}</Text>}
      <View style={styles.authorRow}>
        <Text style={styles.authorName}>{blog.author.first_name} {blog.author.last_name}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>Published: {new Date(blog.created_date).toLocaleString()}</Text>
        <Text style={styles.metaText}>Updated: {new Date(blog.modified_date).toLocaleString()}</Text>
      </View>
      <Text style={styles.content}>{blog.content}</Text>
      {blog.tags?.length ? (
        <View style={styles.tagsWrap}>
          {blog.tags.map((t) => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  authorRow: { marginTop: 8 },
  authorName: { fontSize: 13, color: '#444' },
  meta: { marginTop: 8 },
  metaText: { fontSize: 12, color: '#888' },
  content: { fontSize: 16, marginTop: 12, lineHeight: 22 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#ccc' },
  tagText: { color: '#333', fontSize: 13 },
})
