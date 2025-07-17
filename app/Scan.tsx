import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [zoom, setZoom] = useState(0);
  const [scanned, setScanned] = useState(false);

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const rectangleWidth = width * 0.8;
  const rectangleHeight = rectangleWidth * 0.6;
  const rectangleBorderWidth = 2;
  const rectangleColor = '#fff';

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 1);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0);
    setZoom(newZoom);
  };

  const handleBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert(
        "Barcode Scanned",
        `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing="back"
        zoom={zoom}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'upc_a', 'code128', 'qr'] // Common barcode types
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        {/* Your existing overlay and controls remain exactly the same */}
        <View style={styles.overlay}>
          <View style={[styles.unfocusedArea, { height: (height - rectangleHeight) / 2 }]} />
          <View style={styles.middleRow}>
            <View style={[styles.unfocusedArea, { width: (width - rectangleWidth) / 2 }]} />
            <View style={[
              styles.rectangle, 
              { 
                width: rectangleWidth, 
                height: rectangleHeight,
                borderColor: rectangleColor,
                borderWidth: rectangleBorderWidth 
              }
            ]}>
              <View style={[styles.corner, styles.topLeftCorner]} />
              <View style={[styles.corner, styles.topRightCorner]} />
              <View style={[styles.corner, styles.bottomLeftCorner]} />
              <View style={[styles.corner, styles.bottomRightCorner]} />
            </View>
            <View style={[styles.unfocusedArea, { width: (width - rectangleWidth) / 2 }]} />
          </View>
          <View style={[styles.unfocusedArea, { height: (height - rectangleHeight) / 2 }]} />
        </View>

        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

// Your existing styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  unfocusedArea: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  rectangle: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: '#fff',
  },
  topLeftCorner: {
    top: -1,
    left: -1,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRightCorner: {
    top: -1,
    right: -1,
    borderLeftWidth: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  bottomLeftCorner: {
    bottom: -1,
    left: -1,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRightCorner: {
    bottom: -1,
    right: -1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});