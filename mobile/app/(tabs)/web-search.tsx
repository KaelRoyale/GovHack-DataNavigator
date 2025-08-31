import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  ActivityIndicator
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { search } from '@/api/GoogleSearchAPI';
import { GoogleCustomSearchResponseDto, Item } from '@/dto/google/GoogleCustomSearchResponseDto';

interface SearchState {
  query: string;
  results: Item[];
  loading: boolean;
  hasMore: boolean;
  nextIndex: number; // để biết lần sau gọi từ đâu
}

export default function WebSearchScreen() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    hasMore: false,
    nextIndex: 1,
  });

  const handleSearch = async (newSearch: boolean = true) => {
    if (!searchState.query.trim() || searchState.loading) return;

    setSearchState(prev => ({ ...prev, loading: true }));

    try {
      const startIndex = newSearch ? 1 : searchState.nextIndex;
      const data: GoogleCustomSearchResponseDto = await search(
        searchState.query,
        startIndex
      );

      const newResults = data.items || [];

      setSearchState(prev => ({
        ...prev,
        results: newSearch ? newResults : [...prev.results, ...newResults],
        loading: false,
        hasMore: !!data.queries?.nextPage, // API trả về nextPage nếu còn dữ liệu
        nextIndex: data.queries?.nextPage?.[0]?.startIndex || prev.nextIndex,
      }));
    } catch (error) {
      setSearchState(prev => ({ ...prev, loading: false }));
      Alert.alert('Lỗi', 'Không thể tìm kiếm. Vui lòng thử lại.');
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const renderSearchResult = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => openUrl(item.link)}
    >
      <View style={styles.resultContent}>
        {item.pagemap?.cse_thumbnail?.[0] && (
          <Image
            source={{ uri: item.pagemap.cse_thumbnail[0].src }}
            style={styles.thumbnail}
          />
        )}
        <View style={styles.textContent}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.resultUrl} numberOfLines={1}>
            {item.displayLink}
          </Text>
          <Text style={styles.resultSnippet} numberOfLines={3}>
            {item.snippet}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchState.query}
          onChangeText={(text) =>
            setSearchState(prev => ({ ...prev, query: text }))
          }
          placeholder="Search"
          onSubmitEditing={() => handleSearch(true)}
          returnKeyType="search"
          editable={!searchState.loading}
        />

        {searchState.query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() =>
              setSearchState(prev => ({
                ...prev,
                query: '',
                results: [],
                nextIndex: 1,
              }))
            }
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(true)}
          disabled={searchState.loading}
        >
          {searchState.loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {searchState.results.length > 0 ? (
        <FlatList
          data={searchState.results}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.link}-${index}`}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!searchState.loading && searchState.hasMore) {
              handleSearch(false);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            searchState.loading ? (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>
            {searchState.loading ? 'Searching...' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    color: '#333',
    paddingRight: 10,
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  resultsList: { flex: 1 },
  resultItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    width: 120,   // tăng kích thước ngang
    height: 120,  // tăng kích thước dọc
    marginBottom: 15, // cách text một chút
  },
  resultContent: { flexDirection: 'row', padding: 15 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  textContent: { flex: 1 },
  resultTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  resultUrl: { fontSize: 12, color: '#007AFF', marginBottom: 6 },
  resultSnippet: { fontSize: 14, color: '#666', lineHeight: 20 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 15 },
});
