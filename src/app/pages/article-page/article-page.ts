import { Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentedNavComponent } from '../../shared/components/segmented-nav-component/segmented-nav-component';
import { ReviewItemComponent } from './components/review-item-component/review-item-component';
import { WriteReviewComponent } from './components/write-review-component/write-review-component';
import { Review } from './components/review-item-component/type';
import { ArticleService } from '../article-page/article-service';
import { ConcludeReviewComponent } from './components/conclude-review-component/conclude-review-component';


@Component({
  selector: 'app-article-page',
  imports: [CommonModule , SegmentedNavComponent, ReviewItemComponent, WriteReviewComponent , ConcludeReviewComponent],
  templateUrl: './article-page.html',
  styleUrl: './article-page.css',
})
export class ArticlePage implements OnInit {
  private readonly articleService = inject(ArticleService);
  reviews = this.articleService.reviews;

  ngOnInit(): void {
    this.articleService.fetchReviews();
  }

}

