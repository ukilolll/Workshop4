import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable , inject , signal} from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from './components/review-item-component/type';

@Injectable({
  providedIn: 'root',
})

export class ArticleService {
  private readonly API_URL = 'https://yozcimilxrlppsbznsqu.supabase.co/rest/v1/Reviews';
  private readonly API_KEY = 'sb_publishable_GWz_vyUcKIE1URLQkJl4wg_CsR_--cl';

  private readonly headers = new HttpHeaders({
    apikey: this.API_KEY,
    Authorization: `Bearer ${this.API_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  });
  
  private readonly http = inject(HttpClient);

  reviews = signal<Review[]>([]);
    
  insertReview(review: Review): Observable<any> {
    return this.http.post(this.API_URL, review, {
      headers: this.headers,
    });
  }

  fetchReviews() {
    this.http.get<Review[]>(this.API_URL, {
      headers: this.headers,
    })
    .subscribe((data) => {
      this.reviews.set(data);
    });
    
  }

}
