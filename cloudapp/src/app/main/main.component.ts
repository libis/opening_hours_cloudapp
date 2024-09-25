import { Observable  } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { CloudAppConfigService, CloudAppRestService, CloudAppEventsService, Request, HttpMethod, Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NONE_TYPE, NullTemplateVisitor } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { NewDataComponent} from '../newdata/newdata.component';
import { TranslationComponent} from '../translation/translation.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  ohUrl: string = ""
  languages: any = ""
  defaultLanguage: any = ""
  loading = false
  libraries: any;
  selectedLibrary: any = "" 
  record: any = null
  data: any = {"institution":{"libraries":[null]}}
  x: any = ""

  backorcancel: string = "Back"
  authToken: string
  weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  times = [""]

  types: any = [
    {value:"text",name:"Text",pattern:".+",translatable:true},
    {value:"textarea",name:"Long Text",pattern:".+",translatable:true},
    {value:"number",name:"Number",pattern:"[0-9,\\.]+",translatable:false},
    {value:"tel",name:"Phonenumber",pattern:"\\+?[0-9]+",translatable:false},
    {value:"email",name:"Email",pattern:"[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",translatable:false},
    {value:"url",name:"URL",pattern:"https?://.+",translatable:false},
    {value:"date",name:"Date",pattern:"[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}",translatable:false},
    {value:"time",name:"Time",pattern:"([0-1]{1}[0-9]{1}|20|21|22|23):[0-5]{1}[0-9]{1}",translatable:false},
]


  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private http: HttpClient,
    private dialog: MatDialog
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


    this.configService.getAsFormGroup().subscribe( conf => {
      if (Object.keys(conf.value).length!=0) {
        this.ohUrl = conf.value.serviceUrl

        if (this.ohUrl == "" || this.ohUrl == undefined) {
          this.ohUrl = "https://services.libis.be/opening_hours/"
        }

        this.languages = conf.value.languages
        if (this.languages == "" || this.languages == undefined || this.languages.length == 0) {
          this.languages = ["en","fr","de","nl"]
        }

        this.defaultLanguage = conf.value.defaultLanguage
        if (this.defaultLanguage == "" || this.defaultLanguage == undefined) {
          this.defaultLanguage = "en"
        }
      }
    });

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
          if (this.data.institution.libraries[0].data.name == undefined) {
            let values = {}
            for (let ii in this.languages){
              values[this.languages[ii]] = this.selectedLibrary.name
            }
            this.data.institution.libraries[0].data.name= {
              value: values,
              type:"text",
              ui:"general",
              description:"Library Name",
              order:0
            }
          }
          if (this.data.institution.libraries[0].data.occupancy == undefined) this.data.institution.libraries[0].data.occupancy = {"type": "occupancy","ui": "occupancy","value": { "current": 0,"maximum": 0 }, "order":0}
          this.loading = false;
        })
      )
      .subscribe({
        next: resp => { 
          this.data.institution.libraries[0] = resp; 
        },
        error: e => {
          if (e.status == 404) {
            this.data.institution.libraries = [{}]
            this.data.institution.libraries[0].code = this.selectedLibrary.code;
            this.data.institution.libraries[0].name = this.selectedLibrary.name;
            this.data.institution.libraries[0].defaults = []
            for(let i=1;i<=7;i++) {
              this.data.institution.libraries[0].defaults.push({"week_day":i % 7,"hours": [{"open": "","closed": ""}]})
            }
            this.data.institution.libraries[0].exceptions = []
            this.data.institution.libraries[0].data = {}
          } else {
            this.alert.error(e.message)
          }
          console.log(e)
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
    this.loading = true
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.authToken}` 
      })
    };

    this.http.post(this.ohUrl+tenant,this.data,httpOptions)
    .subscribe(
      result => {
        this.loading = false
        this.alert.success('Successfully saved.');
        this.backorcancel = "Back"
        setTimeout(() => {
          this.onBack()
        }, 3000);
      },
      error => {
        this.alert.error('Failed to update information: ' + error.message)
        this.loading = false
      }
    );    
  }

  onSelectLibrary(val: any) {
    var path = val.path.replaceAll(".","/")

    this.loadData(path)
  }
/*
  getName() {
    if (this.data.institution.libraries[0].data.name == undefined) {
      var values: {}
      for (let i in this.languages){
        values[this.languages[i]] = this.selectedLibrary.name
      }
      this.data.institution.libraries[0].data.name= {
        value: values,
        type:"text",
        ui:"general",
        description:"Library Name",
        order:0
      }
    } else {
      this.data.institution.libraries[0].data.name.value = this.selectedLibrary.name
    }
  }
*/
  onDataChange(val:any) {
    this.backorcancel = "Cancel"
  }

  openTranslationDialog(f){
    const dialogRef = this.dialog.open(TranslationComponent,{
      width:'350px',
      data:this.data.institution.libraries[0].data[f]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let keys =  Object.keys(result.value);
        for (let i in keys) {
          this.data.institution.libraries[0].data[f].value[keys[i]] = result.value[keys[i]]
        }
      }
    })
  }


  openNewDataDialog(section)  {
    const dialogRef = this.dialog.open(NewDataComponent,{
      width:'250px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let neworder = this.getMaxOrder(section)+1
        if (this.isTranslatable(result.type)) {
          var values: {}
          for (let i in this.languages){
            values[this.languages[i]] = ""
          }
          this.data.institution.libraries[0].data[result.varname]={value:values,description:result.description,type:result.type,ui:section, order:neworder}
        } else {
          this.data.institution.libraries[0].data[result.varname]={value:"",description:result.description,type:result.type,ui:section, order:neworder}
        }
      }
    })
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

  getKeys(ui){
    return Object.entries(this.data.institution.libraries[0].data).filter(function(el) { return el[1]['ui'] == ui }).sort(this.compare).map(x => x[0])
  }

  compare(a,b) {
    if ( a[1].order < b[1].order ){
      return -1;
    }
    if ( a[1].order > b[1].order ){
      return 1;
    }
    return 0;    
  }

  getMaxOrder(ui) {
    let max = 0
    let fields = Object.entries(this.data.institution.libraries[0].data).filter(function(el) { return el[1]['ui'] == ui })
    for (var i in fields) {
      let fld = fields[i]
      if (fld[1]['order'] > max) max = fld[1]['order']
    }
    return max
  }

  getPattern(value) {

    return this.types.filter(function (el) { return el.value == value })[0].pattern
  }

  isValid(){
    if (this.data.institution.libraries[0].data != undefined) {
      var keys = Object.entries(this.data.institution.libraries[0].data).map(x => x[0])
      for(var j in keys) {
        var i = keys[j]
        if (this.data.institution.libraries[0].data[i].type != 'occupancy') {
          var pattern = this.getPattern(this.data.institution.libraries[0].data[i].type)
          var reg = RegExp("^"+pattern);
          if (this.data.institution.libraries[0].data[i].value != "" && !reg.test(this.data.institution.libraries[0].data[i].value)){
            return false
          }
        }
      }
      return true
    }
    return false
  }

  isTranslatable(f) {
    var type = this.types.filter(function(el){  return el.value == f } )[0]
    return type.translatable
  }

  json(val : any) {
    return JSON.stringify(val, null, 4)
  }


 }
