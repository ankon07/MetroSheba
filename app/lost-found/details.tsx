import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Package, MapPin, Calendar, Phone, Mail, User, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { LostFoundItem } from '@/types';

const mockLostItems: LostFoundItem[] = [
  {
    id: '1',
    title: 'Black iPhone 14',
    description: 'Black iPhone 14 with a blue case. Lost on the Red Line between Uttara and Motijheel. Screen has a small crack on the top right corner. Phone is locked with Face ID. Case has a small sticker with a cat design.',
    category: 'Electronics',
    location: 'Uttara North Station',
    dateReported: '2024-01-15',
    status: 'lost',
    reporterName: 'John Doe',
    contactInfo: 'john.doe@email.com',
    reportId: 'LF-2024-001',
    additionalDetails: {
      color: 'Black',
      brand: 'Apple',
      model: 'iPhone 14',
      condition: 'Good with minor screen crack',
      lastSeen: 'Platform 1, near bench',
      reward: '1000 BDT'
    }
  },
  {
    id: '2',
    title: 'Brown Leather Wallet',
    description: 'Brown leather wallet containing ID cards and some cash. Lost near the ticket counter. Has a small scratch on the front and contains a driving license with the name "John Smith". Also has several credit cards and approximately 2000 BDT in cash.',
    category: 'Wallet',
    location: 'Motijheel Station',
    dateReported: '2024-01-14',
    status: 'found',
    reporterName: 'Station Staff',
    contactInfo: 'motijheel.station@dmtcl.gov.bd',
    reportId: 'LF-2024-002',
    additionalDetails: {
      color: 'Brown',
      brand: 'Unknown',
      size: 'Standard wallet size',
      foundLocation: 'Near ticket counter',
      condition: 'Good condition'
    }
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
    additionalDetails: {
      color: 'Blue',
      brand: 'Jansport',
      size: 'Medium',
      lastSeen: 'Platform 2',
      reward: '500 BDT'
    }
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
    additionalDetails: {
      material: 'Gold',
      size: 'Size 7',
      engraving: 'M&R',
      foundLocation: 'Platform restroom',
      condition: 'Excellent'
    }
  }
];

export default function LostFoundDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const item = mockLostItems.find(item => item.id === id);

  if (!item) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Package size={48} color={Colors.text.muted} />
          <Text style={styles.errorTitle}>Item not found</Text>
          <Text style={styles.errorText}>The requested item could not be found.</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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

  const handleContact = () => {
    if (item.contactInfo.includes('@')) {
      Linking.openURL(`mailto:${item.contactInfo}`);
    } else {
      Linking.openURL(`tel:${item.contactInfo}`);
    }
  };

  const handleShare = () => {
    Alert.alert(
      'Share Item',
      'Share this lost/found item with others to help spread the word.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Share item') }
      ]
    );
  };

  const handleClaim = () => {
    Alert.alert(
      'Claim Item',
      'To claim this item, you will need to provide proof of ownership and visit the station where it was found.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Station', onPress: handleContact }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <TouchableOpacity onPress={handleShare}>
          <Share2 size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.itemHeader}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            <Text style={styles.reportId}>#{item.reportId}</Text>
          </View>
          
          <View style={styles.titleContainer}>
            <Package size={32} color={Colors.primary} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{item.category}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Location</Text>
                <View style={styles.detailValueContainer}>
                  <MapPin size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailValue}>{item.location}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date {item.status === 'found' ? 'Found' : 'Lost'}</Text>
                <View style={styles.detailValueContainer}>
                  <Calendar size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailValue}>
                    {new Date(item.dateReported).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Reported By</Text>
                <View style={styles.detailValueContainer}>
                  <User size={16} color={Colors.text.secondary} />
                  <Text style={styles.detailValue}>{item.reporterName}</Text>
                </View>
              </View>
            </View>
          </View>

          {item.additionalDetails && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.additionalDetails}>
                {Object.entries(item.additionalDetails).map(([key, value]) => (
                  <View key={key} style={styles.additionalDetailItem}>
                    <Text style={styles.additionalDetailLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </Text>
                    <Text style={styles.additionalDetailValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactCard}>
              <View style={styles.contactInfo}>
                {item.contactInfo.includes('@') ? (
                  <View style={styles.contactItem}>
                    <Mail size={20} color={Colors.primary} />
                    <Text style={styles.contactText}>{item.contactInfo}</Text>
                  </View>
                ) : (
                  <View style={styles.contactItem}>
                    <Phone size={20} color={Colors.primary} />
                    <Text style={styles.contactText}>{item.contactInfo}</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>

          {item.status === 'found' && (
            <View style={styles.claimSection}>
              <Text style={styles.claimTitle}>Found Your Item?</Text>
              <Text style={styles.claimText}>
                If this is your item, please contact the station or the person who found it. 
                You may need to provide proof of ownership.
              </Text>
              <Button
                title="Claim This Item"
                onPress={handleClaim}
                style={StyleSheet.flatten([styles.claimButton, { backgroundColor: Colors.success }])}
              />
            </View>
          )}

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Contact the Dhaka Metro Rail Lost & Found department for assistance.
            </Text>
            <View style={styles.helpContact}>
              <View style={styles.helpContactItem}>
                <Phone size={16} color={Colors.text.secondary} />
                <Text style={styles.helpContactText}>Hotline: 16374</Text>
              </View>
              <View style={styles.helpContactItem}>
                <Mail size={16} color={Colors.text.secondary} />
                <Text style={styles.helpContactText}>lostandfound@dmtcl.gov.bd</Text>
              </View>
            </View>
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
  itemHeader: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reportId: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  additionalDetails: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  additionalDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  additionalDetailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  additionalDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  contactButtonText: {
    color: Colors.text.light,
    fontWeight: '600',
    fontSize: 14,
  },
  claimSection: {
    backgroundColor: Colors.success + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  claimTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 8,
  },
  claimText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  claimButton: {
    marginTop: 8,
  },
  helpSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  helpContact: {
    gap: 8,
  },
  helpContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpContactText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});
