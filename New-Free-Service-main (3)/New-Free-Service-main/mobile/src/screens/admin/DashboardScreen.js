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
import { applicationService, bookingService, userService } from '../../services';
import { LogOut, Users, FileText, ShoppingCart } from 'lucide-react-native';

export default function DashboardScreen({ navigation }) {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
        pendingApplications: 0,
    });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [applicationsRes, bookingsRes] = await Promise.all([
                applicationService.getAll(),
                bookingService.getAll(),
            ]);

            const appsList = Array.isArray(applicationsRes)
                ? applicationsRes
                : applicationsRes.applications || [];
            const bookingsList = Array.isArray(bookingsRes)
                ? bookingsRes
                : bookingsRes.bookings || [];

            const pendingApps = appsList.filter((app) => app.status === 'pending');

            setApplications(appsList);
            setStats({
                totalUsers: appsList.length + 1,
                totalBookings: bookingsList.length,
                pendingApplications: pendingApps.length,
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
    };

    const handleApproveApplication = async (appId) => {
        Alert.alert('Approve Application', 'Are you sure you want to approve this application?', [
            { text: 'Cancel', onPress: () => {} },
            {
                text: 'Approve',
                onPress: async () => {
                    try {
                        await applicationService.approve(appId);
                        loadDashboardData();
                        Alert.alert('Success', 'Application approved');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to approve application');
                    }
                },
            },
        ]);
    };

    const handleRejectApplication = async (appId) => {
        Alert.alert('Reject Application', 'Are you sure you want to reject this application?', [
            { text: 'Cancel', onPress: () => {} },
            {
                text: 'Reject',
                onPress: async () => {
                    try {
                        await applicationService.reject(appId);
                        loadDashboardData();
                        Alert.alert('Success', 'Application rejected');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to reject application');
                    }
                },
            },
        ]);
    };

    const handleLogout = () => {
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

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
                <Icon size={24} color={color} />
            </View>
            <View style={styles.statContent}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        </View>
    );

    const ApplicationCard = ({ item }) => (
        <View style={styles.applicationCard}>
            <View style={styles.appHeader}>
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>{item.userId}</Text>
                    <Text style={styles.appCategory}>{item.serviceCategory}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#fef3c7' }]}>
                    <Text style={styles.statusBadgeText}>⏳ PENDING</Text>
                </View>
            </View>

            <View style={styles.appDetails}>
                <Text style={styles.detailLabel}>Experience:</Text>
                <Text style={styles.detailValue}>{item.experience} years</Text>
                <Text style={styles.bioLabel} numberOfLines={2}>
                    {item.bio}
                </Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApproveApplication(item._id)}
                >
                    <Text style={styles.approveButtonText}>✓ Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectApplication(item._id)}
                >
                    <Text style={styles.rejectButtonText}>✗ Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e40af" />
            </View>
        );
    }

    const pendingApplications = applications.filter((app) => app.status === 'pending');

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.greeting}>Admin Dashboard</Text>
                    <Text style={styles.subGreeting}>Welcome, {user?.name}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <LogOut size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats.totalUsers.toString()}
                        color="#1e40af"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Total Bookings"
                        value={stats.totalBookings.toString()}
                        color="#10b981"
                    />
                    <StatCard
                        icon={FileText}
                        label="Pending Apps"
                        value={stats.pendingApplications.toString()}
                        color="#f59e0b"
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pending Applications ({pendingApplications.length})</Text>
                    </View>

                    {pendingApplications.length > 0 ? (
                        <FlatList
                            data={pendingApplications}
                            renderItem={({ item }) => <ApplicationCard item={item} />}
                            keyExtractor={(item) => item._id}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <FileText size={48} color="#cbd5e1" />
                            <Text style={styles.emptyText}>No pending applications</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>All Applications</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridValue}>
                                {applications.filter((a) => a.status === 'approved').length}
                            </Text>
                            <Text style={styles.gridLabel}>Approved</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridValue}>
                                {applications.filter((a) => a.status === 'pending').length}
                            </Text>
                            <Text style={styles.gridLabel}>Pending</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.gridValue}>
                                {applications.filter((a) => a.status === 'rejected').length}
                            </Text>
                            <Text style={styles.gridLabel}>Rejected</Text>
                        </View>
                    </View>
                </View>
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
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerContent: {
        flex: 1,
    },
    greeting: {
        fontSize: 22,
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
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    statsContainer: {
        marginBottom: 20,
    },
    statCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
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
    applicationCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    appHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    appInfo: {
        flex: 1,
    },
    appName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    appCategory: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#92400e',
    },
    appDetails: {
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 11,
        color: '#94a3b8',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '500',
        marginBottom: 8,
    },
    bioLabel: {
        fontSize: 12,
        color: '#64748b',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 1,
    },
    approveButton: {
        backgroundColor: '#ecfdf5',
        borderColor: '#10b981',
    },
    approveButtonText: {
        color: '#047857',
        fontSize: 12,
        fontWeight: '600',
    },
    rejectButton: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
    },
    rejectButtonText: {
        color: '#991b1b',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    gridItem: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    gridValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    gridLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
});
