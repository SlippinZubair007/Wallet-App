import { useUser } from '@clerk/clerk-expo'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react' 
import PageLoader from '@/components/PageLoader'
import { Image } from 'expo-image'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { BalanceCard } from '@/components/BalanceCard'  
import { FlatList } from "react-native"
import { TransactionItem } from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'
import {useState} from 'react'
import { RefreshControl, Alert } from 'react-native'
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user.id);
  const [refreshing,setRefreshing]=useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);


  const handleDelete=(id) => {
    Alert.alert("Delete transaction", "Are you sure you want to delete this transaction?",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:()=>deleteTransaction(id)},

    ])
  }

  const onRefresh=async ()=>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (isLoading && !refreshing) {
    return <PageLoader />
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>

          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              contentFit="contain"
            />

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                Zubair
                {/* {user?.emailAddresses[0]?.emailAddress.split("@")[0]} */}
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>

        </View>

        {/* Balance Card */}
        <View>
          <BalanceCard summary={summary} />
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>          
        </View>

      </View>

      <FlatList style={styles.transactionList}
      contentContainerStyle={styles.transactionListContent}
      data={transactions} 
      renderItem={({item})=>
        <TransactionItem item={item} onDelete={handleDelete}/>}
        ListEmptyComponent={<NoTransactionsFound/>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />


    </View>
  )
}
