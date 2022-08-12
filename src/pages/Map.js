import React, { useCallback, useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import { Grid, Card, CardContent } from '@material-ui/core';
import DrawControl from 'react-mapbox-gl-draw';
import { isEmpty } from 'lodash';
import ReactMapboxGl, { Marker, RotationControl, ZoomControl } from 'react-mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { useDispatch, useSelector } from '../redux/store';
import { onPolygonDraw, onPolygonDelete } from '../redux/slices/chain';

const SATELLITE_STREET_VIEW = 'mapbox://styles/mapbox/satellite-streets-v9';
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoicHJhc2hhbiIsImEiOiJjanN1MHNzeGsyOXM2NDlwZHI4dHQ0YTJjIn0.jR3pSBGSr67V9GMtBtqmcA'
});

// FIX DISPLAY ERROR ON PRODUCTION
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export default function TMap() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const drawRef = useRef();
  const { currentStore } = useSelector((state) => state.chain);
  const dispatch = useDispatch();

  const getLatOrLon = useCallback(
    (index) =>
      getCenterCordinates(
        drawRef.current.draw.getAll().features[0].geometry.coordinates[0].map((cordinates) => cordinates[index])
      ),
    [drawRef]
  );

  useEffect(() => {
    if (currentStore && currentStore.cordinates) {
      const { Latitude, Longitude } = currentStore?.cordinates;
      setLat(Latitude);
      setLon(Longitude);
    }
    // applicable upon selecting a marked polygon on search store modal
    if (!isEmpty(currentStore?.geoCode?.general)) {
      const feature = currentStore.geoCode.general;
      drawRef.current && drawRef.current.draw.set(feature);
      dispatch(onPolygonDraw(feature));
      setLon(getLatOrLon(0));
      setLat(getLatOrLon(1));
    } else {
      // reset features on every new store
      drawRef.current && drawRef.current.draw.set({ type: 'FeatureCollection', features: [] });
    }
  }, [currentStore, dispatch, getLatOrLon]);

  const getCenterCordinates = (cordinates = []) =>
    cordinates.reduce((partialSum, current) => partialSum + current, 0) / cordinates.length;

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Map
              style={SATELLITE_STREET_VIEW || ''}
              containerStyle={{
                height: '85vh',
                width: '97vw'
              }}
              center={[lon, lat]}
              zoom={[15]}
            >
              <Marker coordinates={[lon, lat]} anchor="bottom">
                <img src="/static/bluemarker.png" alt="Blue Marker" />
              </Marker>
              <ZoomControl />
              <RotationControl />
              <DrawControl
                ref={drawRef}
                position="top-left"
                controls={{
                  point: false,
                  line_string: false,
                  polygon: true,
                  trash: true,
                  combine_features: false,
                  uncombine_features: false
                }}
                onDrawCreate={() => {
                  dispatch(onPolygonDraw(drawRef.current.draw.getAll()));
                  setLon(getLatOrLon(0));
                  setLat(getLatOrLon(1));
                }}
                onDrawDelete={() => dispatch(onPolygonDelete())}
                onDrawUpdate={() => {
                  dispatch(onPolygonDraw(drawRef.current.draw.getAll()));
                  setLon(getLatOrLon(0));
                  setLat(getLatOrLon(1));
                }}
              />
            </Map>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
