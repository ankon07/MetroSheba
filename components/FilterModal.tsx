import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { X, Clock, DollarSign, MapPin, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import { MetroStation } from "@/types";

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  timeRange: {
    start: string;
    end: string;
  };
  stations: string[];
  showOnlyDirectRoutes: boolean;
  showEcoFriendlyOnly: boolean;
  minOnTimePerformance: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  availableStations: MetroStation[];
}

const timeSlots = [
  { label: "Early Morning", value: "05:00-08:00", start: "05:00", end: "08:00" },
  { label: "Morning", value: "08:00-12:00", start: "08:00", end: "12:00" },
  { label: "Afternoon", value: "12:00-17:00", start: "12:00", end: "17:00" },
  { label: "Evening", value: "17:00-21:00", start: "17:00", end: "21:00" },
  { label: "Night", value: "21:00-24:00", start: "21:00", end: "24:00" },
];

const priceRanges = [
  { label: "৳20-30", min: 20, max: 30 },
  { label: "৳30-50", min: 30, max: 50 },
  { label: "৳50-80", min: 50, max: 80 },
  { label: "৳80-100", min: 80, max: 100 },
  { label: "All Prices", min: 0, max: 1000 },
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
  availableStations,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      priceRange: { min: 0, max: 1000 },
      timeRange: { start: "00:00", end: "23:59" },
      stations: [],
      showOnlyDirectRoutes: false,
      showEcoFriendlyOnly: false,
      minOnTimePerformance: 0,
    };
    setFilters(resetFilters);
  };

  const toggleStation = (stationId: string) => {
    setFilters(prev => ({
      ...prev,
      stations: prev.stations.includes(stationId)
        ? prev.stations.filter(id => id !== stationId)
        : [...prev.stations, stationId]
    }));
  };

  const selectTimeRange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      timeRange: { start, end }
    }));
  };

  const selectPriceRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Trains</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Price Range</Text>
            </View>
            <View style={styles.optionsGrid}>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={`${range.min}-${range.max}`}
                  style={[
                    styles.optionButton,
                    filters.priceRange.min === range.min &&
                    filters.priceRange.max === range.max &&
                    styles.selectedOption,
                  ]}
                  onPress={() => selectPriceRange(range.min, range.max)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.priceRange.min === range.min &&
                      filters.priceRange.max === range.max &&
                      styles.selectedOptionText,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Departure Time</Text>
            </View>
            <View style={styles.optionsGrid}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.value}
                  style={[
                    styles.optionButton,
                    filters.timeRange.start === slot.start &&
                    filters.timeRange.end === slot.end &&
                    styles.selectedOption,
                  ]}
                  onPress={() => selectTimeRange(slot.start, slot.end)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.timeRange.start === slot.start &&
                      filters.timeRange.end === slot.end &&
                      styles.selectedOptionText,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stations */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Via Stations</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Select stations you want to travel through
            </Text>
            <View style={styles.stationsContainer}>
              {availableStations.slice(0, 10).map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={[
                    styles.stationChip,
                    filters.stations.includes(station.id) && styles.selectedStationChip,
                  ]}
                  onPress={() => toggleStation(station.id)}
                >
                  <Text
                    style={[
                      styles.stationChipText,
                      filters.stations.includes(station.id) && styles.selectedStationChipText,
                    ]}
                  >
                    {station.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Additional Options</Text>
            </View>
            
            <View style={styles.switchOption}>
              <Text style={styles.switchLabel}>Direct Routes Only</Text>
              <Switch
                value={filters.showOnlyDirectRoutes}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, showOnlyDirectRoutes: value }))
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.background}
              />
            </View>

            <View style={styles.switchOption}>
              <Text style={styles.switchLabel}>Eco-Friendly Trains Only</Text>
              <Switch
                value={filters.showEcoFriendlyOnly}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, showEcoFriendlyOnly: value }))
                }
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.background}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    color: Colors.background,
    fontWeight: "600",
  },
  stationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stationChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondary,
  },
  selectedStationChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stationChipText: {
    fontSize: 12,
    color: Colors.text.primary,
  },
  selectedStationChipText: {
    color: Colors.background,
    fontWeight: "600",
  },
  switchOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
});
