import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { CartItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'


export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {

  const imageUrl = item.product.images[0]

  return (
    <View className='flex-row mb-4 bg-white p-3 rounded-xl shadow-sm'>
      
      {/* Product Image */}
      <View className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3'>
        <Image
          source={{ uri: imageUrl }}
          className='w-full h-full'
          resizeMode='cover'
        />
      </View>

      {/* Details */}
      <View className='flex-1 justify-between'>
        
        {/* Top Row */}
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className='text-primary font-semibold text-sm mb-1'>
              {item.product.name}
            </Text>
            <Text className='text-secondary text-xs'>
              Size: {item.size}
            </Text>
          </View>

          <TouchableOpacity onPress={onRemove}>
            <Ionicons name='close-circle-outline' size={22} color='#ff4c3b' />
          </TouchableOpacity>
        </View>

        {/* Bottom Row */}
        <View className='flex-row justify-between items-center mt-3'>
          
          {/* Price */}
          <Text className='text-primary font-bold text-base'>
            NPR {item.product.price.toFixed(2)}
          </Text>

          {/* Quantity Controls */}
          <View className='flex-row items-center bg-gray-200 rounded-full px-2 py-1'>
            
            {/* Decrease */}
            <TouchableOpacity
              className='p-2'
              onPress={() => {
                if (item.quantity > 1) {
                  onUpdateQuantity && onUpdateQuantity(item.quantity - 1)
                }
              }}
            >
              <Ionicons name='remove-outline' size={20} color='black' />
            </TouchableOpacity>

            {/* Quantity */}
            <Text className='text-primary font-semibold mx-3'>
              {item.quantity}
            </Text>

            {/* Increase */}
            <TouchableOpacity
              className='p-2'
              onPress={() => {
                onUpdateQuantity && onUpdateQuantity(item.quantity + 1)
              }}
            >
              <Ionicons name='add-outline' size={20} color='black' />
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  )
}