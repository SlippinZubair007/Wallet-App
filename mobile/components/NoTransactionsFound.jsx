import { View, Text ,TouchableOpacity } from 'react-native'
import { COLORS } from '../constants/colors';
import {useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../assets/styles/home.styles';

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

       <TouchableOpacity style={styles.emptyStateButton} onPress={()=>router.push("/create")}>
        <Ionicons name="add-circle" size={18} color={COLORS.white}/>
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
       </TouchableOpacity>
      </View>
  )
}

export default NoTransactionsFound