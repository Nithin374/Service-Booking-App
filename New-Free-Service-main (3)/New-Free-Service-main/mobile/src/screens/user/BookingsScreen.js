import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { bookingService } from '../../services';
import { MapPin, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react-native';

export default function BookingsScreen({ navigation }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getAll();
            setBookings(Array.isArray(response) ? response : response.bookings || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            Alert.alert('Error', 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#f59e0b';
            case 'confirmed':
                return '#10b981';
            case 'completed':
                return '#06b6d4';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#64748b';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'confirmed':
                return '✅';
            case 'completed':
                return '🎉';
            case 'cancelled':
                return '❌';
            default:
                return '📋';
        }
    };

    const handleCancelBooking = (bookingId) => {
        Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
            { text: 'No', onPress: () => {} },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        await bookingService.cancel(bookingId);
                        loadBookings();
                        Alert.alert('Success', 'Booking cancelled successfully');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to cancel booking');
                    }
                },
            },
        ]);
    };

    const BookingCard = ({ item }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => {}}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleSection}>
                    <Text style={styles.bookingId}>Booking #{item._id?.slice(-6)}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: `${getStatusColor(item.status)}20` },
                        ]}
                    >
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {getStatusIcon(item.status)} {item.status?.toUpperCase()}
                        </Text>
                    </View>
                </View>
                <Text style={styles.price}>₹{item.totalPrice}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detail}>
                    <Clock size={16} color="#64748b" />
                    <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Date & Time</Text>
                        <Text style={styles.detailValue}>
                            {new Date(item.bookingDate).toDateString()} at {item.bookingTime}
                        </Text>
                    </View>
                </View>

                <View style={styles.detail}>
                    <MapPin size={16} color="#64748b" />
                    <View style={styles.detailText}>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue} numberOfLines={1}>
                            {item.address}
                        </Text>
                    </View>
                </View>

                {item.description && (
                    <View style={styles.detail}>
                        <FileText size={16} color="#64748b" />
                        <View style={styles.detailText}>
                            <Text style={styles.detailLabel}>Notes</Text>
                            <Text style={styles.detailValue} numberOfLines={1}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {item.status === 'pending' && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelBooking(item._id)}
                >
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    const filteredBookings = bookings.filter((b) => {
        if (filter === 'All') return true;
        return b.status === filter.toLowerCase();
    });

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, filter === f && styles.filterChipActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e40af" />
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    renderItem={({ item }) => <BookingCard item={item} />}
                    keyExtractor={(item) => item._id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <AlertCircle size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No bookings found</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterChipActive: {
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    filterTextActive: {
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleSection: {
        flex: 1,
    },
    bookingId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e40af',
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
    },
    detailText: {
        flex: 1,
        marginLeft: 10,
    },
    detailLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '500',
    },
    cancelButton: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 12,
        marginTop: 12,
    },
    cancelButtonText: {
        color: '#ef4444',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 12,
    },
});
