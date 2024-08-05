import { Observable  } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NONE_TYPE, NullTemplateVisitor } from '@angular/compiler';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  ohUrl: string = "https://services.libis.be/opening_hours/"
  loading = false
  libraries: any;
  selectedLibrary: any = "" 
  record: any = null
  data: any = {"institution":{"libraries":[null]}}


  backorcancel: string = "Back"
  authToken: string
  weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  times = [""]

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadLibraries() 

    const zeroPad = (num, places=2) => String(num).padStart(places, '0')
    for (let h = 0; h<24; h++) {
      for (let m = 0; m<60; m+=15) {
        let val = zeroPad(h) + ":" + zeroPad(m)
        this.times.push(val)
      }
    }

    this.restService.call<any>("/almaws/v1/conf/general")
    .subscribe(
      result => {
        this.data.institution.code = result.institution.value
        this.data.institution.name = result.institution.desc
      },
      error => this.alert.error('Failed to retrieve institution: ' + error.message)
    );    


    this.eventsService.getAuthToken()
      .subscribe(authToken => this.authToken = authToken);
  }

  ngOnDestroy(): void {
  }
 
  loadLibraries() {
    this.restService.call<any>("/almaws/v1/conf/libraries")
    .subscribe(
      result => this.libraries = result.library.sort((a,b) => a.code > b.code),
      error => this.alert.error('Failed to retrieve libraries: ' + error.message)
    );    
  }

  loadData(path) {
    this.loading = true;
    this.data.institution.libraries[0] = null;

    this.http.get<any>(this.ohUrl+path)
      .pipe(
        map(res => {
          delete res.week
          delete res.current
         
          return res
        }), 
        finalize(() =>{ 
          if (this.data.institution.libraries[0].data == undefined) this.data.institution.libraries[0].data = {}
          if (this.data.institution.libraries[0].data.address1 == undefined) this.data.institution.libraries[0].data.address1 = ""
          if (this.data.institution.libraries[0].data.address2 == undefined) this.data.institution.libraries[0].data.address2 = ""
          if (this.data.institution.libraries[0].data.phone == undefined) this.data.institution.libraries[0].data.phone = ""
          if (this.data.institution.libraries[0].data.email == undefined) this.data.institution.libraries[0].data.email = ""
          if (this.data.institution.libraries[0].data.occupancy == undefined) this.data.institution.libraries[0].data.occupancy = {"current":0,"max":0}

          this.loading = false;
        })
      )
      .subscribe({
        next: resp => { 
          this.data.institution.libraries[0] = resp; 
        },
        error: e => {
          this.data.institution.libraries = [{}]
          this.data.institution.libraries[0].code = this.selectedLibrary.code;
          this.data.institution.libraries[0].name = this.selectedLibrary.name;
          this.data.institution.libraries[0].defaults = []
          for(let i=1;i<=7;i++) {
            this.data.institution.libraries[0].defaults.push({"week_day":i % 7,"hours": [{"open": "","closed": ""}]})
          }
          this.data.institution.libraries[0].exceptions = []
          this.data.institution.libraries[0].data = {}
          //this.alert.error(e.message)
        }
      });    
  }

  onBack(){
    this.selectedLibrary = ""
    this.data.institution.libraries = []
    this.backorcancel = "Back"
  }

  onSave() {
    var tenant = this.selectedLibrary.path.split(".")[0]
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.authToken}` 
      })
    };

    this.http.post(this.ohUrl+tenant,this.data,httpOptions)
    .subscribe(
      result => {
        this.onBack();
      },
      error => this.alert.error('Failed to update information: ' + error.message)
    );    
  }

  onSelectLibrary(val: any) {
    var path = val.path.replaceAll(".","/")

    this.loadData(path)
  }

  getName() {
    this.data.institution.libraries[0].name = this.selectedLibrary.name
  }

  onDataChange(val:any) {
    this.backorcancel = "Cancel"
  }

  add_doh(i) {
    this.data.institution.libraries[0].defaults[i].hours.push({"open":"","closed":""})
    this.onDataChange(i)
  }

  del_doh(i,j){
    this.data.institution.libraries[0].defaults[i].hours.splice(j,1)
    if (this.data.institution.libraries[0].defaults[i].hours.length == 0) {
      this.add_doh(i)
    }
    this.onDataChange(i)
  }

  add_eoh() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.data.institution.libraries[0].exceptions.push({"date":formattedDate,"hours":[{"open":"","closed":""}],"repeat":false,"description":""})
    this.onDataChange(0)
  }

  del_eoh(i){
    this.data.institution.libraries[0].exceptions.splice(i,1)
    this.onDataChange(i)
  }

  add_eohh(i) {
    this.data.institution.libraries[0].exceptions[i].hours.push({"open":"","closed":""})
    this.onDataChange(0)
  }

  del_eohh(i,j) {
    this.data.institution.libraries[0].exceptions[i].hours.splice(j,1)

    if (this.data.institution.libraries[0].exceptions[i].hours.length == 0) {
      this.add_eohh(i)
    }

    this.onDataChange(0)
  }


  json(val : any) {
    return JSON.stringify(val, null, 4)
  }

 }
