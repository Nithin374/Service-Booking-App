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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import { User, Mail, Phone, MapPin, LogOut, Save } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await userService.updateProfile(formData);
            setEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
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

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'User'}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Profile Information</Text>
                        {!editing && (
                            <TouchableOpacity onPress={() => setEditing(true)}>
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {editing ? (
                        <View style={styles.formFields}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputWrapper}>
                                    <User size={18} color="#64748b" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Full Name"
                                        placeholderTextColor="#cbd5e1"
                                        value={formData.name}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, name: text })
                                        }
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <Mail size={18} color="#64748b" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#cbd5e1"
                                        keyboardType="email-address"
                                        value={formData.email}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, email: text })
                                        }
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone</Text>
                                <View style={styles.inputWrapper}>
                                    <Phone size={18} color="#64748b" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number"
                                        placeholderTextColor="#cbd5e1"
                                        keyboardType="phone-pad"
                                        value={formData.phone}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, phone: text })
                                        }
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <View style={styles.inputWrapper}>
                                    <MapPin size={18} color="#64748b" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Address"
                                        placeholderTextColor="#cbd5e1"
                                        value={formData.address}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, address: text })
                                        }
                                        editable={!loading}
                                        multiline
                                    />
                                </View>
                            </View>

                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                    style={[styles.saveButton, loading && styles.disabledButton]}
                                    onPress={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Save size={18} color="#fff" />
                                            <Text style={styles.saveButtonText}>Save Changes</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setEditing(false)}
                                    disabled={loading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.infoFields}>
                            <View style={styles.infoField}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{user?.email}</Text>
                            </View>
                            <View style={styles.infoField}>
                                <Text style={styles.infoLabel}>Phone</Text>
                                <Text style={styles.infoValue}>{user?.phone || 'Not added'}</Text>
                            </View>
                            <View style={styles.infoField}>
                                <Text style={styles.infoLabel}>Address</Text>
                                <Text style={styles.infoValue}>{user?.address || 'Not added'}</Text>
                            </View>
                            <View style={styles.infoField}>
                                <Text style={styles.infoLabel}>Role</Text>
                                <Text style={styles.infoValue}>
                                    {user?.role === 'admin' ? 'Administrator' : 'Service User'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color="#ef4444" />
                    <Text style={styles.logoutButtonText}>Logout</Text>
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
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1e40af',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    role: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    editButton: {
        color: '#1e40af',
        fontSize: 14,
        fontWeight: '600',
    },
    formFields: {
        gap: 16,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        minHeight: 48,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#0f172a',
    },
    infoFields: {
        gap: 16,
    },
    infoField: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    infoLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '600',
    },
    buttonGroup: {
        marginTop: 16,
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#1e40af',
        flexDirection: 'row',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fee2e2',
        gap: 10,
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
});
