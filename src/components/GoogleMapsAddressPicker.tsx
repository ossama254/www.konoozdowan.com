/// <reference types="google.maps" />
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  MapMouseEvent,
  Pin,
  useApiLoadingStatus,
  useMapsLibrary,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { Language } from '../types/store';

interface Coordinates {
  lat: number;
  lng: number;
}

interface AddressSelection {
  lat: number;
  lng: number;
  formattedAddress?: string;
  placeId?: string;
}

interface GoogleMapsAddressPickerProps {
  lang: Language;
  value: Coordinates;
  onSelect: (selection: AddressSelection) => void;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function isQuotaError(err: unknown): boolean {
  const str = String(err ?? '');
  return (
    str.includes('RESOURCE_EXHAUSTED') ||
    str.includes('OVER_QUERY_LIMIT') ||
    str.includes('429') ||
    str.includes('QuotaExceeded')
  );
}

const PlacesSearchAndMap: React.FC<GoogleMapsAddressPickerProps> = ({
  lang,
  value,
  onSelect,
}) => {
  const placesLib = useMapsLibrary('places');
  const loadingStatus = useApiLoadingStatus();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [center, setCenter] = useState<Coordinates>(value);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    setCenter(value);
  }, [value]);

  useEffect(() => {
    if (!placesLib || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          sessionToken: sessionTokenRef.current ?? undefined,
          language: lang,
        });
        setSuggestions(res.suggestions ?? []);
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [placesLib, query, lang]);

  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location'],
        });
        const loc = place.location;
        if (loc) {
          const next = { lat: loc.lat(), lng: loc.lng() };
          setCenter(next);
          onSelect({
            lat: next.lat,
            lng: next.lng,
            formattedAddress: place.formattedAddress ?? place.displayName ?? undefined,
            placeId: place.id,
          });
        }
        setQuery('');
        setSuggestions([]);
        sessionTokenRef.current = null;
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      }
    },
    [onSelect, placesLib]
  );

  const handleMapClick = useCallback(
    (ev: MapMouseEvent) => {
      const latLng = ev.detail.latLng;
      if (!latLng) return;
      onSelect({
        lat: Number(latLng.lat.toFixed(6)),
        lng: Number(latLng.lng.toFixed(6)),
      });
    },
    [onSelect]
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setCenter(next);
        onSelect(next);
      },
      () => {
        // Silently keep current pin if permission denied
      }
    );
  };

  if (loadingStatus === APILoadingStatus.FAILED || loadingStatus === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 border border-[#E5DEC9] text-xs text-[#1F2937]/80 space-y-2">
        <p className="font-semibold">
          {lang === 'ar'
            ? 'تعذر تحميل خريطة جوجل التفاعلية، يمكنك إدخال العنوان يدوياً أدناه.'
            : 'Interactive map could not load. Please enter your street address manually below.'}
        </p>
        <p className="tabular-nums text-[#1F2937]/60">
          Lat: {value.lat.toFixed(4)} · Lng: {value.lng.toFixed(4)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Autocomplete Search + Current GPS */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1F2937]/45 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'ابحث عن الحي أو الشارع عبر خرائط Google...'
                : 'Search neighborhood or street via Google Places...'
            }
            className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-xl bg-[#FFFBEB] border border-[#E5DEC9] text-sm focus:outline-none focus:border-[#D97706]"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-30 start-0 end-0 mt-1.5 rounded-xl bg-white border border-[#E5DEC9] shadow-lg max-h-56 overflow-y-auto divide-y divide-[#E5DEC9]/60">
              {suggestions.map((s, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-start px-3.5 py-2.5 text-xs sm:text-sm hover:bg-amber-50 flex items-center gap-2 text-[#1F2937]"
                  >
                    <MapPin className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span className="truncate">{s.placePrediction?.text.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {isSearching && (
            <span className="text-[11px] text-[#1F2937]/55 mt-1 block">
              {lang === 'ar' ? 'جارٍ البحث...' : 'Searching...'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          className="min-h-[44px] px-4 rounded-xl border border-[#E5DEC9] bg-white hover:bg-amber-50 text-xs font-semibold text-[#1F2937] inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
        >
          <LocateFixed className="w-4 h-4 text-[#D97706]" />
          <span>{lang === 'ar' ? 'موقعي الحالي' : 'Use My Location'}</span>
        </button>
      </div>

      {/* Interactive Google Map */}
      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-[#E5DEC9] relative">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          center={center}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <AdvancedMarker position={value} title={lang === 'ar' ? 'موقع التوصيل' : 'Delivery Pin'}>
            <Pin background="#D97706" borderColor="#92400E" glyphColor="#FFFBEB" />
          </AdvancedMarker>
        </GoogleMap>
      </div>

      <div className="flex items-center justify-between text-xs text-[#1F2937]/65">
        <span>
          {lang === 'ar'
            ? 'انقر على الخريطة لتحديد نقطة التوصيل بدقة'
            : 'Tap anywhere on the map to adjust your delivery pin'}
        </span>
        <span className="tabular-nums font-mono-code">
          {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
};

export const GoogleMapsAddressPicker: React.FC<GoogleMapsAddressPickerProps> = (props) => {
  if (!MAPS_API_KEY) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#E5DEC9] space-y-2 text-xs text-[#1F2937]/80">
        <div className="font-semibold flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#D97706]" />
          <span>
            {props.lang === 'ar'
              ? 'محدد الموقع الجغرافي للتوصيل'
              : 'Delivery Coordinate Pin'}
          </span>
        </div>
        <p className="tabular-nums text-[#1F2937]/65">
          {props.value.lat.toFixed(4)}, {props.value.lng.toFixed(4)}
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={MAPS_API_KEY} language={props.lang} region="SA" libraries={['places', 'marker']}>
      <PlacesSearchAndMap {...props} />
    </APIProvider>
  );
};
