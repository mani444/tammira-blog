import React from 'react'
import { View, Text, Button, StyleSheet, FlatList } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'BlogList'>

const Separator = () => <View style={styles.separator} />

export default function BlogListScreen({ navigation }: Props) {
  const placeholderData = [
    { id: '1', title: 'Sample Blog Title', sub_title: 'Sample Blog Subtitle', author: 'John Doe' },
    { id: '2', title: 'Getting Started with Node.js', sub_title: 'A quick primer', author: 'Jane Smith' },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blogs</Text>
        <Button title="Filter" onPress={() => { /* hook up later */ }} />
      </View>
      <FlatList
        data={placeholderData}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.sub_title}</Text>
            <Text style={styles.itemAuthor}>{item.author}</Text>
            <View style={styles.cta}>
              <Button title="Open" onPress={() => navigation.navigate('BlogDetails', { id: item.id, title: item.title })} />
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '600' },
  separator: { height: 12 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#fff', elevation: 1 },
  itemTitle: { fontSize: 18, fontWeight: '600' },
  itemSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  itemAuthor: { fontSize: 12, color: '#999', marginTop: 6 },
  cta: { marginTop: 8, alignSelf: 'flex-start' },
})
