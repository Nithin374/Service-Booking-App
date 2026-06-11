import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services';
import { ArrowLeft, FileText } from 'lucide-react-native';

export default function PartnerApplicationScreen({ navigation }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        serviceCategory: '',
        experience: '',
        bio: '',
        phone: user?.phone || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const serviceCategories = [
        'Air Conditioner',
        'Beauty Salon',
        'Refrigerator',
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Painting',
        'Cleaning',
        'Pest Control',
        'Others',
    ];

    const handleSubmit = async () => {
        if (!formData.serviceCategory || !formData.experience || !formData.bio || !formData.phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setSubmitting(true);
        try {
            const applicationData = {
                userId: user._id,
                serviceCategory: formData.serviceCategory,
                experience: parseInt(formData.experience),
                bio: formData.bio,
                phone: formData.phone,
                status: 'pending',
            };

            await applicationService.create(applicationData);
            Alert.alert('Success', 'Application submitted successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit application';
            Alert.alert('Error', message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Partner Application</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Complete Your Application</Text>
                    <Text style={styles.infoText}>
                        Fill out the form below to apply as a service partner. Your application will be
                        reviewed and you'll be notified within 2-3 business days.
                    </Text>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Service Category *</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={formData.serviceCategory}
                            onValueChange={(value) =>
                                setFormData({ ...formData, serviceCategory: value })
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a category" value="" />
                            {serviceCategories.map((cat) => (
                                <Picker.Item key={cat} label={cat} value={cat} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Years of Experience *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 5"
                        placeholderTextColor="#cbd5e1"
                        keyboardType="numeric"
                        value={formData.experience}
                        onChangeText={(value) => setFormData({ ...formData, experience: value })}
                        editable={!submitting}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter mobile number"
                        placeholderTextColor="#cbd5e1"
                        keyboardType="phone-pad"
                        value={formData.phone}
                        onChangeText={(value) => setFormData({ ...formData, phone: value })}
                        editable={!submitting}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>About You / Bio *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell us about your experience and why you want to be a partner..."
                        placeholderTextColor="#cbd5e1"
                        value={formData.bio}
                        onChangeText={(value) => setFormData({ ...formData, bio: value })}
                        editable={!submitting}
                        multiline
                        numberOfLines={5}
                    />
                </View>

                <View style={styles.termsBox}>
                    <FileText size={20} color="#1e40af" />
                    <Text style={styles.termsText}>
                        By submitting this application, you agree to our Partner Terms and Conditions
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Application</Text>
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
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#1e40af',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 20,
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
    pickerWrapper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    picker: {
        color: '#0f172a',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: '#0f172a',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    termsBox: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    termsText: {
        marginLeft: 12,
        flex: 1,
        fontSize: 13,
        color: '#1e3a8a',
        lineHeight: 20,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#1e40af',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
