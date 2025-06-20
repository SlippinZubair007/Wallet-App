import { View, Text ,TouchableOpacity } from 'react-native'
import { COLORS } from '../constants/colors';


const NoTransactionsFound = () => {
  const router=useRouter();

  return (
      <View style={styles.emptyState}> 
       <Ionicons
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
       />
       <Text style={styles.emptyStateTitle}>No Transactions yet</Text>
       <Text style={styles.emptyStateTitle}>
        Start tracking your finances by adding your first transaction
       </Text>
       <TouchableOpacity style={styles.emptyStateButton} onPress={()=>router.push("/create")}>
        <Ionicons name="add-circle" size={18} color={COLORS.white}/>
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
       </TouchableOpacity>
      </View>
  )
}

export default NoTransactionsFound