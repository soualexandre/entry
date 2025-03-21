'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface EventMapProps {
    location: string;
}

export default function EventMap({ location }: EventMapProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

    useEffect(() => {
        // Simulate loading the map and geocoding the location
        const timer = setTimeout(() => {
            // In a real implementation, you would geocode the location string
            // to get actual coordinates using a service like Google Maps Geocoding API

            // For demo purposes, we'll use fixed coordinates
            // These coordinates are for a location in Brazil (Rio de Janeiro)
            setCoordinates({ lat: -22.9068, lng: -43.1729 });
            setIsLoaded(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location]);

    if (!isLoaded) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-muted">
                <div className="animate-pulse text-muted-foreground">Carregando mapa...</div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full bg-slate-200">
            {/* In a real implementation, you would render an actual map here */}
            {/* For example using Google Maps, Mapbox, or Leaflet */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4">
                <div className="bg-primary/90 rounded-full p-3 mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-center">{location}</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                    Latitude: {coordinates.lat.toFixed(4)}, Longitude: {coordinates.lng.toFixed(4)}
                </p>
                <div className="mt-4 text-sm text-center">
                    <p className="text-muted-foreground">Esta é uma visualização simulada do mapa.</p>
                    <p className="text-muted-foreground">Substitua por uma integração real com Google Maps ou outro serviço.</p>
                </div>
            </div>
        </div>
    );
}