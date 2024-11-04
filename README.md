# opening_hours_cloudapp

# Introduction 

This Alma Cloudapp is a UI for the opening_hours API
The purpose of the app is to allow the user to enter information about a library (name, location, telephonenumber, email, openinghours, # of current visitors, ...)
This information can later be accessed via an API to be displayed on the website of the library, the library app, displays in the building, ...

# Usage
Start by selecting a library from the dropdown. All libraries of your institution should be listed here.

![Intro page](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/main.png)

Once a library is selected the screen with the information of the library will be shown
## General Info
The expansion-panel General Info contains, by default, a field with the name of the library as it is configured in Alma. Here you can change the name to something else if needed. This will not change the name in Alma but will store this in de Opening Hours Cloud App. Changes can be saved by clicking the 'Save'-button

![General information](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/edit.png)

Clicking the worldglobe-icon opens the translations-dialog.

### Translations
The translations-dialog allows the user to enter the translations of certain fields. The Apply-button keeps the changes made in memory but these will only be saved after clicking the Save-button. The Close-button closes the dialog and forgets the changes.

![Translations](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/translate.png)

### New datafields
In the General Info expansion panel the user can use the +-icon to add additional fields. This icon opens the New datafield-dialog

Description : A short one or two word description of the field to be used in the Opening Hours Cloud App to indicate the meaning of the field.
This can consist of alpha-numerical characters, punctuation and spaces.

Variable Name : The name of the variable under witch the data will be available in the Opening Hours API.
This can consist of lowercase alpha-numerical characters but can not start with a number.

Type : There are 8 types of fields : Text, Long Text, Number, Phonenumber, Email, URL, Date, Time. Each corresponds to a kind of information that can be entered in the field. 

![New datafield](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/new.png)

Click the Add-button to add the field to the General Info expansion panel.

## Opening hours
The Opening hours expansion panel allows the user to enter the normal opening hours of the library. For each day of the week different hours can be entered. The +-icon allows for more entries to be created in case there of multiple open sessions during one day (like AM and PM)
The trash-icon deletes an entry.
Again the data is only saved after clicking the Save-button.

![Opening hours](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/opening.png)

## Exceptions on opening hours
Sometimes there are days where the opening hours differ from normal opening hours or the library might be closed (ex. holidays, special occasions, ...)
The expansion panel Exceptions on opening hours allows the user to enter those dates and times.
It works similary to the Opening hours but now a startdate and enddate needs to be given. 
An exception can be indicated to repeat annualy like a national holiday or anniversary. Again like with the opening hours the +-icon allows for multiple open sessions that day. An exception without an open and close time is considered a closed day.
The trash-icon deletes an entry.
The information is saved by clicking the Save-button.

![Exceptions](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/exceptions.png)

## Occupancy
The Occupancy expansion panel allows for the user to enter the number of people in the library to indicate how busy it is.
For this the Occupancy expansion panel contains 2 fields.

Maximum occupancy : the maximum number of people allowed in the library at the same time. Usually limited by the number of study-seats available.
Current occupancy : the number of people currenty in the library.

This information is saved by clicking the Save-button.

![Occupancy](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/occupancy.png)

## Additional Info
The Additional Info expansion panel works exactly the same as the General Info expansion panel. It was added to prevent the General Info expansion panel to become cluttered with to many fields.

![Additional info](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/additional.png)

# Configuration
The Configuration screen is accesible by the wrench-icon.
It has 2 fields.

Service URL : The URL of the Opening Hours API-endpoint. This needs to be configured only once after the API has been set up.

Languages : Here the user can select the languages the Opening hours Cloud App will provide in the Translations-dialog. Adding a language can be done by selecting it from the dropdown-selector and removing a language is done with the minus-icon.

![Configuration](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/configuration.png)

