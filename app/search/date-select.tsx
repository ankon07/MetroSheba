import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import Button from "@/components/Button";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

export default function DateSelectScreen() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchStore();
  
  // Parse the current date from searchParams
  const currentDate = new Date(searchParams.date);
  
  // Set up state for the calendar
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

  // Helper functions for calendar
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
  };

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDate);
    setSearchParams({ date: newDate.toISOString().split("T")[0] });
    router.back();
  };

  // Generate calendar days
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isSelected = day === selectedDate && 
                         selectedMonth === currentDate.getMonth() && 
                         selectedYear === currentDate.getFullYear();
      const isPast = date < today;
      
      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDayCell,
            isPast && styles.pastDayCell,
          ]}
          onPress={() => !isPast && handleDateSelect(day)}
          disabled={isPast}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isPast && styles.pastDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Date</Text>
      </View>

      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {monthNames[selectedMonth]} {selectedYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
          <ChevronRight size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysOfWeek}>
        {dayNames.map((day) => (
          <Text key={day} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView>
        <View style={styles.calendarGrid}>{renderCalendar()}</View>
      </ScrollView>

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateLabel}>Selected Date:</Text>
        <Text style={styles.selectedDateText}>
          {`${monthNames[selectedMonth]} ${selectedDate}, ${selectedYear}`}
        </Text>
      </View>

      <Button
        title="Confirm"
        onPress={handleConfirm}
        style={styles.confirmButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  daysOfWeek: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  selectedDayCell: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  pastDayCell: {
    opacity: 0.5,
  },
  dayText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  pastDayText: {
    color: Colors.text.secondary,
  },
  selectedDateContainer: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  selectedDateLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  confirmButton: {
    marginTop: 16,
  },
});