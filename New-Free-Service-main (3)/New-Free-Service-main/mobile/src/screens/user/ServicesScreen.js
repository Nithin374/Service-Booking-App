import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    TextInput,
    RefreshControl,
    Alert,
} from 'react-native';
import { serviceService } from '../../services';
import { Search } from 'lucide-react-native';

export default function ServicesScreen({ navigation }) {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [searchQuery, selectedCategory, services]);

    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await serviceService.getAll();
            const servicesArray = Array.isArray(response) ? response : response.services || [];
            setServices(servicesArray);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(servicesArray.map((s) => s.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading services:', error);
            Alert.alert('Error', 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadServices();
        setRefreshing(false);
    };

    const filterServices = () => {
        let filtered = services;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter((s) => s.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (s) =>
                    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredServices(filtered);
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
                <Text style={styles.serviceDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.serviceFooter}>
                    <Text style={styles.servicePrice}>₹{item.price}</Text>
                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => navigation.navigate('Booking', { serviceId: item._id })}
                    >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1e40af" />
                </View>
            ) : (
                <>
                    <View style={styles.searchSection}>
                        <View style={styles.searchBox}>
                            <Search size={20} color="#64748b" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search services..."
                                placeholderTextColor="#cbd5e1"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    <FlatList
                        data={categories}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === item && styles.categoryChipActive,
                                ]}
                                onPress={() => setSelectedCategory(item)}
                            >
                                <Text
                                    style={[
                                        styles.categoryChipText,
                                        selectedCategory === item && styles.categoryChipTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    />

                    <FlatList
                        data={filteredServices}
                        renderItem={({ item }) => <ServiceCard item={item} />}
                        keyExtractor={(item) => item._id}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No services found</Text>
                            </View>
                        }
                    />
                </>
            )}
        </View>
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
    searchSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 8,
        fontSize: 14,
        color: '#0f172a',
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryChipActive: {
        backgroundColor: '#1e40af',
        borderColor: '#1e40af',
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    categoryChipTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    serviceIcon: {
        fontSize: 36,
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
    serviceFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e40af',
    },
    bookButton: {
        backgroundColor: '#1e40af',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#94a3b8',
    },
});
