import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  Animated,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from "react-native-picker-select";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// IMPORTANT: Update this with your backend URL
const API_BASE_URL = "https://ae80f174c8f8.ngrok-free.app";

export default function App() {
  const [receivedMessage, setReceivedMessage] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const relationshipTypes = [
    { label: "Select relationship...", value: "" },
    { label: "Colleague", value: "colleague" },
    { label: "Boss", value: "boss" },
    { label: "Client", value: "client" },
    { label: "Friend", value: "friend" },
    { label: "Partner", value: "partner" },
    { label: "Family", value: "family" },
  ];

  const desiredOutcomes = [
    { label: "Select desired outcome...", value: "" },
    { label: "Schedule a meeting", value: "schedule a meeting" },
    { label: "Decline politely", value: "decline politely" },
    { label: "Show enthusiasm", value: "show enthusiasm" },
    { label: "Request more information", value: "request more information" },
    { label: "Provide update", value: "provide update" },
    { label: "Express gratitude", value: "express gratitude" },
    { label: "Apologize professionally", value: "apologize professionally" },
    { label: "Confirm understanding", value: "confirm understanding" },
    { label: "Ask for clarification", value: "ask for clarification" },
  ];

  useEffect(() => {
    if (suggestions.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [suggestions]);

  const generateSuggestions = async () => {
    // Validation
    if (!receivedMessage.trim()) {
      Alert.alert("Error", "Please paste the received message");
      return;
    }
    if (!relationshipType) {
      Alert.alert("Error", "Please select the relationship type");
      return;
    }
    if (!desiredOutcome) {
      Alert.alert("Error", "Please select the desired outcome");
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setLoading(true);
    setSuggestions([]);
    fadeAnim.setValue(0);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/suggest-messages`,
        {
          received_message: receivedMessage,
          relationship_type: relationshipType,
          desired_outcome: desiredOutcome,
        }
      );

      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      Alert.alert(
        "Error",
        error.response?.data?.detail ||
          "Failed to generate suggestions. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    await Clipboard.setStringAsync(text);
    setCopiedIndex(index);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openWhatsApp = () => {
    const url = "whatsapp://";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "WhatsApp Not Found",
            "Please make sure WhatsApp is installed on your device"
          );
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setReceivedMessage(text);
  };

  const resetForm = () => {
    setReceivedMessage("");
    setRelationshipType("");
    setDesiredOutcome("");
    setSuggestions([]);
    fadeAnim.setValue(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Gradient Header */}
      <LinearGradient
        colors={["#128C7E", "#25D366", "#20B858"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={36} color="#fff" />
          <Text style={styles.headerTitle}>WellSpoken.io</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          AI-Powered Message Assistant
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Received Message Section */}
        <Animated.View
          style={[
            styles.section,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.label}>
            <Ionicons name="mail-outline" size={16} color="#128C7E" />{" "}
            Received Message
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Paste the message you received..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={receivedMessage}
              onChangeText={setReceivedMessage}
            />
            <TouchableOpacity
              style={styles.pasteButton}
              onPress={pasteFromClipboard}
              activeOpacity={0.7}
            >
              <Ionicons name="clipboard-outline" size={18} color="#128C7E" />
              <Text style={styles.pasteButtonText}>Paste</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Relationship Type Section */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="people-outline" size={16} color="#128C7E" />{" "}
            Relationship Type
          </Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              value={relationshipType}
              onValueChange={setRelationshipType}
              items={relationshipTypes}
              style={pickerSelectStyles}
              placeholder={{ label: "Select relationship...", value: "" }}
            />
          </View>
        </View>

        {/* Desired Outcome Section */}
        <View style={styles.section}>
          <Text style={styles.label}>
            <Ionicons name="target-outline" size={16} color="#128C7E" />{" "}
            Desired Outcome
          </Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              value={desiredOutcome}
              onValueChange={setDesiredOutcome}
              items={desiredOutcomes}
              style={pickerSelectStyles}
              placeholder={{ label: "Select desired outcome...", value: "" }}
            />
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            loading && styles.generateButtonDisabled,
          ]}
          onPress={generateSuggestions}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              loading
                ? ["#ccc", "#999"]
                : ["#128C7E", "#25D366", "#20B858"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={22}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.generateButtonText}>
                  Generate AI Suggestions
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Suggestions Section with Animation */}
        {suggestions.length > 0 && (
          <Animated.View
            style={[
              styles.suggestionsContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={24} color="#128C7E" />
              <Text style={styles.sectionTitle}>
                AI Suggestions - Review Before Sending
              </Text>
            </View>

            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                index={index}
                copiedIndex={copiedIndex}
                onCopy={(text) => copyToClipboard(text, index)}
                onOpenWhatsApp={openWhatsApp}
              />
            ))}
          </Animated.View>
        )}

        {/* Reset Button */}
        {(receivedMessage || suggestions.length > 0) && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color="#666" />
            <Text style={styles.resetButtonText}>Start New Message</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={16} color="#999" />
          <Text style={styles.footerText}>
            Powered by Claude AI • Always review before sending
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Suggestion Card Component with Animation
const SuggestionCard = ({
  suggestion,
  index,
  copiedIndex,
  onCopy,
  onOpenWhatsApp,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleCopy = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onCopy(suggestion.text);
  };

  const isCopied = copiedIndex === index;

  return (
    <Animated.View
      style={[
        styles.suggestionCard,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.suggestionHeader}>
        <View style={styles.toneBadge}>
          <Ionicons name="pricetag" size={12} color="#2e7d32" />
          <Text style={styles.toneBadgeText}>{suggestion.tone}</Text>
        </View>
      </View>

      <Text style={styles.suggestionText}>{suggestion.text}</Text>

      <View style={styles.reasoningContainer}>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#666"
        />
        <Text style={styles.reasoningText}>{suggestion.reasoning}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.copyButton, isCopied && styles.copiedButton]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isCopied ? "checkmark-circle" : "copy-outline"}
            size={18}
            color={isCopied ? "#fff" : "#128C7E"}
          />
          <Text
            style={[
              styles.copyButtonText,
              isCopied && styles.copiedButtonText,
            ]}
          >
            {isCopied ? "Copied!" : "Copy"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whatsappButton}
          onPress={onOpenWhatsApp}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#128C7E", "#25D366"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.whatsappButtonGradient}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.whatsappButtonText}>
              {isCopied ? "Open WhatsApp" : "To WhatsApp"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginLeft: 48,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2d3748",
  },
  inputContainer: {
    position: "relative",
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#2d3748",
    minHeight: 110,
    textAlignVertical: "top",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pasteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pasteButtonText: {
    color: "#128C7E",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  generateButton: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#128C7E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  generateButtonGradient: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginRight: 10,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  toneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  toneBadgeText: {
    color: "#2e7d32",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  suggestionText: {
    fontSize: 16,
    color: "#2d3748",
    lineHeight: 24,
    marginBottom: 14,
    fontWeight: "500",
  },
  reasoningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f7fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  reasoningText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 8,
    flex: 1,
    fontStyle: "italic",
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  copiedButton: {
    backgroundColor: "#128C7E",
  },
  copyButtonText: {
    color: "#128C7E",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  copiedButtonText: {
    color: "#fff",
  },
  whatsappButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  whatsappButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  whatsappButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resetButtonText: {
    color: "#64748b",
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "500",
  },
  footer: {
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#2d3748",
    fontWeight: "500",
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: "#2d3748",
    fontWeight: "500",
  },
  placeholder: {
    color: "#94a3b8",
  },
});
