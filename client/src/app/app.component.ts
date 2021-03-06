import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AppState } from './app.service';
import { BackandService } from '@backand/angular2-sdk';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState,
    private backand: BackandService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this.appState.set('layout', _.get(event, 'layout'));
      });
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.backand.init({
      appName: 'funhub',
      anonymousToken: 'f10673bb-d12a-4245-8eca-312add606059',
      signUpToken: 'ccf8dfb2-1d5e-4f23-98c3-ae5bef9a2971'
    });

    this.backand.user.getUserDetails(true)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

}