import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { getMyTickets } from '../services/ticketService';

export default function MapScreen({ navigation }) {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const tickets = await getMyTickets();
            const mapped = tickets.map(t => ({
                id: t.ticketId,
                title: t.title || 'No title',
                latitude: t.latitude ?? 32.2333,
                longitude: t.longitude ?? -7.9500,
                accessNote: t.accessNote || null,
            }));
            setSites(mapped);
        } catch (error) {
            console.error('Failed to load tickets for map:', error);
        } finally {
            setLoading(false);
        }
    };

    const planMyDay = () => {
        const reordered = [...sites].sort((a, b) => a.latitude - b.latitude);
        setSites(reordered);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.planButton} onPress={planMyDay}>
                <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                <Text style={styles.planButtonText}>Plan My Day</Text>
            </TouchableOpacity>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 32.2333,
                    longitude: -7.95,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                }}
            >
                {sites.map((site) => (
                    <Marker
                        key={site.id}
                        coordinate={{ latitude: site.latitude, longitude: site.longitude }}
                        title={site.title}
                    />
                ))}
            </MapView>

            <FlatList
                data={sites}
                keyExtractor={(item) => String(item.id)}
                style={styles.list}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.siteCard}
                        onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
                    >
                        <View style={styles.orderCircle}>
                            <Text style={styles.orderText}>{index + 1}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.siteTitle}>{item.title}</Text>
                            {item.accessNote && (
                                <Text style={styles.accessNote}>Access: {item.accessNote}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7F5' },
    planButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2E7D32',
        margin: 16,
        borderRadius: 12,
        minHeight: 56,
    },
    planButtonText: { color: '#FFFFFF', fontWeight: '700', marginLeft: 8, fontSize: 15 },
    map: { width: '100%', height: 220 },
    list: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    siteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
    },
    orderCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#2E7D32',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    siteTitle: { fontSize: 14, fontWeight: '600', color: '#212121' },
    accessNote: { fontSize: 12, color: '#F9A825', marginTop: 2, fontWeight: '600' },
});