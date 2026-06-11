import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function BookingScreen({ navigation, route }) {
  const { user } = useAuth();
  const { service, serviceId } = route.params || {};
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!name || !phone || !location || !address || !appointmentDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        '/bookings',
        {
          serviceId: service?._id || serviceId,
          userName: name,
          userPhone: phone,
          location,
          userAddress: address,
          appointmentDate,
          totalAmount: service?.price || 0,
          paymentMethod: 'online',
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      Alert.alert('Success', 'Booking confirmed!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('BookingsTab'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create booking'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book Service</Text>
      </View>

      {service && (
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.title}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          <Text style={styles.servicePrice}>₹{service.price}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="City or area"
            value={location}
            onChangeText={setLocation}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Full address"
            value={address}
            onChangeText={setAddress}
            multiline
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Appointment Date & Time *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD HH:MM"
            value={appointmentDate}
            onChangeText={setAppointmentDate}
            editable={!loading}
          />
          <Text style={styles.hint}>Format: 2026-04-22 14:00</Text>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, loading && styles.bookBtnDisabled]}
          onPress={handleBook}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookBtnText}>Book Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  serviceInfo: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  bookBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  bookBtnDisabled: {
    opacity: 0.6,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
