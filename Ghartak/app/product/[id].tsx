import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product } from '@/constants/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { dummyProducts } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fetchProduct = async () => {
    const foundProduct = dummyProducts.find((p) => p._id === productId);
    setProduct(foundProduct || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Product Not Found</Text>
      </SafeAreaView>
    );
  }

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: 'info',
        text1: 'No size Selected',
        text2: 'Please select a size',
      });
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Image Carousel */}
        <View className="relative h-[50%] bg-gray-100">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: height * 0.5 }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Header Buttons */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow"
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleWishlist(product)}
              className="w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow"
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Pagination Dots */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images?.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === activeImageIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="px-5 pt-4">
          {/* Title and Rating */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold text-primary flex-1 mr-2">
              {product.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#ffd700" />
              <Text className="text-sm font-bold ml-1">4.6</Text>
              <Text className="text-sm text-secondary ml-1">(85)</Text>
            </View>
          </View>

          {/* Price */}
          <Text className="text-2xl font-bold text-primary mb-6">
            NPR {product.price.toFixed(2)}
          </Text>

          {/* Sizes */}
          {product.sizes?.length ? (
            <>
              <Text className="text-base font-bold text-primary mb-3">Size</Text>
              <View className="flex-row flex-wrap mb-6">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full m-1 items-center justify-center border ${
                      selectedSize === size
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSize === size ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}

          {/* Description */}
          <Text className="text-base font-bold text-primary mb-2">Description</Text>
          <Text className="text-secondary leading-6 mb-6">{product.description}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row p-3 bg-white border-t border-gray-100 shadow-lg">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="flex-1 bg-primary py-4 rounded-full items-center justify-center flex-row mr-2 shadow"
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/cart')}
          className="w-16 h-16 bg-white rounded-full items-center justify-center shadow relative"
        >
          <Ionicons name="cart-outline" size={28} color={COLORS.primary} />
          {itemCount > 0 && (
            <View className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full justify-center items-center">
              <Text className="text-white text-[10px] font-bold">{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}