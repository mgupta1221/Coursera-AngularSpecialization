import { Component, Inject, OnInit } from '@angular/core';
import { expand, flyInOut } from '../animations/app.animation';
import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class HomeComponent implements OnInit {


  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;   
  expand = 'enter';

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService,
    @Inject('BaseURL') public BaseURL: string) { }

  ngOnInit(): void {
    this.dishservice.getFeaturedDish()
      .subscribe(dish => this.dish = dish,
        dishErrMess => this.dishErrMess = <any>dishErrMess);

    this.promotionservice.getFeaturedPromotion()
      .subscribe(promo => this.promotion = promo,
        dishErrMess => this.dishErrMess = <any>dishErrMess);

    this.leaderservice.getFeaturedLeader()
      .subscribe(leader => this.leader = leader,
        dishErrMess => this.dishErrMess = <any>dishErrMess);
  }

}
