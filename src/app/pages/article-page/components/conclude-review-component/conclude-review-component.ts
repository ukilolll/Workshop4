import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { Review } from '../review-item-component/type';

@Component({
  selector: 'app-conclude-review-component',
  imports: [ProgressBarModule,RatingModule,FormsModule],
  templateUrl: './conclude-review-component.html',
  styleUrl: './conclude-review-component.css',  
})

export class ConcludeReviewComponent {
  @Input({ required: true }) reviews!: Review[];
  totalReviews = 0;
  oneStarPercent = 0;
  twoStarPercent = 0;
  threeStarPercent = 0
  fourStarPercent = 0;
  fiveStarPercent = 0;
  averageRating = 0;
  star = 1;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviews'] && this.reviews?.length) {
      var reviewsLength = this.reviews.length;
      this.totalReviews = reviewsLength;
      this.averageRating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsLength;
      this.oneStarPercent = Math.round( this.reviews.filter(r => r.rating === 1).length / reviewsLength * 100 )
      this.twoStarPercent = Math.round( this.reviews.filter(r => r.rating === 2).length / reviewsLength * 100 )
      this.threeStarPercent = Math.round( this.reviews.filter(r => r.rating === 3).length / reviewsLength * 100 )
      this.fourStarPercent = Math.round( this.reviews.filter(r => r.rating === 4).length / reviewsLength * 100 )
      this.fiveStarPercent = Math.round( this.reviews.filter(r => r.rating === 5).length / reviewsLength * 100 )
    }
  }

  

}
