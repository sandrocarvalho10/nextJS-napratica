import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import ReactLeafletKml from 'react-leaflet-kml';
// import kml from './../../../public/assets/localizacao_HVEX.kml';

export type MapProps = {
  places?: Place[];
};

type Place = {
  id: string;
  name: string;
  slug: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
const MAPBOX_USERID = process.env.NEXT_PUBLIC_MAPBOX_USER_ID;
const MAPBOX_STYLEID = process.env.NEXT_PUBLIC_MAPBOX_STYLE_ID;

const CustomTileLayer = () => {
  return MAPBOX_API_KEY ? (
    <TileLayer
      attribution='&copy; <a href="https://apps.mapbox.com/feedback/">Mapbox</a> &copy;<a href="http://osm.org/copyright">OpenStreetMap</a>'
      url={`https://api.mapbox.com/styles/v1/${MAPBOX_USERID}/${MAPBOX_STYLEID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`}
    />
  ) : (
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
};

const Map = ({ places }: MapProps) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [kmlfile, setKmlFile] = useState<any | null>(null);

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/aviklai/react-leaflet-kml/master/src/assets/example1.kml'
    )
      .then((res) => res.text())
      .then((kmlText) => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        setKmlFile(kml);
      });
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      style={{ height: '100%', width: '100%' }}
    >
      <CustomTileLayer />
      {kmlfile && <ReactLeafletKml kml={kmlfile} />}
      {places?.map(({ id, slug, name, location }) => {
        const { latitude, longitude } = location;

        return (
          <Marker
            key={`place-${id}`}
            position={[latitude, longitude]}
            title={name}
            eventHandlers={{
              click: () => {
                router.push(`/place/${slug}`);
              }
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default Map;
