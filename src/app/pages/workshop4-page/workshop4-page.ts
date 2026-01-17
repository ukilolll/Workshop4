import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

interface HealthFacility {
  id: string;
  ministry: string;
  department: string;
  agency: string;
  lat: number;
  long: number;
  address: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-workshop4-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop4-page.html',
  styleUrls: ['./workshop4-page.css'],
})
export class Workshop4Page implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  private http = inject(HttpClient); // Inject HttpClient แบบใหม่

  map: Map | null = null;
  view: MapView | null = null;
  graphicsLayer = new GraphicsLayer();

  facilities: HealthFacility[] = [];
  filteredFacilities: HealthFacility[] = [];
  isLoading = true;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadCsvData();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  loadCsvData() {
    const csvUrl = '/data/100_row_health_facillties.csv';

    this.http.get(csvUrl, { responseType: 'text' }).subscribe({
      next: (data) => {
        console.log('CSV Data Loaded:', data.slice(0, 100));
        this.parseCSV(data);
        this.isLoading = false;

        this.cdr.detectChanges();

        if (this.view) {
          this.renderMarkers();
        }
      },
      error: (err) => {
        console.error('Error loading CSV:', err);
        this.isLoading = false;
      },
    });
  }

  parseCSV(csvText: string) {
    const lines = csvText.split('\n');
    console.log(`Found ${lines.length} lines in CSV`);

    const result: HealthFacility[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = this.splitCsvLine(line);

      if (i === 1) console.log('First Row Parts:', parts);

      // เช็คความยาว Array (CSV ชุดนี้มี 7 คอลัมน์)
      if (parts.length >= 7) {
        result.push({
          id: parts[0],
          ministry: parts[1],
          department: parts[2],
          agency: parts[3],
          lat: parseFloat(parts[4]),
          long: parseFloat(parts[5]),
          address: parts[6].replace(/"/g, ''),
          imageUrl: `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTYT7VKtCIkEu5FSdWb1LkeZ0dZoySjk2_BcWq47FYUIZNxoMixZtFp704so0o6KLqtsNJXrwl96cRgA0vHQfWOoLnC7OzyEZxXNc2DdpxN6Qn8VCeEy8EERD69WsU2i2FtD4phcGilMw/s1600/hospital.jpg${i}`,
        });
      } else {
        console.warn(`Skipped line ${i}: parts length is ${parts.length}`, line);
      }
    }

    console.log(`Parsed ${result.length} facilities`);
    this.facilities = result;
    this.filteredFacilities = [...this.facilities];
  }

  splitCsvLine(line: string): string[] {
    const result = [];
    let start = 0;
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        result.push(line.substring(start, i));
        start = i + 1;
      }
    }
    result.push(line.substring(start));
    return result;
  }

  async initializeMap() {
    this.map = new Map({
      basemap: 'streets-vector',
    });

    this.view = new MapView({
      container: this.mapViewEl.nativeElement,
      map: this.map,
      center: [100.5342, 13.76733],
      zoom: 12,
      ui: { components: ['zoom'] },
    });

    this.map.add(this.graphicsLayer);

    this.view.when(() => {
      if (this.facilities.length > 0) {
        this.renderMarkers();
      }
    });
  }

  renderMarkers() {
    this.graphicsLayer.removeAll();

    const markerSymbol = new PictureMarkerSymbol({
      url: 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
      width: '48px',
      height: '48px',
    });

    this.filteredFacilities.forEach((item) => {
      if (isNaN(item.lat) || isNaN(item.long)) return;

      const graphic = new Graphic({
        geometry: {
          type: 'point',
          longitude: item.long,
          latitude: item.lat,
        } as any,
        symbol: markerSymbol,
        attributes: item,
        popupTemplate: {
          title: '{agency}',
          content: '{address}',
        },
      });

      this.graphicsLayer.add(graphic);
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    if (!query) {
      this.filteredFacilities = [...this.facilities];
    } else {
      this.filteredFacilities = this.facilities.filter(
        (item) =>
          item.agency.toLowerCase().includes(query) || item.address.toLowerCase().includes(query)
      );
    }

    this.renderMarkers();
  }

  highlightOnMap(item: HealthFacility) {
    if (this.view) {
      this.view.goTo(
        {
          target: [item.long, item.lat],
          zoom: 16,
        },
        { duration: 800 }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.view) this.view.destroy();
  }
}
  