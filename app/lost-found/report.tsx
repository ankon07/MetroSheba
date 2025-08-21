import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Package, MapPin, Calendar, Phone, Mail, User, FileText } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { LostFoundCategory, LostFoundReport } from '@/types';

const categories: LostFoundCategory[] = [
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

const stations = [
  'Uttara North', 'Uttara Center', 'Uttara South', 'Pallabi', 'Mirpur 11', 'Mirpur 10',
  'Kazipara', 'Shewrapara', 'Agargaon', 'Bijoy Sarani', 'Farmgate', 'Karwan Bazar',
  'Shahbagh', 'Dhaka University', 'Bangladesh Secretariat', 'Motijheel'
];

export default function ReportLostFoundScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const isFoundItem = type === 'found';

  const [formData, setFormData] = useState<LostFoundReport>({
    title: '',
    description: '',
    category: 'Other',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    type: isFoundItem ? 'found' : 'lost',
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.location || !formData.contactName || !formData.contactPhone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      `Your ${isFoundItem ? 'found' : 'lost'} item report has been submitted successfully. You will receive a confirmation email shortly.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const updateFormData = <K extends keyof LostFoundReport>(field: K, value: LostFoundReport[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <Text style={styles.headerTitle}>
          Report {isFoundItem ? 'Found' : 'Lost'} Item
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.introHeader}>
          <View style={styles.iconContainer}>
            <Package size={32} color={isFoundItem ? Colors.success : Colors.error} />
          </View>
          <Text style={styles.title}>
            Report {isFoundItem ? 'Found' : 'Lost'} Item
          </Text>
          <Text style={styles.subtitle}>
            {isFoundItem 
              ? 'Help someone find their lost item by reporting what you found'
              : 'Report your lost item to help station staff locate it'
            }
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Name *</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Black Leather Wallet"
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
                placeholderTextColor={Colors.text.muted}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide detailed description including color, brand, size, and any distinctive features..."
                value={formData.description}
                onChangeText={(value) => updateFormData('description', value)}
                placeholderTextColor={Colors.text.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Package size={20} color={Colors.text.secondary} />
              <Text style={[styles.pickerText, !formData.category && styles.placeholderText]}>
                {formData.category || 'Select category'}
              </Text>
            </TouchableOpacity>
            
            {showCategoryPicker && (
              <View style={styles.pickerContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.pickerItem}
                    onPress={() => {
                      updateFormData('category', category);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowLocationPicker(!showLocationPicker)}
            >
              <MapPin size={20} color={Colors.text.secondary} />
              <Text style={[styles.pickerText, !formData.location && styles.placeholderText]}>
                {formData.location || 'Select station'}
              </Text>
            </TouchableOpacity>
            
            {showLocationPicker && (
              <View style={styles.pickerContainer}>
                <ScrollView style={styles.pickerScrollView}>
                  {stations.map((station) => (
                    <TouchableOpacity
                      key={station}
                      style={styles.pickerItem}
                      onPress={() => {
                        updateFormData('location', station + ' Station');
                        setShowLocationPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{station} Station</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date {isFoundItem ? 'Found' : 'Lost'} *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(value) => updateFormData('date', value)}
                placeholderTextColor={Colors.text.muted}
              />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.sectionSubtitle}>
              This information will be used to contact you about the item
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                value={formData.contactName}
                onChangeText={(value) => updateFormData('contactName', value)}
                placeholderTextColor={Colors.text.muted}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="+880 1XXX-XXXXXX"
                value={formData.contactPhone}
                onChangeText={(value) => updateFormData('contactPhone', value)}
                placeholderTextColor={Colors.text.muted}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={formData.contactEmail}
                onChangeText={(value) => updateFormData('contactEmail', value)}
                placeholderTextColor={Colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              • Your report will be reviewed by station staff{'\n'}
              • You'll receive a confirmation email{'\n'}
              • {isFoundItem 
                ? 'The item will be stored securely at the station'
                : 'We\'ll contact you if your item is found'
              }{'\n'}
              • Updates will be sent via SMS and email
            </Text>
          </View>

          <Button
            title={`Submit ${isFoundItem ? 'Found' : 'Lost'} Item Report`}
            onPress={handleSubmit}
            style={StyleSheet.flatten([
              styles.submitButton,
              { backgroundColor: isFoundItem ? Colors.success : Colors.error }
            ])}
          />
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
  introHeader: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  textArea: {
    height: 80,
    marginLeft: 0,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.muted,
  },
  pickerContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 200,
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  sectionHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 20,
  },
});
