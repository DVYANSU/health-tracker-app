import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Activity, ActivityType } from "../types";
import { getActivityTypeLabel, getActivityUnit } from "../utils/helpers";
import { storage } from "../utils/storage";

const IST_TIME_ZONE = "Asia/Kolkata";

const getCurrentIstDate = () => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: IST_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  return new Date(year, month - 1, day, hour, minute, 0);
};

export default function LogActivityScreen() {
  const params = useLocalSearchParams();
  const initialType = (params.type as ActivityType) || "water";

  const [activityType, setActivityType] = useState<ActivityType>(initialType);
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const [istBaseDate] = useState<Date>(() => getCurrentIstDate());

  const [time, setTime] = useState(() => {
    const hours = istBaseDate.getHours();
    const minutes = istBaseDate.getMinutes();
    const hh = hours % 12 || 12;
    const mm = String(minutes).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
  });

  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickerValue = useMemo(() => {
    const pickerDate = new Date();
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hh = parseInt(timeMatch[1], 10);
      const mm = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === "PM" && hh !== 12) hh += 12;
      if (ampm === "AM" && hh === 12) hh = 0;
      pickerDate.setHours(hh, mm, 0, 0);
    }
    return pickerDate;
  }, [time]);

  useEffect(() => {
    setActivityType(initialType);
  }, [initialType]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const num = parseFloat(value);
    if (!value || isNaN(num) || num <= 0) {
      newErrors.value = "Enter a valid number";
    } else if (activityType === "sleep" && num > 24) {
      newErrors.value = "Sleep hours cannot exceed 24";
    }

    if (!time || !time.match(/\d+:\d+\s*(AM|PM)/i)) {
      newErrors.time = "Select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Validation Error", "Fix errors and try again");
      return;
    }

    try {
      const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) {
        Alert.alert("Error", "Invalid time format");
        return;
      }
      let hh = parseInt(timeMatch[1], 10);
      const mm = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === "PM" && hh !== 12) hh += 12;
      if (ampm === "AM" && hh === 12) hh = 0;
      
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: IST_TIME_ZONE,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const parts = formatter.formatToParts(now);
      const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
      const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
      const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
      
      const utcDate = new Date(Date.UTC(year, month - 1, day, hh, mm, 0));
      const istTimestamp = new Date(utcDate.getTime() - (5.5 * 60 * 60 * 1000));

      const activity: Activity = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: activityType,
        value: parseFloat(value),
        timestamp: istTimestamp.toISOString(),
        notes: notes.trim() || undefined,
      };

      await storage.saveActivity(activity);

      Alert.alert("Success", "Activity saved!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to save activity");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Activity</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Activity Type</Text>

          <View style={styles.typeContainer}>
            {(["water", "steps", "sleep"] as ActivityType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  activityType === type && styles.typeButtonActive,
                ]}
                onPress={() => setActivityType(type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    activityType === type && styles.typeButtonTextActive,
                  ]}
                >
                  {getActivityTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Value ({getActivityUnit(activityType)})
          </Text>
          <TextInput
            style={[styles.input, errors.value && styles.inputError]}
            value={value}
            onChangeText={(t) => {
              setValue(t);
              if (errors.value) setErrors({ ...errors, value: "" });
            }}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#777"
          />
          {errors.value && <Text style={styles.errorText}>{errors.value}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>

          <TouchableOpacity
            style={[styles.input, styles.timeBox]}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>{time}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={pickerValue}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (!selectedDate) return;

                const hours = selectedDate.getHours();
                const minutes = selectedDate.getMinutes();
                const hh = hours % 12 || 12;
                const mm = String(minutes).padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                setTime(`${String(hh).padStart(2, "0")}:${mm} ${ampm}`);

                if (errors.time) setErrors({ ...errors, time: "" });
              }}
            />
          )}

          {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes..."
            placeholderTextColor="#777"
            multiline
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save Activity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1e1e1e",
  },
  backButton: { paddingVertical: 4, paddingHorizontal: 4 },
  backButtonText: { color: "#3498db", fontSize: 16, fontWeight: "600" },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  content: { padding: 20 },

  section: { marginBottom: 26 },
  label: { color: "#e0e0e0", fontSize: 16, fontWeight: "600", marginBottom: 10 },

  typeContainer: { flexDirection: "row", gap: 12 },
  typeButton: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  typeButtonActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  typeButtonText: { color: "#aaa", fontSize: 15, fontWeight: "600" },
  typeButtonTextActive: { color: "#fff" },

  input: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    borderColor: "#2a2a2a",
    borderWidth: 1,
    color: "#fff",
  },
  inputError: { borderColor: "#e74c3c" },
  timeBox: { justifyContent: "center" },
  textArea: { minHeight: 120, textAlignVertical: "top" },

  errorText: { color: "#e74c3c", fontSize: 13, marginTop: 6 },

  buttonRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  cancelText: { color: "#b0b0b0", fontSize: 16, fontWeight: "600" },

  submitButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#3498db",
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
