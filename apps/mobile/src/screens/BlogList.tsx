import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable, ScrollView, TextInput } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'
import { useGetBlogsQuery, type Blog } from '../services/blogsApi'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearTags, nextPage, resetPagination, setTags, setSearch, clearSearch } from '../features/filters/filtersSlice'

type Props = NativeStackScreenProps<RootStackParamList, 'BlogList'>

const Separator = () => <View style={styles.separator} />
const Tag = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={[styles.tag, selected && styles.tagSelected]}>
    <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
  </Pressable>
)

export default function BlogListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch()
  const { selectedTags, page, limit, search } = useAppSelector((s) => s.filters)

  const { data, isLoading, isFetching, isError, refetch } = useGetBlogsQuery({ page, limit, tags: selectedTags }, { refetchOnMountOrArgChange: true })

  const [items, setItems] = useState<Blog[]>([])
  const total = data?.total ?? 0

  const tagsKey = useMemo(() => selectedTags.join(','), [selectedTags])
  // Reset items when tags change or page resets to 1
  useEffect(() => {
    if (page === 1) setItems([])
  }, [tagsKey, page])

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
  const tagOptions = useMemo(() => {
    const set = new Set<string>()
    for (const b of items) {
      for (const t of b.tags ?? []) set.add(t)
    }
    const arr = Array.from(set)
    arr.sort()
    return arr.length ? arr : ['tech', 'javascript', 'mongodb', 'node']
  }, [items])
  const toggleTag = (t: string) => {
    const next = selectedTags.includes(t) ? selectedTags.filter((x) => x !== t) : [...selectedTags, t]
    dispatch(setTags(next))
  }

  const visibleItems = useMemo(() => {
    if (!search) return items
    const q = search.toLowerCase()
    function match(b: Blog) {
      if (b.title?.toLowerCase().includes(q)) return true
      if (b.sub_title?.toLowerCase().includes(q)) return true
      if (b.content?.toLowerCase().includes(q)) return true
      const name = `${b.author?.first_name ?? ''} ${b.author?.last_name ?? ''}`.trim().toLowerCase()
      if (name.includes(q)) return true
      if (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(q))) return true
      return false
    }
    return items.filter(match)
  }, [items, search])

  const resultsText = useMemo(() => {
    const count = visibleItems.length
    if (total > 0) return `${count} / ${total}`
    if (count > 0) return `${count}`
    return '0'
  }, [visibleItems.length, total])

  const filtersText = useMemo(() => {
    return selectedTags.length ? `Filters: ${selectedTags.join(', ')}` : 'All tags'
  }, [selectedTags])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Blogs</Text>
          <Text style={styles.subtitle}>{resultsText} results • {filtersText}</Text>
        </View>
        {selectedTags.length > 0 && <Button title="Clear" onPress={() => dispatch(clearTags())} />}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by title, tag, author"
          value={search}
          onChangeText={(t) => dispatch(setSearch(t))}
          autoCorrect={false}
          style={styles.searchInput}
        />
        {search?.length ? <Button title="X" onPress={() => dispatch(clearSearch())} /> : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
        {tagOptions.map((t) => (
          <Tag key={t} label={t} selected={selectedTags.includes(t)} onPress={() => toggleTag(t)} />
        ))}
      </ScrollView>

      {isLoading && items.length === 0 ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.error}>Failed to load blogs.</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          keyExtractor={(item) => item.slug}
          ItemSeparatorComponent={Separator}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isFetching && page === 1} onRefresh={onRefresh} />}
          ListFooterComponent={isFetching && page > 1 ? <ActivityIndicator style={styles.footerSpinner} /> : null}
          ListEmptyComponent={<Text style={styles.empty}>No blogs found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.sub_title}</Text>
              <Text style={styles.itemAuthor}>{item.author.first_name} {item.author.last_name}</Text>
              <View style={styles.cta}>
                <Button title="Open" onPress={() => navigation.navigate('BlogDetails', { blog: item })} />
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
  subtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
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
  footerSpinner: { marginVertical: 16 },
})
