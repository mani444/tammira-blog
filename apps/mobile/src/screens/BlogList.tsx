import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'
import { useGetBlogsQuery, type Blog } from '../services/blogsApi'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearTags, nextPage, resetPagination, setTags } from '../features/filters/filtersSlice'

type Props = NativeStackScreenProps<RootStackParamList, 'BlogList'>

const Separator = () => <View style={styles.separator} />
const Tag = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[styles.tag, selected && styles.tagSelected]}>
    <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
  </Pressable>
)

export default function BlogListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch()
  const { selectedTags, page, limit } = useAppSelector((s) => s.filters)

  const { data, isLoading, isFetching, isError, refetch } = useGetBlogsQuery({ page, limit, tags: selectedTags }, { refetchOnMountOrArgChange: true })

  const [items, setItems] = useState<Blog[]>([])
  const total = data?.total ?? 0

  // Reset items when tags change or page resets to 1
  useEffect(() => {
    if (page === 1) setItems([])
  }, [selectedTags.join(','), page])

  // Append new page results
  useEffect(() => {
    if (data?.data) {
      setItems((prev) => {
        const seen = new Set(prev.map((b) => b.slug))
        const merged = [...prev]
        for (const b of data.data) if (!seen.has(b.slug)) merged.push(b)
        return merged
      })
    }
  }, [data?.data])

  const onRefresh = useCallback(() => {
    dispatch(resetPagination())
    refetch()
  }, [dispatch, refetch])

  const canLoadMore = items.length < total && !isFetching
  const onEndReached = useCallback(() => {
    if (canLoadMore) dispatch(nextPage())
  }, [canLoadMore, dispatch])

  // Simple tag options; can be replaced by dynamic aggregation
  const tagOptions = useMemo(() => ['tech', 'javascript', 'node', 'mongodb'], [])
  const toggleTag = (t: string) => {
    const next = selectedTags.includes(t) ? selectedTags.filter((x) => x !== t) : [...selectedTags, t]
    dispatch(setTags(next))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blogs</Text>
        {selectedTags.length > 0 && <Button title="Clear" onPress={() => dispatch(clearTags())} />}
      </View>

      <View style={styles.tagsRow}>
        {tagOptions.map((t) => (
          <Tag key={t} label={t} selected={selectedTags.includes(t)} onPress={() => toggleTag(t)} />
        ))}
      </View>

      {isLoading && items.length === 0 ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.error}>Failed to load blogs.</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.slug}
          ItemSeparatorComponent={Separator}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isFetching && page === 1} onRefresh={onRefresh} />}
          ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
          ListEmptyComponent={<Text style={styles.empty}>No blogs found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.sub_title}</Text>
              <Text style={styles.itemAuthor}>{item.author.first_name} {item.author.last_name}</Text>
              <View style={styles.cta}>
                <Button title="Open" onPress={() => navigation.navigate('BlogDetails', { id: item.slug, title: item.title })} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '600' },
  separator: { height: 12 },
  empty: { textAlign: 'center', color: '#666', marginTop: 24 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#ccc' },
  tagSelected: { backgroundColor: '#333', borderColor: '#333' },
  tagText: { color: '#333', fontSize: 13 },
  tagTextSelected: { color: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#c00', marginBottom: 8 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#fff', elevation: 1 },
  itemTitle: { fontSize: 18, fontWeight: '600' },
  itemSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  itemAuthor: { fontSize: 12, color: '#999', marginTop: 6 },
  cta: { marginTop: 8, alignSelf: 'flex-start' },
})
