import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, Package, Clock, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { LostFoundItem, LostFoundCategory } from '@/types';

const categories: (LostFoundCategory | 'All')[] = [
  'All',
  'Electronics',
  'Bags & Luggage',
  'Clothing',
  'Documents',
  'Jewelry',
  'Keys',
  'Wallet',
  'Phone',
  'Other'
];

export default function LostAndFoundScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LostFoundCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'lost' | 'found'>('all');
  const [lostItems, setLostItems] = useState<LostFoundItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  const mockLostItems: LostFoundItem[] = [
    {
      id: '1',
      title: 'Black iPhone 14',
      description: 'Black iPhone 14 with a blue case. Lost on the Red Line between Uttara and Motijheel.',
      category: 'Electronics',
      location: 'Uttara North Station',
      dateReported: '2024-01-15',
      status: 'lost',
      reporterName: 'John Doe',
      contactInfo: 'john.doe@email.com',
      reportId: 'LF-2024-001',
    },
    {
      id: '2',
      title: 'Brown Leather Wallet',
      description: 'Brown leather wallet containing ID cards and some cash. Lost near the ticket counter.',
      category: 'Wallet',
      location: 'Motijheel Station',
      dateReported: '2024-01-14',
      status: 'found',
      reporterName: 'Station Staff',
      contactInfo: 'motijheel.station@dmtcl.gov.bd',
      reportId: 'LF-2024-002',
    },
    {
      id: '3',
      title: 'Blue Backpack',
      description: 'Blue Jansport backpack with laptop and books. Has a small tear on the front pocket.',
      category: 'Bags & Luggage',
      location: 'Shahbagh Station',
      dateReported: '2024-01-13',
      status: 'lost',
      reporterName: 'Sarah Ahmed',
      contactInfo: '01712345678',
      reportId: 'LF-2024-003',
    },
    {
      id: '4',
      title: 'Gold Wedding Ring',
      description: 'Gold wedding ring with small diamond. Engraved with initials "M&R".',
      category: 'Jewelry',
      location: 'Farmgate Station',
      dateReported: '2024-01-12',
      status: 'found',
      reporterName: 'Cleaning Staff',
      contactInfo: 'farmgate.station@dmtcl.gov.bd',
      reportId: 'LF-2024-004',
    },
  ];

  useEffect(() => {
    loadLostItems();
  }, []);

  const loadLostItems = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLostItems(mockLostItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load lost items');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLostItems();
    setRefreshing(false);
  };

  const filteredItems = lostItems.filter(item => {
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

  const renderLostItem = (item: LostFoundItem) => (
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
          <Text style={styles.detailText}>
            {new Date(item.dateReported).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lost & Found</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.introSection}>
          <Text style={styles.subtitle}>
            Report lost items or search for found items in the Dhaka Metro Rail system
          </Text>
        </View>

        {/* Search Bar */}
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

        {/* Status Filter */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {(['all', 'lost', 'found'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus(status)}
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

        {/* Category Filter */}
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Report Lost Item"
            onPress={() => router.push('/lost-found/report')}
            style={StyleSheet.flatten([styles.actionButton, { backgroundColor: Colors.error }])}
            icon={<Package size={20} color={Colors.text.light} />}
          />
          <Button
            title="Report Found Item"
            onPress={() => router.push('/lost-found/report?type=found')}
            style={StyleSheet.flatten([styles.actionButton, { backgroundColor: Colors.success }])}
            icon={<Plus size={20} color={Colors.text.light} />}
          />
        </View>

        {/* Items List */}
        <View style={styles.itemsList}>
          <Text style={styles.sectionTitle}>
            {filteredItems.length} Items Found
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : filteredItems.length === 0 ? (
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

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactSubtitle}>
            Contact the Dhaka Metro Rail Lost & Found department for assistance.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  introSection: {
    padding: 20,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  itemsList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
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
    margin: 20,
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
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
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
