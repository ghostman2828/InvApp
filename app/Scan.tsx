import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, Dimensions, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [zoom, setZoom] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [currentItem, setCurrentItem] = useState<{barcode: string, quantity: number} | null>(null);
  const [labelData, setLabelData] = useState<{name: string, price: string}>({name: '', price: ''});
  const [screen, setScreen] = useState<'scan' | 'quantity' | 'label'>('scan');

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
      // In a real app, you would fetch this data from your database
      const mockQuantity = Math.floor(Math.random() * 100) + 1; // Random quantity for demo
      setCurrentItem({
        barcode: scanningResult.data,
        quantity: mockQuantity
      });
      setScreen('quantity');
    }
  };

  const handlePrintLabel = () => {
    setScreen('label');
  };

  const handleLabelSubmit = () => {
    // Here you would typically send the label data to your printer
    Alert.alert(
      "Label Printed",
      `Name: ${labelData.name}\nPrice: ${labelData.price}\nBarcode: ${currentItem?.barcode}`,
      [{ text: "OK", onPress: () => {
        setScanned(false);
        setScreen('scan');
        setLabelData({name: '', price: ''});
      }}]
    );
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

  if (screen === 'quantity') {
    return (
      <View style={styles.container}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityTitle}>Scanned Item</Text>
          <Text style={styles.barcodeText}>Barcode: {currentItem?.barcode}</Text>
          <Text style={styles.quantityText}>Current Quantity: {currentItem?.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.printButton}
            onPress={handlePrintLabel}
          >
            <Text style={styles.printButtonText}>Print Label</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setScanned(false);
              setScreen('scan');
            }}
          >
            <Text style={styles.backButtonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'label') {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.labelTitle}>Create New Label</Text>
          <Text style={styles.barcodeText}>Barcode: {currentItem?.barcode}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Item Name:</Text>
            <TextInput
              style={styles.input}
              value={labelData.name}
              onChangeText={(text) => setLabelData({...labelData, name: text})}
              placeholder="Enter item name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price:</Text>
            <TextInput
              style={styles.input}
              value={labelData.price}
              onChangeText={(text) => setLabelData({...labelData, price: text})}
              placeholder="Enter price"
              keyboardType="decimal-pad"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleLabelSubmit}
          >
            <Text style={styles.submitButtonText}>Print Label</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setScreen('quantity')}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
          barcodeTypes: ['ean13', 'upc_a', 'code128', 'qr']
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
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
  quantityContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  quantityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  barcodeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  quantityText: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    fontWeight: 'bold',
  },
  printButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  printButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  labelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});