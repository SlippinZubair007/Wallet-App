import {Slot} from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import { ClerkProvider } from '@clerk/clerk-expo'
import React from 'react';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
{/*screenOptions={{headerShown:false}} */}



export default function RootLayout() {
    return (
  <ClerkProvider tokenCache={tokenCache}>
     <SafeScreen>
        <Slot />
     </SafeScreen>   
   </ClerkProvider>
    );
}