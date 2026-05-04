import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector:'app-confirmation-dialog',
    templateUrl:'./confirmation.component.html',
    styleUrls:['./confirmation.component.scss']
})
export class ConfirmationComponent  {

    
    constructor(
        private dialogRef: MatDialogRef<ConfirmationComponent>,
    ){
    }

    yes() {
        this.dialogRef.close(true);
    }

    no() {
        this.dialogRef.close(false);
    }

}


