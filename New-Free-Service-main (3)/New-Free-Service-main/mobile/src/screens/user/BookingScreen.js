import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
    Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { serviceService, bookingService } from '../../services';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react-native';

export default function BookingScreen({ navigation, route }) {
    const { serviceId } = route.params;
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadService();
    }, [serviceId]);

    const loadService = async () => {
        try {
            const response = await serviceService.getById(serviceId);
            setService(response);
        } catch (error) {
            Alert.alert('Error', 'Failed to load service details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            setShowDatePicker(false);
        }
    };

    const handleTimeChange = (selectedTime) => {
        if (selectedTime) {
            setTime(selectedTime);
            setShowTimePicker(false);
        }
    };

    const DatePickerModal = () => {
        const [tempDate, setTempDate] = useState(date);
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 60 }, (_, i) => i);

        return (
            <Modal transparent visible={showDatePicker}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <View style={styles.dateInputs}>
                            <TextInput
                                style={styles.dateInput}
                                placeholder="MM"
                                keyboardType="numeric"
                                maxLength={2}
                                defaultValue={String(tempDate.getMonth() + 1).padStart(2, '0')}
                            />
                            <Text style={styles.dateSeparator}>/</Text>
                            <TextInput
                                style={styles.dateInput}
                                placeholder="DD"
                                keyboardType="numeric"
                                maxLength={2}
                                defaultValue={String(tempDate.getDate()).padStart(2, '0')}
                            />
                            <Text style={styles.dateSeparator}>/</Text>
                            <TextInput
                                style={styles.dateInput}
                                placeholder="YYYY"
                                keyboardType="numeric"
                                maxLength={4}
                                defaultValue={String(tempDate.getFullYear())}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelModalButton]}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.cancelModalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmModalButton]}
                                onPress={() => handleDateChange(tempDate)}
                            >
                                <Text style={styles.confirmModalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const TimePickerModal = () => {
        const [tempHour, setTempHour] = useState(time.getHours());
        const [tempMinute, setTempMinute] = useState(time.getMinutes());

        return (
            <Modal transparent visible={showTimePicker}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Time</Text>
                        <View style={styles.timeInputs}>
                            <TextInput
                                style={styles.timeInput}
                                placeholder="HH"
                                keyboardType="numeric"
                                maxLength={2}
                                value={String(tempHour).padStart(2, '0')}
                                onChangeText={(text) => {
                                    const hour = parseInt(text) || 0;
                    <DatePickerModal />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Booking Time</Text>
                    <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Clock size={20} color="#1e40af" />
                        <Text style={styles.dateTimeText}>{time.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    <TimePickerModal />          }}
                            >
                                <Text style={styles.confirmModalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    const handleBooking = async () => {
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter your address');
            return;
        }

        setSubmitting(true);
        try {
            const bookingData = {
                serviceId,
                userId: user._id,
                bookingDate: date.toISOString().split('T')[0],
                bookingTime: time.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
                address,
                description,
                totalPrice: service.price,
            };

            await bookingService.create(bookingData);
            Alert.alert('Success', 'Booking created successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('BookingsTab'),
                },
            ]);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create booking';
            Alert.alert('Booking Error', message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !service) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e40af" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Service</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.serviceCard}>
                    <Text style={styles.serviceIcon}>{service.imageIcon || '📦'}</Text>
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.title}</Text>
                        <Text style={styles.servicePrice}>₹{service.price}</Text>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Booking Date</Text>
                    <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color="#1e40af" />
                        <Text style={styles.dateTimeText}>{date.toDateString()}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Booking Time</Text>
                    <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Clock size={20} color="#1e40af" />
                        <Text style={styles.dateTimeText}>{time.toLocaleTimeString()}</Text>
                    </TouchableOpacity>

                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                        />
                    )}
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Service Address</Text>
                    <View style={styles.addressInputWrapper}>
                        <MapPin size={20} color="#64748b" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter service address"
                            placeholderTextColor="#cbd5e1"
                            value={address}
                            onChangeText={setAddress}
                            editable={!submitting}
                            multiline
                        />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Additional Notes (Optional)</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea]}
                        placeholder="Add any special requests..."
                        placeholderTextColor="#cbd5e1"
                        value={description}
                        onChangeText={setDescription}
                        editable={!submitting}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Service</Text>
                        <Text style={styles.summaryValue}>{service.title}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Date</Text>
                        <Text style={styles.summaryValue}>{date.toDateString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Time</Text>
                        <Text style={styles.summaryValue}>{time.toLocaleTimeString()}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryBorder]}>
                        <Text style={styles.summaryLabel}>Total Price</Text>
                        <Text style={styles.totalPrice}>₹{service.price}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.bookButton, submitting && styles.disabledButton]}
                    onPress={handleBooking}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.bookButtonText}>Confirm Booking</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
    },
    content: {
      
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 16,
        textAlign: 'center',
    },
    dateInputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateInput: {
        width: 60,
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    dateSeparator: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginHorizontal: 8,
    },
    timeInputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    timeInput: {
        width: 60,
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    timeSeparator: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginHorizontal: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelModalButton: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cancelModalButtonText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    confirmModalButton: {
        backgroundColor: '#1e40af',
    },
    confirmModalButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },  paddingHorizontal: 16,
        paddingVertical: 20,
    },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    serviceIcon: {
        fontSize: 40,
        marginRight: 12,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e40af',
        marginTop: 4,
    },
    formSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dateTimeText: {
        marginLeft: 10,
        color: '#0f172a',
        fontSize: 14,
    },
    addressInputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    inputIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#0f172a',
        paddingVertical: 10,
    },
    textArea: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    summaryBorder: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 12,
        marginTop: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e40af',
    },
    bookButton: {
        backgroundColor: '#1e40af',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
