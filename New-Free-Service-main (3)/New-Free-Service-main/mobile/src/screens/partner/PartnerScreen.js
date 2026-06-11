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
import { applicationService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react-native';

export default function PartnerScreen({ navigation }) {
    const { user } = useAuth();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            setLoading(true);
            const response = await applicationService.getAll();
            const userApp = Array.isArray(response)
                ? response.find((app) => app.userId === user._id)
                : response.applications?.find((app) => app.userId === user._id);
            setApplication(userApp || null);
        } catch (error) {
            console.error('Error loading application:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e40af" />
            </View>
        );
    }

    if (application) {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Application</Text>
                </View>

                <View style={styles.content}>
                    <View style={[styles.statusCard, { borderColor: getStatusColor(application.status) }]}>
                        <View style={styles.statusHeader}>
                            {application.status === 'approved' ? (
                                <CheckCircle size={32} color="#10b981" />
                            ) : (
                                <AlertCircle size={32} color="#f59e0b" />
                            )}
                            <View style={styles.statusInfo}>
                                <Text style={styles.statusLabel}>Status</Text>
                                <Text style={[styles.statusValue, { color: getStatusColor(application.status) }]}>
                                    {application.status?.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {application.status === 'approved' && (
                        <View style={styles.successCard}>
                            <Text style={styles.successTitle}>🎉 Welcome to Our Platform!</Text>
                            <Text style={styles.successMessage}>
                                Your partner application has been approved. You can now provide services on our
                                platform. Check the dashboard to start managing your services.
                            </Text>
                        </View>
                    )}

                    {application.status === 'pending' && (
                        <View style={styles.pendingCard}>
                            <Text style={styles.pendingTitle}>⏳ Application Under Review</Text>
                            <Text style={styles.pendingMessage}>
                                Your application is being reviewed. This usually takes 2-3 business days. We'll
                                notify you once we have made a decision.
                            </Text>
                        </View>
                    )}

                    {application.status === 'rejected' && (
                        <View style={styles.rejectedCard}>
                            <Text style={styles.rejectedTitle}>❌ Application Not Approved</Text>
                            <Text style={styles.rejectedMessage}>
                                {application.rejectionReason || 'Unfortunately, your application was not approved.'}
                            </Text>
                            <TouchableOpacity
                                style={styles.reapplyButton}
                                onPress={() => {
                                    setApplication(null);
                                }}
                            >
                                <Text style={styles.reapplyButtonText}>Submit New Application</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>Application Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Service Category</Text>
                            <Text style={styles.detailValue}>{application.serviceCategory}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Experience</Text>
                            <Text style={styles.detailValue}>{application.experience} years</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Applied On</Text>
                            <Text style={styles.detailValue}>
                                {new Date(application.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Become a Partner</Text>
                <Text style={styles.subtitle}>Grow your business with us</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.heroCard}>
                    <Text style={styles.heroIcon}>🤝</Text>
                    <Text style={styles.heroTitle}>Join Our Partner Network</Text>
                    <Text style={styles.heroDescription}>
                        Expand your service reach and grow your business by joining our network of trusted
                        service providers.
                    </Text>
                </View>

                <View style={styles.benefitsCard}>
                    <Text style={styles.benefitsTitle}>Why Partner With Us?</Text>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>📱</Text>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitName}>Easy Booking Management</Text>
                            <Text style={styles.benefitDesc}>Manage all your bookings from one place</Text>
                        </View>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>💰</Text>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitName}>Better Earnings</Text>
                            <Text style={styles.benefitDesc}>
                                Competitive commission rates and quick payouts
                            </Text>
                        </View>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>⭐</Text>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitName}>Build Your Reputation</Text>
                            <Text style={styles.benefitDesc}>Get reviews and build your professional profile</Text>
                        </View>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>🛡️</Text>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitName}>Safe & Secure</Text>
                            <Text style={styles.benefitDesc}>Protected by our platform's safety measures</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.requirementsCard}>
                    <Text style={styles.requirementsTitle}>Requirements</Text>
                    <Text style={styles.requirement}>✓ 18+ years old</Text>
                    <Text style={styles.requirement}>✓ Valid ID proof</Text>
                    <Text style={styles.requirement}>✓ Service area coverage</Text>
                    <Text style={styles.requirement}>✓ Introduction video (optional)</Text>
                </View>

                <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => navigation.navigate('PartnerApplication')}
                >
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                    <ArrowRight size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case 'approved':
            return '#10b981';
        case 'pending':
            return '#f59e0b';
        case 'rejected':
            return '#ef4444';
        default:
            return '#64748b';
    }
};

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
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    // For existing application
    statusCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderWidth: 1,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusInfo: {
        marginLeft: 12,
    },
    statusLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 2,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    successCard: {
        backgroundColor: '#ecfdf5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    successTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#047857',
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 13,
        color: '#065f46',
        lineHeight: 20,
    },
    pendingCard: {
        backgroundColor: '#fffbeb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    pendingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 8,
    },
    pendingMessage: {
        fontSize: 13,
        color: '#78350f',
        lineHeight: 20,
    },
    rejectedCard: {
        backgroundColor: '#fef2f2',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    rejectedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7f1d1d',
        marginBottom: 8,
    },
    rejectedMessage: {
        fontSize: 13,
        color: '#991b1b',
        lineHeight: 20,
        marginBottom: 12,
    },
    reapplyButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    reapplyButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    detailLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: '600',
    },
    // For new partner signup
    heroCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    heroIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroDescription: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
    },
    benefitsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    benefitIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    benefitContent: {
        flex: 1,
    },
    benefitName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0f172a',
    },
    benefitDesc: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    requirementsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 12,
    },
    requirement: {
        fontSize: 13,
        color: '#0f172a',
        marginVertical: 6,
        fontWeight: '500',
    },
    applyButton: {
        backgroundColor: '#1e40af',
        flexDirection: 'row',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
