import { Component, ElementRef, ViewChild } from '@angular/core';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { ButtonModule } from 'primeng/button';
import Graphic from '@arcgis/core/Graphic';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'app-about-page',
  imports: [SegmentedNavComponent , ButtonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})

export class AboutPage {
  @ViewChild('aboutMeMapView', { static: false }) private mapViewEl!: ElementRef;
  map: Map | null = null;
  mapView: MapView | null = null;
  graphicslayer: GraphicsLayer = new GraphicsLayer();
  countryGraphic:Graphic = new Graphic({ 
    geometry: {
      type: "point",
      longitude:101.00007153603298,
      latitude: 15.34258304357927
    }, 
    symbol:new PictureMarkerSymbol(
    {
      url: "https://cdn-icons-png.flaticon.com/512/4060/4060311.png",
      width: "64px",
      height: "64px"
      
    } , ),
    popupTemplate: {
       title: "my country", 
       content: `
      <div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg"
             width="140"/>
        <p>Thailand</p>
      </div>`
    }
    });

  schoolGraphic = new Graphic({
    geometry: {
      type: "point",
      longitude: 100.53701323223433,
      latitude: 13.662871367620172
    }, 
    symbol:new PictureMarkerSymbol(
    {
      url: "https://static.thenounproject.com/png/1661311-200.png",
      width: "64px",
      height: "64px"
      
    } , ),
    popupTemplate: { 
      title: "โรงเรียนวัดทรงธรรม", 
      content: `
      <div>
        <img src="https://campus.campus-star.com/app/uploads/2016/02/Wat_Songtham_2.jpeg-1024x575.jpeg"
             width="140"/>
        <p>1126 ถนน เพชรหึงษ์ ตำบล ตลาด อำเภอพระประแดง สมุทรปราการ 10130</p>
      </div>`
    }
  })

  universityGraphic = new Graphic({
    geometry: {
      type: "point",
      longitude: 100.91920982883498 ,
      latitude: 13.121154272161979
    }, 
    symbol:new PictureMarkerSymbol(
    {
      url: "https://cdn-icons-png.flaticon.com/512/8/8178.png",
      width: "64px",
      height: "64px"
      
    } , ),
    popupTemplate: { 
      title: "มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา", 
      content: `
      <div>
        <img src="https://www.src.ku.ac.th/th/tp/img/src-6.jpg"
             width="140"/>
        <p>199 ตำบลทุ่งสุขลา อำเภอศรีราชา ชลบุรี 20230</p>
      </div>`
    }
  })

  

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    this.map = new Map({
      basemap: 'satellite',
    });

    this.mapView = new MapView({
      container,
      map: this.map,
      center: [100.5446138, 13.648925860],  //longitude, latitude
      zoom: 15,
    });

    this.map.add(this.graphicslayer);

    this.mapView.when(() => { });

    return this.mapView.when();
  }

  ngOnDestroy(): void {
    if (this.mapView) {
      this.mapView.destroy();
    }
  }
  
  showPin(graphic:Graphic ,zoom:number){
    if (!this.mapView) return;

    if (!this.graphicslayer.graphics.includes(graphic)){
      this.graphicslayer.removeAll()
      this.graphicslayer.add(graphic);

      this.mapView.goTo({
        center:graphic.geometry,
        zoom:zoom
      })
    }
    else{
      this.graphicslayer.graphics.remove(graphic);
    }
  }

  showContry(){
    this.showPin(this.countryGraphic,6)
  } 

  showUniversity(){ 
    this.showPin(this.universityGraphic, 15)
  }

  showSchool(){
    this.showPin(this.schoolGraphic, 15)
  }

}
