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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  config: any = {"serviceUrl":''}
  isSaving = false;
  url: string = 'assets/languages.json';
  languages: any;
  languagesList: any;
  selectedLanguage: string = ""

  constructor(
    private appService: AppService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    //this.appService.setTitle('Configuration');
    this.config.serviceUrl = ''
    this.config.languages = []
    this.languages = []
    this.load();
  }

  load() {
    this.http.get(this.url).subscribe(res => {
      this.languages = res
      this.languagesList = Object.entries(this.languages).sort((a,b) => (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0))
    }); 
    this.configService.getAsFormGroup().subscribe( conf => {
      if (Object.keys(conf.value).length!=0) {
        this.config = conf.value
        if (this.config.languages == undefined ) this.config.languages = []
        if (this.config.defaultLanguage == undefined ) this.config.defaultLanguage = "en"
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

  onSelect() {
    if (this.config.languages.indexOf(this.selectedLanguage)) {
      this.config.languages.push(this.selectedLanguage)
    }
    setTimeout(() => {
      this.selectedLanguage = ""
    }, 700);
  }

  removeLanguage(l){
    if (l != this.config.defaultLanguage) {
      this.config.languages.splice(this.config.languages.indexOf(l),1)
    }
  }

  selectedLanguageList() {
    var result = []
    for (var i in this.languagesList) {
      var l = this.languagesList[i]
      if (this.config.languages.indexOf(l[0]) >= 0) {
        result.push(l)
      }
    }
    return result.sort((a,b) => (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0))
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