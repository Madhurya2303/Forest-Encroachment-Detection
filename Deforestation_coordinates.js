// Define districts encompassing Nallamala Forest with accurate geometries
var districts = {
  "Prakasam District": ee.Geometry.Polygon([[79.0, 15.0], [79.5, 15.0], [79.5, 15.8], [79.0, 15.8]]),
  "Kurnool District": ee.Geometry.Polygon([[77.5, 15.3], [78.5, 15.3], [78.5, 16.3], [77.5, 16.3]]),
  "Kadapa (YSR) District": ee.Geometry.Polygon([[78.0, 14.5], [79.0, 14.5], [79.0, 15.4], [78.0, 15.4]]),
  "Guntur District": ee.Geometry.Polygon([[79.8, 15.8], [80.7, 15.8], [80.7, 16.6], [79.8, 16.6]]),
  "Nandyal District": ee.Geometry.Polygon([[78.0, 15.0], [78.8, 15.0], [78.8, 15.8], [78.0, 15.8]])
};

// Load Hansen Global Forest Change dataset as a forest mask
var forestMaskDataset = ee.Image('UMD/hansen/global_forest_change_2018_v1_6')
  .select('treecover2000')
  .gt(30);  // >30% tree cover considered forest

// Function to mask clouds and shadows
function maskL8sr(image) {
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  var qa = image.select('QA_PIXEL');
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
               .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
}

// Function to calculate NDVI
function addIndices(image) {
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  return image.addBands(ndvi).updateMask(forestMaskDataset);  // Apply forest mask
}

// Function for forest monitoring
function monitorForestChanges(pastDays, analysisType, districtGeometry) {
  var endDate = ee.Date(Date.now());
  var startDate = endDate.advance(-pastDays, 'day');

  var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
                    .filterDate(startDate, endDate)
                    .filterBounds(districtGeometry)
                    .map(maskL8sr)
                    .map(addIndices);

  var ndvi = collection.select('NDVI').median().clip(districtGeometry);
 
  // Thresholds for deforestation
  var deforestationMask = ndvi.lt(0);  // NDVI < 0 for deforestation

  // Visualization parameters
  var deforestationVisParams = {palette: ['#ff0000']};  // Red for deforestation
  var forestMaskVisParams = {palette: ['#d3d3d3'], opacity: 0.5};  // Transparent grey for forest areas

  if (analysisType === 'Deforestation') {
    var deforestationAreaValue = deforestationMask.multiply(ee.Image.pixelArea()).reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: districtGeometry,
      scale: 30,
      maxPixels: 1e13
    }).get('NDVI');

    print('Deforestation Area (kha):', ee.Number(deforestationAreaValue).divide(10000)); // Convert to hectares

    // Create a feature collection from deforestation mask
    var deforestedAreas = deforestationMask.selfMask().reduceToVectors({
      geometry: districtGeometry,
      geometryType: 'polygon',
      reducer: ee.Reducer.countEvery(),
      scale: 30
    });

    // Print coordinates of deforested areas
    deforestedAreas.evaluate(function(fc) {
      if (fc && fc.features.length > 0) {
        var coordinates = fc.features.map(function(feature) {
          return feature.geometry.coordinates;
        });
        print('Coordinates of Deforested Areas:', coordinates);
      } else {
        print('No deforested areas detected.');
      }
    });

    // Visualization
    Map.clear();
    Map.addLayer(forestMaskDataset.updateMask(forestMaskDataset), forestMaskVisParams, 'Forest Mask');
    Map.addLayer(deforestationMask, deforestationVisParams, 'Deforestation Areas');
    Map.addLayer(ee.FeatureCollection([ee.Feature(districtGeometry)]),
                 {color: '#2F2F2F', strokeWidth: 2},  // Light black outline
                 'Selected District Boundary');
  }
}

// UI elements for input and analysis buttons
var pastDaysInput = ui.Textbox({
  placeholder: 'Enter number of past days (e.g., 30)',
  value: '30'
});

// District dropdown
var districtSelect = ui.Select({
  items: Object.keys(districts),
  placeholder: 'Select a district'
});

var deforestationButton = ui.Button({
  label: 'Check Deforestation Area (kha)',
  onClick: function() {
    var pastDays = parseInt(pastDaysInput.getValue(), 10);
    var selectedDistrict = districtSelect.getValue();
    if (selectedDistrict) {
      var districtGeometry = districts[selectedDistrict];
      monitorForestChanges(pastDays, 'Deforestation', districtGeometry);
    } else {
      print('Please select a district.');
    }
  }
});

// UI panel setup
var panel = ui.Panel({
  widgets: [
    ui.Label('Real-time Forest Monitoring Tool'),
    ui.Label('Monitor Changes for the Past N Days:'), pastDaysInput,
    districtSelect,
    deforestationButton
  ]
});

Map.add(panel);
