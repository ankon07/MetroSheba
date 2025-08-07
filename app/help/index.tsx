import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Search, MessageCircle, Phone, Mail, ChevronRight, ChevronDown } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

// FAQ data
const faqCategories = [
  {
    id: "booking",
    title: "Booking & Reservations",
    questions: [
      {
        id: "q1",
        question: "How do I cancel or modify my booking?",
        answer: "You can cancel or modify your booking by going to 'My Trips' and selecting the trip you wish to change. Then tap on 'Modify Booking' or 'Cancel Booking'. Please note that cancellation policies vary depending on the service provider."
      },
      {
        id: "q2",
        question: "What payment methods are accepted?",
        answer: "We accept all major credit and debit cards including Visa, Mastercard, and American Express. You can also pay using PayPal or Apple Pay on supported devices."
      },
      {
        id: "q3",
        question: "How do I get my e-ticket?",
        answer: "Your e-ticket will be sent to your email address after your booking is confirmed. You can also find all your tickets in the 'My Trips' section of the app."
      }
    ]
  },
  {
    id: "account",
    title: "Account & Profile",
    questions: [
      {
        id: "q4",
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login screen and tap on 'Forgot Password'. Enter your email address and follow the instructions sent to your email."
      },
      {
        id: "q5",
        question: "How do I update my personal information?",
        answer: "You can update your personal information by going to the 'Profile' tab and tapping on 'Edit Profile'. Make your changes and tap 'Save'."
      }
    ]
  },
  {
    id: "payment",
    title: "Payments & Refunds",
    questions: [
      {
        id: "q6",
        question: "How long do refunds take to process?",
        answer: "Refunds typically take 5-10 business days to appear on your account, depending on your payment method and financial institution."
      },
      {
        id: "q7",
        question: "Is there a booking fee?",
        answer: "We do not charge a booking fee for most transactions. However, some premium services may include a small service fee which will be clearly displayed before you complete your purchase."
      }
    ]
  }
];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("booking");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  
  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedQuestion(null);
  };
  
  const handleQuestionToggle = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };
  
  const handleContactSupport = () => {
    router.push("/help/contact");
  };

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery.length > 2 
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Help & Support" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>How can we help you?</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.contactOptions}>
          <TouchableOpacity 
            style={styles.contactOption}
            onPress={handleContactSupport}
          >
            <MessageCircle size={24} color={Colors.primary} />
            <Text style={styles.contactOptionText}>Chat with Us</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactOption}
            onPress={() => console.log("Call support")}
          >
            <Phone size={24} color="#4CAF50" />
            <Text style={styles.contactOptionText}>Call Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactOption}
            onPress={() => console.log("Email support")}
          >
            <Mail size={24} color="#FF9800" />
            <Text style={styles.contactOptionText}>Email Us</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(category => (
            <View key={category.id} style={styles.faqCategory}>
              <TouchableOpacity 
                style={styles.categoryHeader}
                onPress={() => handleCategoryToggle(category.id)}
              >
                <Text style={styles.categoryTitle}>{category.title}</Text>
                {expandedCategory === category.id ? (
                  <ChevronDown size={20} color={Colors.text.primary} />
                ) : (
                  <ChevronRight size={20} color={Colors.text.primary} />
                )}
              </TouchableOpacity>
              
              {expandedCategory === category.id && (
                <View style={styles.questionsContainer}>
                  {category.questions.map(question => (
                    <View key={question.id} style={styles.questionItem}>
                      <TouchableOpacity 
                        style={styles.questionHeader}
                        onPress={() => handleQuestionToggle(question.id)}
                      >
                        <Text style={styles.questionText}>{question.question}</Text>
                        {expandedQuestion === question.id ? (
                          <ChevronDown size={16} color={Colors.text.secondary} />
                        ) : (
                          <ChevronRight size={16} color={Colors.text.secondary} />
                        )}
                      </TouchableOpacity>
                      
                      {expandedQuestion === question.id && (
                        <Text style={styles.answerText}>{question.answer}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term or contact our support team</Text>
            <Button
              title="Contact Support"
              onPress={handleContactSupport}
              style={styles.contactButton}
            />
          </View>
        )}
        
        <View style={styles.additionalHelp}>
          <Text style={styles.additionalHelpTitle}>Still need help?</Text>
          <Text style={styles.additionalHelpText}>
            Our support team is available 24/7 to assist you with any questions or issues you may have.
          </Text>
          <Button
            title="Contact Support"
            onPress={handleContactSupport}
            style={styles.contactButton}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text.primary,
  },
  contactOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  contactOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  contactOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginTop: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  faqCategory: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  questionsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  questionItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  answerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    padding: 16,
    paddingTop: 0,
    backgroundColor: Colors.secondary,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginBottom: 24,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  additionalHelp: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  additionalHelpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  additionalHelpText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    marginTop: 8,
  },
});