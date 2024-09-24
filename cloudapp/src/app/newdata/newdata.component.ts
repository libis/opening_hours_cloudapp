import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector:'app-newdata-dialog',
    templateUrl:'./newdata.component.html',
    styleUrls:['./newdata.component.scss']
})
export class NewDataComponent  {

    data: any = {"description":"","varname":"","type":""}
    localdata: any = {"description":"","varname":"","type":""}
    types: any = [
        {value:"text",name:"Text",pattern:".+"},
        {value:"textarea",name:"Long Text",pattern:".+"},
        {value:"number",name:"Number",pattern:"[0-9,\\.]+"},
        {value:"tel",name:"Phonenumber",pattern:"\\+?[0-9]+"},
        {value:"email",name:"Email",pattern:"[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"},
        {value:"url",name:"URL",pattern:"https?://.+"},
        {value:"date",name:"Date",pattern:"[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}"},
        {value:"time",name:"Time",pattern:"([0-1]{1}[0-9]{1}|20|21|22|23):[0-5]{1}[0-9]{1}"},
    ]

    constructor(
        private dialogRef: MatDialogRef<NewDataComponent>,
    ){
    }

    save() {
        this.dialogRef.close(this.data);
    }

    close() {
        this.dialogRef.close(false);
    }

    isValid(){
        const descRegex = RegExp("^.+");
        const varnameRegex = RegExp("^[a-z][a-z0-9]+");
        return this.data.type != null 
            && this.data.description != null 
            && this.data.varname != null 
            && this.data.type != ""
            && this.data.description.trim() != '' 
            && this.data.varname.trim() != ''
            && descRegex.test(this.data.description)
            && varnameRegex.test(this.data.varname)
    }

    json(val : any) {
        return JSON.stringify(val, null, 4)
      }
}


