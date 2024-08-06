import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ErrorMessages } from '../static/error.component';
import { MatRadioChange } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NONE_TYPE, NullTemplateVisitor } from '@angular/compiler';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  config: any = {"serviceUrl":''}
  isSaving = false;
  
  constructor(
    private appService: AppService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    //this.appService.setTitle('Configuration');
    this.config.serviceUrl = ''
    this.load();
  }

  load() {
    this.configService.getAsFormGroup().subscribe( conf => {
      if (Object.keys(conf.value).length!=0) {
        this.config = conf.value
      }
    });   
  }

  save() {
    this.isSaving = true;
    this.configService.set(this.config).subscribe(
      () => {
        this.alert.success('Configuration successfully saved.');
        setTimeout(() => {
          this.back()
        }, 3000);
      },
      err => this.alert.error(err.message),
      ()  => this.isSaving = false
    );
  }

  back() {
    this.router.navigate([''])
  }
  
  json(val : any) {
    return JSON.stringify(val, null, 4)
  }


}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor (
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      switchMap( initData => this.restService.call(`/users/${initData.user.primaryId}`)),
      map( user => {
        if (!user.user_role.some(role=>role.role_type.value=='221')) {
          this.router.navigate(['/error'], 
            { queryParams: { error: ErrorMessages.NO_ACCESS }});
          return false;
        }
        return true;
      })
    );
  }
}