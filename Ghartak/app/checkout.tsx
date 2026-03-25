import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useCart } from '@/context/CartContext';
import { Address } from '@/constants/types';
import { dummyAddress } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function Checkout() {
  const { cartTotal } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('cash');

  const shipping = 25;
  const tax = 1;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    const addrList = dummyAddress;
    if (addrList.length > 0) {
      const def = addrList.find((a: any) => a.isDefault) || addrList[0];
      setSelectedAddress(def as Address);
    }
    setPageLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add a shipping address',
      });
      return;
    }

    if (paymentMethod === 'stripe') {
      Toast.show({
        type: 'error',
        text1: 'Info',
        text2: 'Stripe not implemented yet',
      });
      return;
    }

    // Cash on delivery
    router.replace('/orders');
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if(pageLoading){
    return (
        <SafeAreaView className='flex-1 bg-surface justify-center items-center'>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
        <Header title='Checkout' showBack />
        

        <ScrollView>
            {/*Address Section */}

            <Text className='text-lg font-bold text-primary mb-4'>Shipping Address</Text>
            {selectedAddress ? (
                <View className='bg-white p-4 rounded-xl mb-6 shadow-sm'>
                    <View className='flex-row items-center justify-between mb-2'>
                        <Text className='text-base font-bold'>{selectedAddress.type}</Text>
                        <TouchableOpacity onPress={()=> router.push('/addresses')}>
                            <Text className='text-accent text-sm'>Change</Text>
                        </TouchableOpacity>

                    </View>
                    <Text className='text-secondary leading-6'>
                        {selectedAddress.street}, {selectedAddress.city}
                        {'\n'}
                        {selectedAddress.state}, {selectedAddress.zipCode}
                        {'\n'}
                        {selectedAddress.country}
                    </Text>

                </View>
            ) : (
                <TouchableOpacity onPress={()=> router.push('/addresses')} className='bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-200'>
                    <Text className='text-primary font-bold'>Add Address</Text>
                </TouchableOpacity>
            )}

            {/*payement section*/}
            <Text className='text-lg font-bold text-primary mb-4'>Payment Method</Text>

            {/* Cash on delivery*/}
            <TouchableOpacity
            onPress={()=> setPaymentMethod('cash')}
  className={`bg-white p-4 rounded-xl mb-4 flex-row items-center border-2`}
  style={{
    borderColor: paymentMethod === 'cash' ? COLORS.primary : 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // Android shadow
  }}
>
  <Ionicons
    name='cash-outline'
    size={24}
    color={COLORS.primary}
    style={{ marginRight: 12 }}
  />
  <View className='flex-1'>
    <Text className='text-base font-bold text-primary'>Cash on Delivery</Text>
    <Text className='text-secondary text-xs mt-1'>
      Pay when you received your order
    </Text>
  </View>
  {paymentMethod === 'cash' && (
    <Ionicons name='checkmark-circle' size={24} color={COLORS.primary} />
  )}
</TouchableOpacity>

         {/* stripe option*/}
            <TouchableOpacity
            onPress={()=> setPaymentMethod('stripe')}
  className={`bg-white p-4 rounded-xl mb-4 flex-row items-center border-2`}
  style={{
    borderColor: paymentMethod === 'stripe' ? COLORS.primary : 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // Android shadow
  }}
>
  <Ionicons
    name='card-outline'
    size={24}
    color={COLORS.primary}
    style={{ marginRight: 12 }}
  />
  <View className='flex-1'>
    <Text className='text-base font-bold text-primary'>Pay with Card</Text>
    <Text className='text-secondary text-xs mt-1'>
      Credit or Debit Card
    </Text>
  </View>
  {paymentMethod === 'stripe' && (
    <Ionicons name='checkmark-circle' size={24} color={COLORS.primary} />
  )}
</TouchableOpacity>

        </ScrollView>

        {/*summery */}

        <View className='p-4 bg-white shadow-lg border-t border-gray-100'>
            <Text className='text-lg font-bold text-primary mb-4'>Order Summery</Text>

            {/*sub total*/}
            <View className='flex-row justify-between mb-2'>
                <Text className='text-secondary'>Subtotal</Text>
                <Text className='font-bold'>NPR{cartTotal.toFixed(2)}</Text>
            </View>
            {/*shipping */}
            <View className='flex-row justify-between mb-2'>
                <Text className='text-secondary'>Shipping</Text>
                <Text className='font-bold'>NPR{shipping.toFixed(2)}</Text>
            </View>
            {/* tax */}
            <View className='flex-row justify-between mb-4'>
                <Text className='text-secondary'>Tax</Text>
                <Text className='font-bold'>NPR{tax.toFixed(2)}</Text>
            </View>
            {/* total */}
            <View className='flex-row justify-between mb-6'>
                <Text className='text-primary text-xl font-bold'>Total</Text>
                <Text className='text-primary text-xl font-bold'>NPR{total.toFixed(2)}</Text>
            </View>

        </View>
        {/*place order button */}

        <TouchableOpacity className={`p-4 rounded-xl items-center ${loading ? 'bg-gray-400' : 'bg-primary'}`}
        onPress={handlePlaceOrder} disabled={loading}
        >
            {loading ? <ActivityIndicator color='white' /> : 
            <Text className='text-white font-bold text-lg'>Place Order</Text>
            }
        </TouchableOpacity>


    </SafeAreaView>
  );
}