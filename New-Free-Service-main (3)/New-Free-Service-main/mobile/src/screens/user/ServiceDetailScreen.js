import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { serviceService } from '../../services';
import { ArrowLeft, Star } from 'lucide-react-native';

export default function ServiceDetailScreen({ navigation, route }) {
    const { serviceId } = route.params;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadService();
    }, [serviceId]);

    const loadService = async () => {
        try {
            setLoading(true);
            const response = await serviceService.getById(serviceId);
            setService(response);
        } catch (error) {
            console.error('Error loading service:', error);
            Alert.alert('Error', 'Failed to load service details');
            navigation.goBack();
        } finally {
            setLoading(false);
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
                <Text style={styles.headerTitle}>Service Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{service.imageIcon || '📦'}</Text>
                </View>

                <Text style={styles.serviceName}>{service.title}</Text>
                <Text style={styles.category}>{service.category}</Text>

                <View style={styles.ratingContainer}>
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                color={i < 4 ? '#fbbf24' : '#e2e8f0'}
                                fill={i < 4 ? '#fbbf24' : 'transparent'}
                            />
                        ))}
                    <Text style={styles.ratingText}>(4.0 / 5)</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>₹{service.price}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{service.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What's Included</Text>
                    <View style={styles.featureList}>
                        <Text style={styles.feature}>✓ Professional service</Text>
                        <Text style={styles.feature}>✓ Guaranteed satisfaction</Text>
                        <Text style={styles.feature}>✓ Quick response time</Text>
                        <Text style={styles.feature}>✓ Expert technician</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <View style={styles.availabilityGrid}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <View key={day} style={styles.dayBadge}>
                                <Text style={styles.dayText}>{day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('Booking', { serviceId })}
                >
                    <Text style={styles.bookButtonText}>Book This Service</Text>
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
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    icon: {
        fontSize: 48,
    },
    serviceName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        textAlign: 'center',
    },
    category: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    ratingText: {
        marginLeft: 8,
        color: '#64748b',
        fontSize: 14,
    },
    priceContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    featureList: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    feature: {
        fontSize: 14,
        color: '#0f172a',
        marginVertical: 6,
        fontWeight: '500',
    },
    availabilityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayBadge: {
        flex: '0 0 30%',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dayText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e40af',
    },
    bookButton: {
        backgroundColor: '#1e40af',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
