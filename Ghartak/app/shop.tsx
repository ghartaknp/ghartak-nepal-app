import { View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Product } from '@/constants/types';

import { dummyProducts } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'expo-router';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  const fetchProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = dummyProducts.slice(start, end);

      if (pageNumber === 1) {
        setProducts(paginatedData);
      } else {
        setProducts(prev => [...prev, ...paginatedData]);
      }

      setHasMore(end < dummyProducts.length);
      setPage(pageNumber);
    } catch (error) {
      console.error('Pagination error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      
      {/* Header with functional back button */}
      <View className="px-4 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-primary">Shop</Text>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/cart')}
            className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow"
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar with Filter */}
      <View className="px-4 py-2">
        <View className="flex-row items-center">
          {/* Search Input */}
          <View className="flex-1 bg-white flex-row items-center rounded-lg px-3 py-2">
            <Ionicons 
              name="search" 
              size={20} 
              color={COLORS.secondary} 
              style={{ marginRight: 8 }}
            />
            <TextInput 
              style={{ flex: 1, fontSize: 16, color: COLORS.primary, paddingVertical: 0 }} 
              placeholder="Search Products....." 
              placeholderTextColor={COLORS.secondary}
              returnKeyType="search" 
            />
          </View>

          {/* Filter Icon */}
          <TouchableOpacity className="bg-gray-800 w-12 h-12 items-center justify-center rounded-xl ml-3">
            <Ionicons 
              name="options-outline" 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          data={products} 
          keyExtractor={(item) => item._id} 
          numColumns={2} 
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }} 
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-secondary">No product found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}