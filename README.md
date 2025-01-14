# Real-Time Forest Encroachment Detection System 🌳  

The **Real-Time Forest Encroachment Detection System** is a remote sensing solution for detecting and monitoring forest cover loss in the **Nallamala Forest region**. Using the Hansen Global Forest Change dataset,Landsat satellite imagery and NDVI metrics, forest cover loss across **Prakasam, Kurnool, Kadapa, Guntur, and Nandyal** districts was quantified at a resolution of 30 meters.


## Key Features  
- **High-Resolution Monitoring**: Detect forest loss with 30-meter resolution using Landsat data.  
- **NDVI Metrics**: Utilize Normalized Difference Vegetation Index to analyze vegetation health.  
- **Deforestation Analysis**: Quantify forest loss in specific districts like Prakasam, Kurnool, Kadapa, Guntur, and Nandyal.  
- **Real-Time Detection**: Automates forest change monitoring for timely conservation interventions.  
- **Interactive Visualization**: Generate spatial maps highlighting deforested hotspots.


## How It Works  
1. **Forest Masking**: Uses the Hansen Global Forest Change dataset to identify regions with >30% tree cover.  
2. **Cloud Masking**: Eliminates clouds and shadows for accurate analysis.  
3. **NDVI Calculation**: Applies NDVI metrics to detect vegetation loss.  
4. **Deforestation Threshold**: Identifies deforested regions where NDVI values fall below zero.  
5. **Spatial Outputs**: Provides deforested area estimates and coordinates for affected regions.  


## Technologies Used  
- **Google Earth Engine (GEE)**  
- **Landsat 8 Satellite Data**  
- **Hansen Global Forest Change Dataset**  
- **NDVI Calculations**  
- **JavaScript**   


## How to Use  
1. Clone this repository and open the project in **Google Earth Engine**.  
2. Input the desired district and analysis period in the user interface.  
3. Run the script to visualize deforested areas and retrieve quantitative data.  

### Example:  
- **Monitor Deforestation in Prakasam for the Last 30 Days**  
  - Select "Prakasam District" from the dropdown.  
  - Input `30` in the "Past Days" field.  
  - Click "Check Deforestation Area (kha)" to view results.  


## Output  
- **Deforestation Maps**: Highlight deforested areas in red.  
- **Quantitative Estimates**: Displays deforested area in hectares.  
- **Coordinates**: Lists spatial locations of affected regions.  


## License  
This project is licensed under the GNU General Public License - see the [LICENSE](https://github.com/Madhurya2303/Forest-Encroachment-Detection/blob/main/LICENSE) file for details.


## Acknowledgments  
- **Google Earth Engine**: Provided a cloud-based platform for geospatial analysis.
- **Hansen Global Forest Change**: For comprehensive forest cover change dataand.
- **Landsat Mission**: High-resolution satellite imagery essential for vegetation monitoring and NDVI calculations.
