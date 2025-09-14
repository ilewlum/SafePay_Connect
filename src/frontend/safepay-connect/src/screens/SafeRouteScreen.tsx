import React, { useState } from 'react';
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView, TextInput,
  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SafeRouteScreen = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const safeLocations = [
    {
      id: 1,
      name: 'Standard Bank ATM - V&A Waterfront',
      type: 'atm',
      distance: '1.2 km',
      safetyScore: 95,
      features: ['24/7 Security', 'Well-lit', 'Indoor'],
      address: 'V&A Waterfront, Cape Town',
    },
    {
      id: 2,
      name: 'FNB ATM - Canal Walk',
      type: 'atm',
      distance: '2.5 km',
      safetyScore: 92,
      features: ['Mall Security', 'Indoor', 'CCTV'],
      address: 'Canal Walk Shopping Centre',
    },
    {
      id: 3,
      name: 'Shoprite Money Market',
      type: 'retailer',
      distance: '0.8 km',
      safetyScore: 88,
      features: ['In-store', 'Staff Present', 'CCTV'],
      address: 'Gardens Centre, Cape Town',
    },
    {
      id: 4,
      name: 'Pick n Pay Money Transfer',
      type: 'retailer',
      distance: '1.5 km',
      safetyScore: 85,
      features: ['In-store', 'Security Guard'],
      address: 'Cavendish Square',
    },
    {
      id: 5,
      name: 'Capitec Bank Branch',
      type: 'bank',
      distance: '3.0 km',
      safetyScore: 90,
      features: ['Bank Security', 'Indoor', 'Staff'],
      address: 'Claremont Main Road',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'atm', label: 'ATMs', icon: 'card' },
    { id: 'bank', label: 'Banks', icon: 'business' },
    { id: 'retailer', label: 'Retailers', icon: 'cart' },
  ];

  const filteredLocations = selectedFilter === 'all' 
    ? safeLocations 
    : safeLocations.filter(loc => loc.type === selectedFilter);

  const getSafetyColor = (score: number) => {
    if (score >= 90) return '#51CF66';
    if (score >= 75) return '#FFB84D';
    return '#FF6B6B';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'atm': return 'card';
      case 'bank': return 'business';
      case 'retailer': return 'cart';
      default: return 'location';
    }
  };

  const navigateToLocation = (location: any) => {
    Alert.alert(
      'Navigate to Location',
      `Open maps to navigate to ${location.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Navigate', 
          onPress: () => Alert.alert('Navigation', 'Opening maps application...')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="map" size={40} color="#96CEB4" />
          <Text style={styles.title}>SafeRoute Finance</Text>
          <Text style={styles.subtitle}>Find safe ATMs and banking locations</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#636E72" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search area or location..."
              value={searchLocation}
              onChangeText={setSearchLocation}
              placeholderTextColor="#A0A0A0"
            />
            <TouchableOpacity>
              <Ionicons name="location" size={20} color="#96CEB4" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={selectedFilter === filter.id ? 'white' : '#636E72'}
                />
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={100} color="#96CEB4" />
          <Text style={styles.mapText}>Interactive Map View</Text>
          <Text style={styles.mapSubtext}>Tap a location below to view on map</Text>
        </View>

        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Safe Locations Near You</Text>
          
          {filteredLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationCard}
              onPress={() => navigateToLocation(location)}
            >
              <View style={styles.locationHeader}>
                <View style={[styles.typeIcon, { backgroundColor: getSafetyColor(location.safetyScore) + '20' }]}>
                  <Ionicons
                    name={getTypeIcon(location.type) as any}
                    size={24}
                    color={getSafetyColor(location.safetyScore)}
                  />
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Text style={styles.distance}>{location.distance}</Text>
                  <Ionicons name="navigate" size={16} color="#96CEB4" />
                </View>
              </View>
              
              <View style={styles.safetyContainer}>
                <View style={styles.safetyScore}>
                  <Text style={styles.safetyLabel}>Safety Score</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreText, { color: getSafetyColor(location.safetyScore) }]}>
                      {location.safetyScore}%
                    </Text>
                    <View style={styles.scoreBar}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${location.safetyScore}%`,
                            backgroundColor: getSafetyColor(location.safetyScore)
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.featuresContainer}>
                {location.features.map((feature, index) => (
                  <View key={index} style={styles.featureBadge}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="time" size={20} color="#96CEB4" />
            <Text style={styles.tipText}>Use ATMs during daylight hours when possible</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="people" size={20} color="#96CEB4" />
            <Text style={styles.tipText}>Choose locations with security personnel present</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="eye" size={20} color="#96CEB4" />
            <Text style={styles.tipText}>Be aware of your surroundings before withdrawing</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={20} color="#96CEB4" />
            <Text style={styles.tipText}>Shield your PIN and count money discreetly</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#96CEB4',
    borderColor: '#96CEB4',
  },
  filterText: {
    fontSize: 14,
    color: '#636E72',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  mapPlaceholder: {
    marginHorizontal: 20,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapText: {
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
    marginTop: 10,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 4,
  },
  locationsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: '#636E72',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#96CEB4',
    marginBottom: 2,
  },
  safetyContainer: {
    marginBottom: 12,
  },
  safetyScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureBadge: {
    backgroundColor: '#F0F9F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: '#96CEB4',
  },
  tipsSection: {
    padding: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#636E72',
  },
});

export default SafeRouteScreen;