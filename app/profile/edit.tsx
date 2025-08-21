import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Camera, X, Upload, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nationality: user?.nationality || "",
    profileImage: user?.profileImage || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const [kycDocuments, setKycDocuments] = useState({
    nidFront: user?.kycDocuments?.nidFront || "",
    nidBack: user?.kycDocuments?.nidBack || "",
    passport: user?.kycDocuments?.passport || "",
    drivingLicense: user?.kycDocuments?.drivingLicense || "",
  });
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setProfileData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };
  
  const handleRemoveImage = () => {
    setProfileData((prev) => ({ ...prev, profileImage: "" }));
  };
  
  const handleDocumentUpload = async (documentType: keyof typeof kycDocuments) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "Permission to access camera roll is required!");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setKycDocuments(prev => ({
          ...prev,
          [documentType]: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error("Error selecting document:", error);
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  const handleDocumentRemove = (documentType: keyof typeof kycDocuments) => {
    setKycDocuments(prev => ({
      ...prev,
      [documentType]: ""
    }));
  };

  const handleKycSubmit = () => {
    if (!kycDocuments.nidFront || !kycDocuments.nidBack) {
      Alert.alert("Missing Documents", "Please upload both front and back of your National ID.");
      return;
    }

    Alert.alert(
      "Submit KYC",
      "Are you sure you want to submit your documents for KYC verification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            // Update user with KYC documents and status
            updateUser({
              kycDocuments,
              kycStatus: 'pending'
            });
            Alert.alert("Success", "Your KYC documents have been submitted for verification. You will be notified once the review is complete.");
          }
        }
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'pending':
        return <Clock size={16} color="#FF9800" />;
      case 'rejected':
        return <AlertCircle size={16} color="#F44336" />;
      default:
        return <FileText size={16} color="#666" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Started';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return { backgroundColor: '#E8F5E9' };
      case 'pending':
        return { backgroundColor: '#FFF3E0' };
      case 'rejected':
        return { backgroundColor: '#FFEBEE' };
      default:
        return { backgroundColor: '#F5F5F5' };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return { color: '#4CAF50' };
      case 'pending':
        return { color: '#FF9800' };
      case 'rejected':
        return { color: '#F44336' };
      default:
        return { color: '#666' };
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Update user data including address and date of birth
    updateUser({
      ...profileData,
      kycDocuments,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Edit Profile" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          {profileData.profileImage ? (
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: profileData.profileImage }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {profileData.firstName.charAt(0)}
                {profileData.lastName.charAt(0)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleSelectImage}
          >
            <Camera size={16} color={Colors.primary} style={styles.cameraIcon} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={profileData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              placeholder="Enter your first name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={profileData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              placeholder="Enter your last name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nationality</Text>
            <TextInput
              style={styles.input}
              value={profileData.nationality}
              onChangeText={(text) => handleInputChange("nationality", text)}
              placeholder="Enter your nationality"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={profileData.dateOfBirth}
              onChangeText={(text) => handleInputChange("dateOfBirth", text)}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={profileData.address.street}
              onChangeText={(text) => setProfileData(prev => ({
                ...prev,
                address: { ...prev.address, street: text }
              }))}
              placeholder="Enter your street address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={profileData.address.city}
                onChangeText={(text) => setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: text }
                }))}
                placeholder="City"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.input}
                value={profileData.address.state}
                onChangeText={(text) => setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: text }
                }))}
                placeholder="State"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={profileData.address.postalCode}
                onChangeText={(text) => setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, postalCode: text }
                }))}
                placeholder="Postal Code"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                style={styles.input}
                value={profileData.address.country}
                onChangeText={(text) => setProfileData(prev => ({
                  ...prev,
                  address: { ...prev.address, country: text }
                }))}
                placeholder="Country"
              />
            </View>
          </View>
        </View>

        {/* KYC Verification Section */}
        <View style={styles.formSection}>
          <View style={styles.kycHeader}>
            <Text style={styles.sectionTitle}>KYC Verification</Text>
            {user?.kycStatus && (
              <View style={[styles.statusBadge, getStatusBadgeStyle(user.kycStatus)]}>
                {getStatusIcon(user.kycStatus)}
                <Text style={[styles.statusText, getStatusTextStyle(user.kycStatus)]}>
                  {getStatusText(user.kycStatus)}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.kycDescription}>
            Complete your KYC verification to unlock all features and increase your transaction limits.
          </Text>

          {/* Document Upload Section */}
          <View style={styles.documentsContainer}>
            <Text style={styles.documentsTitle}>Upload Documents</Text>
            
            <DocumentUploadCard
              title="National ID (Front)"
              description="Upload the front side of your National ID"
              imageUri={kycDocuments.nidFront}
              onUpload={() => handleDocumentUpload('nidFront')}
              onRemove={() => handleDocumentRemove('nidFront')}
            />

            <DocumentUploadCard
              title="National ID (Back)"
              description="Upload the back side of your National ID"
              imageUri={kycDocuments.nidBack}
              onUpload={() => handleDocumentUpload('nidBack')}
              onRemove={() => handleDocumentRemove('nidBack')}
            />

            <DocumentUploadCard
              title="Passport (Optional)"
              description="Upload your passport for additional verification"
              imageUri={kycDocuments.passport}
              onUpload={() => handleDocumentUpload('passport')}
              onRemove={() => handleDocumentRemove('passport')}
            />

            <DocumentUploadCard
              title="Driving License (Optional)"
              description="Upload your driving license"
              imageUri={kycDocuments.drivingLicense}
              onUpload={() => handleDocumentUpload('drivingLicense')}
              onRemove={() => handleDocumentRemove('drivingLicense')}
            />
          </View>

          {user?.kycStatus !== 'verified' && (
            <Button
              title="Submit for KYC Verification"
              onPress={handleKycSubmit}
              style={styles.kycSubmitButton}
              disabled={!kycDocuments.nidFront || !kycDocuments.nidBack}
            />
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
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
  scrollContent: {
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.primary,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  cameraIcon: {
    marginRight: 4,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  kycHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kycDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  documentsContainer: {
    marginBottom: 20,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  kycSubmitButton: {
    marginTop: 16,
  },
});

// Document Upload Card Component
interface DocumentUploadCardProps {
  title: string;
  description: string;
  imageUri: string;
  onUpload: () => void;
  onRemove: () => void;
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  description,
  imageUri,
  onUpload,
  onRemove,
}) => {
  return (
    <View style={documentStyles.container}>
      <View style={documentStyles.header}>
        <View>
          <Text style={documentStyles.title}>{title}</Text>
          <Text style={documentStyles.description}>{description}</Text>
        </View>
        {imageUri && (
          <TouchableOpacity style={documentStyles.removeButton} onPress={onRemove}>
            <X size={16} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      {imageUri ? (
        <View style={documentStyles.imageContainer}>
          <Image source={{ uri: imageUri }} style={documentStyles.documentImage} />
          <TouchableOpacity style={documentStyles.changeButton} onPress={onUpload}>
            <Text style={documentStyles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={documentStyles.uploadButton} onPress={onUpload}>
          <Upload size={24} color={Colors.primary} />
          <Text style={documentStyles.uploadButtonText}>Upload Document</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const documentStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  removeButton: {
    padding: 4,
  },
  imageContainer: {
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  changeButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
