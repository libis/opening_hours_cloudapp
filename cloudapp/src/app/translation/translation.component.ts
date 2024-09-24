import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-translation-dialog',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {
  localdata: any = {}
  languages: any;
  languagesList: any;
  ohUrl: any = ""
  url: string = '/assets/languages.json';


  constructor(
    private dialogRef: MatDialogRef<TranslationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: HttpClient,
    private configService: CloudAppConfigService,
  ) {
    this.localdata = JSON.parse(JSON.stringify(data))
  }

  ngOnInit() {
    this.http.get(this.url).subscribe(res => {
      this.languagesList = Object.entries(res)
      
    }); 

    this.configService.getAsFormGroup().subscribe( conf => {
      if (Object.keys(conf.value).length!=0) {
        this.languages = conf.value.languages
      }
    });
  }


  getLanguages() {
    var result = []
    if (this.languages != undefined) {
      for (let i in this.languagesList) {
        let l = this.languagesList[i]
        if (this.languages.indexOf(l[0]) != -1) {
          result.push(l);
        }
      }
    }
    return result.sort((a,b) => (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0)) 
  }


  apply() {
    this.dialogRef.close(this.localdata);
  }

  close() {
    this.dialogRef.close(false);
  }

  json(val : any) {
    return JSON.stringify(val, null, 4)
  }


}