import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";

@Component({
  selector: 'app-demo-gis-page',
  imports: [CommonModule , AccordionModule ,ButtonModule],
  templateUrl: './demo-gis-page.html',
  styleUrl: './demo-gis-page.css',
})
export class DemoGisPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapViewNode', { static: false }) private mapViewEl!: ElementRef;
  map: Map | null = null;
  mapView: MapView | null = null;
  demoGraphicsLayer: GraphicsLayer = new GraphicsLayer();
  demoVectorTileLayer = new VectorTileLayer({
    url: "https://tiles.arcgis.com/tiles/jSaRWj2TDlcN1zOC/arcgis/rest/services/Thailand_Transportation/VectorTileServer"
  });
  demoFeatureLayer = new FeatureLayer({
    url: "https://services-ap1.arcgis.com/iA7fZQOnjY9D67Zx/ArcGIS/rest/services/OSM_AS_POIs/FeatureServer/0",
    outFields: ["*"],
    popupTemplate: {
      title: "{name}",
      content:
        "<b>Type:</b> {amenity} <br><b>Place:</b> {place} <br>",
    }
  });
  provinceFeatureLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/jSaRWj2TDlcN1zOC/ArcGIS/rest/services/Thailand_Province_Boundaries_view/FeatureServer/1",
    outFields: ["*"]
  });

  csvLayer = new CSVLayer({
    url: "https://raw.githubusercontent.com/jeffprosise/Machine-Learning/refs/heads/master/Data/taxi-fares.csv",
    outFields: ["*"] ,
    latitudeField: "pickup_latitude",
    longitudeField: "pickup_longitude",
    popupTemplate: {
      title: "Taxi Trip",
      content: `
        Fare: {fare_amount} USD<br>
        Passengers: {passenger_count}<br>
        Pickup: {pickup_datetime}
    `
    }
  });

  defaultRenderer:any = null;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    this.map = new Map({
      basemap: 'streets-vector',
    });

    this.mapView = new MapView({
      container,
      map: this.map,
      // center: [100.54461 , 13.6489258], // longitude, latitude
      center: [-73.99542, 40.68555732396443],
      zoom: 15,
    });

    this.map.add(this.demoGraphicsLayer);

    this.mapView.when(() => { });

    return this.mapView.when();
  }

  ngOnDestroy(): void {
    if (this.mapView) {
      this.mapView.destroy();
    }
  }

  addGraphics() {
      // clear all old graphics
      this.demoGraphicsLayer.removeAll();

      const ImageUrl = "https://lh3.googleusercontent.com/p/AF1QipPVA96RNtfkOb32rFaCzlRZZ1oBZkJeDanZJAQF=w408-h298-k-no"
      const popupContent = `
      <img src="{ImageUrl}" />
      <p>{Description}</p>
      `

      const point: any = {
        //Create a point
        type: "point",
        longitude: 100.5446138256069,
        latitude: 13.648925860588548
      };

      const pictureMarkSymbol = new PictureMarkerSymbol(
        {
        url: ImageUrl,
        width: "64px",
        height: "64px"
        
      });

      const attributes = { 
        Name: "บ้านสวนอบอวลรัก สำโรง", 
        Description: "26/12 ม.15 ตำบล บางหญ้าแพรก อำเภอพระประแดง สมุทรปราการ 10130",
        ImageUrl: ImageUrl
      };
      const popupTemplate = { title: "{Name}", content: popupContent };

      const pointGraphic = new Graphic({ 
        geometry: point, 
        symbol: pictureMarkSymbol ,
        attributes: attributes , 
        popupTemplate: popupTemplate 
      });
      this.demoGraphicsLayer.add(pointGraphic);

    }

  clearGraphicLayer() {
	  this.demoGraphicsLayer.removeAll();
  }

  addVectorTile(){
    if (!this.map) return;

    if (!this.map.layers.includes(this.demoVectorTileLayer)) {
      this.map.add(this.demoVectorTileLayer);
    } else {
      this.demoVectorTileLayer.visible = true;
    }
  }

  hideVectorTile() {
    if (!this.map) return;

    if (this.map.layers.includes(this.demoVectorTileLayer)) {
      this.demoVectorTileLayer.visible = false;
    }
  }

  addFeatureLayer() {
    if (!this.map) return;

    if (!this.map.layers.includes(this.demoFeatureLayer)) {
      this.map.add(this.demoFeatureLayer);
    } else {
      this.demoFeatureLayer.visible = true;
    }
  }

  hideFeatureLayer() {
    if (!this.map) return;

    if (this.map.layers.includes(this.demoFeatureLayer)) {
      this.demoFeatureLayer.visible = false;
    }
  }

  zoomFeatureLayer() {
    if (!this.map) return;
    this.provinceFeatureLayer.queryFeatures({
      where: "NAME1='กรุงเทพมหานคร'",  // SQL Statement
      returnGeometry: true,
      outFields: ["*"],
      num: 1
    }).then(result => {
      console.log('result', result)
      if (result.features.length > 0) {
        const feature = result.features[0];
        this.demoGraphicsLayer.removeAll();

        // 🔹 สร้าง symbol สำหรับขอบเขตจังหวัด
        const boundarySymbol: any = {
          type: "simple-fill",
          color: [0, 0, 0, 0], // โปร่งใส
          outline: {
            color: [0, 150, 255], // ฟ้า
            width: 3
          }
        };

        // 🔹 สร้าง graphic
        const boundaryGraphic = new Graphic({
          geometry: feature.geometry,
          symbol: boundarySymbol
        });

        // 🔹 วาดขอบเขตจังหวัดลง graphic layer
        this.demoGraphicsLayer.add(boundaryGraphic);

        // 🔹 zoom ไปที่ polygon
        this.mapView?.goTo(
          {
            target: feature.geometry,
            padding: 40
          },
          {
            duration: 1200,
            easing: "ease-in-out"
          }
        );
      }
    });
  }

  HideCsvDemo(){
    if (!this.map) return;

    if (this.map.layers.includes(this.csvLayer)) {
      this.csvLayer.visible = false;
    }
  }

  AddCsvDemo(){
    if (!this.map) return;

    if (!this.map.layers.includes(this.csvLayer)) {
      this.map.add(this.csvLayer);
      this.csvLayer.when(() => {
        this.defaultRenderer = this.csvLayer.renderer?.clone();
      });

    } else {
      this.csvLayer.visible = true;
    }

  }

  AnalysisCsvDemo(){
    if (!this.map) return;

    if (this.map.layers.includes(this.csvLayer) && this.csvLayer.visible) {
        const heatmapRenderer = new HeatmapRenderer({
          field: "passenger_count",
          colorStops: [
            { ratio: 0, color: "rgba(255, 255, 255, 0)" },
            { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
            { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
            { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
            { ratio: 1, color: "rgba(255, 0, 0, 1)" }
          ],
          minDensity: 0,
          maxDensity: 1,
          radius: 10
    })

    this.csvLayer.renderer = heatmapRenderer;
  }
}

  ResetAnalysisCsvDemo(){
    if (!this.map) return;

    if (this.map.layers.includes(this.csvLayer)) {
        this.csvLayer.renderer = this.defaultRenderer;
    }
  }   

}
