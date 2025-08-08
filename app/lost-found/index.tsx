import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Package, Clock, MapPin, Phone, Mail } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

interface LostItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: 'lost' | 'found' | 'claimed';
  contactInfo: string;
  reportedBy: string;
}

const mockLostItems: LostItem[] = [
  {
    id: '1',
    title: 'Black Leather Wallet',
    description: 'Black leather wallet with ID cards and some cash',
    category: 'Wallet',
    location: 'Farmgate Station',
    date: '2024-01-15',
    status: 'lost',
    contactInfo: '+880 1712-345678',
    reportedBy: 'John Doe'
  },
  {
    id: '2',
    title: 'iPhone 14 Pro',
    description: 'Space Gray iPhone 14 Pro with blue case',
    category: 'Phone',
    location: 'Uttara North Station',
    date: '2024-01-14',
    status: 'found',
    contactInfo: 'station.uttara@dmtcl.gov.bd',
    reportedBy: 'Station Staff'
  },
  {
    id: '3',
    title: 'Red Backpack',
    description: 'Red Nike backpack with laptop and books',
    category: 'Bag',
    location: 'Shahbagh Station',
    date: '2024-01-13',
    status: 'found',
    contactInfo: 'station.shahbagh@dmtcl.gov.bd',
    reportedBy: 'Station Staff'
  },
  {
    id: '4',
    title: 'Gold Ring',
    description: 'Gold wedding ring with small diamond',
    category: 'Jewelry',
    location: 'Motijheel Station',
    date: '2024-01-12',
    status: 'lost',
    contactInfo: '+880 1987-654321',
    reportedBy: 'Sarah Ahmed'
  }
];

const categories = ['All', 'Phone', 'Wallet', 'Bag', 'Jewelry', 'Documents', 'Electronics', 'Clothing', 'Other'];

export default function LostFoundScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'lost' | 'found'>('all');

  const filteredItems = mockLostItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return Colors.error;
      case 'found': return Colors.success;
      case 'claimed': return Colors.text.muted;
      default: return Colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lost': return 'Lost';
      case 'found': return 'Found';
      case 'claimed': return 'Claimed';
      default: return status;
    }
  };

  const renderLostItem = (item: LostItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.itemCard}
      onPress={() => router.push(`/lost-found/details?id=${item.id}`)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleContainer}>
          <Package size={20} color={Colors.primary} />
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailItem}>
          <MapPin size={14} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerTitle: 'Lost & Found',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Lost & Found</Text>
          <Text style={styles.subtitle}>
            Report lost items or search for found items in the Dhaka Metro Rail system
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items, locations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.muted}
            />
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {['all', 'lost', 'found'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus(status as 'all' | 'lost' | 'found')}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === status && styles.filterChipTextActive
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Report Lost Item"
            onPress={() => router.push('/lost-found/report')}
            style={[styles.actionButton, { backgroundColor: Colors.error }]}
            icon={<Package size={20} color={Colors.text.light} />}
          />
          <Button
            title="Report Found Item"
            onPress={() => router.push('/lost-found/report?type=found')}
            style={[styles.actionButton, { backgroundColor: Colors.success }]}
            icon={<Plus size={20} color={Colors.text.light} />}
          />
        </View>

        <View style={styles.itemsList}>
          <Text style={styles.sectionTitle}>
            {filteredItems.length} Items Found
          </Text>
          
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Package size={48} color={Colors.text.muted} />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredItems.map(renderLostItem)
          )}
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <View style={styles.contactItem}>
            <Phone size={16} color={Colors.primary} />
            <Text style={styles.contactText}>Hotline: 16374</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color={Colors.primary} />
            <Text style={styles.contactText}>lostandfound@dmtcl.gov.bd</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.text.light,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  categoryChipTextActive: {
    color: Colors.text.light,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  itemsList: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  contactInfo: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
});