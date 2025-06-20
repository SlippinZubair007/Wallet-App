import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native'
import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';
import {styles} from "../../assets/styles/create.styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {TextInput} from 'react-native';
import { ActivityIndicator } from 'react-native';
import {API_URL} from '../../constants/api';

const CATEGORIES = [
    {id:"food",name:"Food & Drinks",icon:"fast-food"},
    {id:"shopping",name:"Shopping",icon:"cart"},
    {id:"transportation",name:"Transportation",icon:"car"},
    {id:"entertainment",name:"Entertainment",icon:"film"},
    {id:"bills",name:"Bills",icon:"receipt"},
    {id:"income",name:"Income",icon:"cash"},
    {id:"other",name:"Other",icon:"ellipsis-horizontal"},
];

const CreateScreen = () => {
    const router=useRouter();
    const {user,isLoaded,isSignedIn}=useUser();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isExpense, setIsExpense] = useState(true);
    const [isloading, setIsLoading] = useState(false);

    const handleCreate=async () => {
        if (!title.trim()) return Alert.alert("Error","Please enter a transaction title");
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <=0){
            Alert.alert("Error","Please enter a valid amount");
            return;
        }

        if (!selectedCategory) return Alert.alert("Error","Please select a category");
 
        setIsLoading(true);
        try{
        const formattedAmount=isExpense 
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

        console.log("User object:", user);
console.log("User ID:", user?.id);
        const response=await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            user_id:user.id,
            title,
            amount:formattedAmount,
            category:selectedCategory,
          })
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create transaction');
        }

        Alert.alert("Success","Transaction created successfully");
        router.back();

        } catch(error) {
         Alert.alert("Error", error.message || "Failed to create transaction");
         console.error("Create transaction error:", error);
        } finally {
            setIsLoading(false);
            
        }
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color={COLORS.text} />
       </TouchableOpacity>
       <Text style={styles.headerTitle}>New Transactions</Text>
       <TouchableOpacity
      style={[styles.saveButtonContainer,isloading && styles.saveButtonDisabled]}
      onPress={handleCreate}
      disabled={isloading}
       >
        <Text style={styles.saveButton}>{isloading ? "Saving..." : "Save"}</Text>
        {isloading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
       </TouchableOpacity>
      </View>


      <View style={styles.card}>
       <View style={styles.typeSelector}>

        <TouchableOpacity 
        style={[styles.typeButton,isExpense && styles.typeButtonActive]}
        onPress={() => setIsExpense(true)}
        >
          <Ionicons
          name="arrow-down-circle"
          size={22}
          color={isExpense ? COLORS.white : COLORS.expense}
          style={styles.typeIcon}
          />
          <Text style={[styles.typeButtonText,isExpense && styles.typeButtonTextActive]}>
            Expense
          </Text>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.typeButton,!isExpense && styles.typeButtonActive]}
          onPress={() => setIsExpense(false)}
        >

          <Ionicons
          name="arrow-up-circle"
          size={22}
          color={!isExpense ? COLORS.white : COLORS.income}
          style={styles.typeIcon}
          />
         <Text style={[styles.typeButtonText,!isExpense && styles.typeButtonTextActive]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>

        </TouchableOpacity>
       </View>

       <View style={styles.amountContainer}>
       <Text style={styles.currencySymbol}>Rs</Text>
       <TextInput
       style={styles.amountInput}
       placeholder="0.00"
        placeholderTextColor={COLORS.textLight}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
       />
       </View>

       <View style={styles.inputContainer}>
      <Ionicons name="create-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Transaction Title"
          placeholderTextColor={COLORS.textLight}
          value={title}
          onChangeText={setTitle}
          />
       </View>

         <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
          </Text>

          <View style={styles.categoryGrid}>
           {CATEGORIES.map(category=>(
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory===category.name && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                name={category.icon}
                size={20}
                color={selectedCategory===category.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
                />

                <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory===category.name && styles.categoryButtonTextActive,
                ]}
                >
                  {category.name}
                </Text>
            </TouchableOpacity>
           ))}
          </View>
      </View>

      {isloading && (
         <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
      )}
    </View>
  )
}

export default CreateScreen;