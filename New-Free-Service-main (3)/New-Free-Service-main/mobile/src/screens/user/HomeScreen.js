import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LogOut, Search } from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/services');
            setServices(Array.isArray(response.data) ? response.data : response.data.services || []);
        } catch (error) {
            console.error('Error loading services:', error);
            Alert.alert('Error', 'Failed to load services: ' + (error.message || 'Network error'));
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadServices();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', onPress: () => {} },
            {
                text: 'Logout',
                onPress: async () => {
                    await logout();
                },
                style: 'destructive',
            },
        ]);
    };

    const ServiceCard = ({ item }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item._id })}
        >
            <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>{item.imageIcon || '📦'}</Text>
            </View>
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.title}</Text>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                <Text style={styles.serviceDescription} numberOfLines={1}>
                    {item.description}
                </Text>
                <Text style={styles.servicePrice}>₹{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Welcome, {user?.name}</Text>
                    <Text style={styles.subGreeting}>Find services you need</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <LogOut size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e40af" />
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => navigation.navigate('Services')}
                    >
                        <Search size={20} color="#64748b" />
                        <Text style={styles.searchText}>Search services...</Text>
                    </TouchableOpacity>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Popular Services</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>

                        {services.length > 0 ? (
                            <FlatList
                                data={services.slice(0, 5)}
                                renderItem={({ item }) => <ServiceCard item={item} />}
                                keyExtractor={(item) => item._id}
                                scrollEnabled={false}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No services available</Text>
                        )}
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Quick Links</Text>
                        <TouchableOpacity
                            style={styles.infoLink}
                            onPress={() => navigation.navigate('BookingsTab')}
                        >
                            <Text style={styles.infoLinkText}>📅 View My Bookings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.infoLink}
                            onPress={() => navigation.navigate('PartnerTab')}
                        >
                            <Text style={styles.infoLinkText}>🤝 Become a Partner</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerContent: {
        flex: 1,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subGreeting: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchText: {
        marginLeft: 10,
        color: '#94a3b8',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
    },
    seeAll: {
        fontSize: 14,
        color: '#1e40af',
        fontWeight: '600',
    },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    serviceIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    serviceIcon: {
        fontSize: 32,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    serviceCategory: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    serviceDescription: {
        fontSize: 13,
        color: '#94a3b8',
        marginTop: 4,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e40af',
        marginTop: 6,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 14,
        paddingVertical: 20,
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
    },
    infoLink: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    infoLinkText: {
        fontSize: 14,
        color: '#1e40af',
        fontWeight: '500',
    },
});
