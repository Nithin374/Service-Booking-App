import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ExpertJobsScreen({ navigation }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadJobs();
    });
    return unsubscribe;
  }, [navigation]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const filteredJobs = response.data.filter(
        (job) => job.employeeId?._id === user._id
      );
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const markWorkFinished = async (bookingId) => {
    try {
      await api.put(
        `/bookings/${bookingId}/employee-finished`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      Alert.alert('Success', 'Work marked as finished!');
      loadJobs();
    } catch (error) {
      Alert.alert('Error', 'Failed to mark work as finished');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b';
      case 'Confirmed':
        return '#3b82f6';
      case 'Completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'active') return job.status === 'Confirmed' && !job.employeeFinished;
    if (filter === 'completed') return job.status === 'Completed';
    return true;
  });

  const stats = {
    pending: jobs.filter((j) => j.status === 'Pending').length,
    active: jobs.filter((j) => j.status === 'Confirmed' && !j.employeeFinished).length,
    completed: jobs.filter((j) => j.status === 'Completed').length,
  };

  const JobCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.jobId}>#{item._id?.slice(-6)?.toUpperCase()}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.serviceName}>{item.serviceId?.title}</Text>
      <Text style={styles.customerName}>👤 {item.userId?.name}</Text>
      <Text style={styles.phone}>📞 {item.userId?.email}</Text>

      <View style={styles.details}>
        <Text style={styles.detailText}>📍 {item.location}</Text>
        <Text style={styles.detailText}>
          📅 {new Date(item.appointmentDate).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>💰 ₹{item.totalAmount}</Text>
      </View>

      <Text style={styles.addressText}>Address: {item.userAddress}</Text>

      {item.status === 'Confirmed' && !item.employeeFinished && (
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={() =>
            Alert.alert(
              'Mark as Finished',
              'Have you completed the work?',
              [
                { text: 'No', onPress: () => {} },
                {
                  text: 'Yes',
                  onPress: () => markWorkFinished(item._id),
                },
              ]
            )
          }
        >
          <Text style={styles.finishBtnText}>✓ Mark Work Finished</Text>
        </TouchableOpacity>
      )}

      {item.employeeFinished && item.status !== 'Completed' && (
        <View style={styles.waitingBox}>
          <Text style={styles.waitingText}>⏳ Waiting for customer confirmation...</Text>
        </View>
      )}

      {item.status === 'Completed' && (
        <View style={styles.completedBox}>
          <Text style={styles.completedText}>✅ Work completed and confirmed!</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Jobs</Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              filter === f && styles.filterBtnActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterBtnText,
                filter === f && styles.filterBtnTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No jobs in this category</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <JobCard item={item} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterBtn: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterBtnActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 12,
  },
  card: {
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
    alignItems: 'center',
    marginBottom: 12,
  },
  jobId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  customerName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  finishBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  waitingBox: {
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  waitingText: {
    color: '#1e40af',
    fontSize: 13,
    fontWeight: '500',
  },
  completedBox: {
    backgroundColor: '#dcfce7',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  completedText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
