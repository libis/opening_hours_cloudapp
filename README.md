# opening_hours_cloudapp

# Introduction 
In general the app allows Alma library staff users  to add, and bring together, information about the library such as name, location, telephone number, email, website, photo, opening hours, occupancy (# of current visitors), public notes/messages,…The information added via the cloud app is stored in a service (database) which is accessible via an API. In that sense the Alma OpeningHours Cloud App is ’the’ User Interface for the opening_hours API. 

The main goal of the app, in combination with the opening hours service, is to centrally manage all relevant library information and to be able to use this data (via the api) for consistent/uniform display on different ‘virtual locations’ like the library website, the library/institutional app, displays in the building, Primo, …

# Configuration
The Configuration screen is accessible by the wrench-icon.
It has 2 fields.

Service URL: The URL of the Opening Hours API-endpoint. This needs to be configured only once after the API has been set up.

Languages: the user can select the languages the Opening hours Cloud App will provide in the Translations-dialog. Adding a language can be done by selecting it from the dropdown-selector and removing a language is done with the minus-icon.

![Configuration](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/a_configuration.png)


# Usage
Start by selecting a library from the dropdown. Based upon the library scope of your Circulation Desk Manager role(s) all relevant libraries  should be listed here. 

![Intro page](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/b_main.png)

Once a library is selected the screen with the information of the library will be shown

## General Info
The expansion-panel General Info contains, by default, a field with the name of the library as it is configured in Alma. Here you can change the name to something else if needed. This will not change the name in Alma but will store this in the Opening Hours Cloud App. Changes can be saved by clicking the ‘Save’-button

Clicking the world globe-icon opens the translations-dialog.

![General information](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/c_edit.png)

Clicking the worldglobe-icon opens the translations-dialog.

### Translations
The translations-dialog allows the user to enter the translations of certain fields. The Apply-button keeps the changes made in memory, but these will only be saved after clicking the Save-button. The Close-button closes the dialog and forgets the changes.

![Translations](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/d_translate.png)

### New datafields
In the General Info expansion panel, the user can use the +-icon to add additional fields. This icon opens the New data field-dialog with the following parameters:

Description: A short one- or two-word description of the field to be used in the Opening Hours Cloud App to indicate the meaning of the field.
This can consist of alpha-numerical characters, punctuation and spaces

Variable Name: The name of the variable under which the data will be available in the Opening Hours API.
This can consist of lowercase alpha-numerical characters but cannot start with a number.

Type: There are 8 types of fields: Text, Long Text, Number, Phone number, Email, URL, Date, Time. Each corresponds to a kind of information that can be entered in the field.

![New datafield](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/e_new.png)

Click the Add-button to add the field to the General Info expansion panel.

The trash-icon deletes a field.

The information is saved by clicking the Save-button.

## Opening hours
The Opening hours expansion panel allows the user to enter the normal opening hours of the library. For each day of the week different hours can be entered. The +-icon allows for more entries to be created in case there of multiple open sessions during one day (like AM and PM)

The trash-icon deletes an entry.

Again, the data is only saved after clicking the Save-button.

![Opening hours](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/f_opening.png)

## Exceptions on opening hours
Sometimes there are days where the opening hours differ from normal opening hours or the library might be closed (ex. holidays, special occasions, …)
The expansion panel Exceptions on opening hours allows the user to enter those dates and times.

It works similarly to the Opening hours but now a date needs to be given.
An exception can be indicated to repeat annually like a national holiday or anniversary. Again, like with the opening hours the +-icon allows for multiple open sessions that day. An exception without an open and close time is considered a closed day.

It is also possible to add a date range for exceptions to cover a closing period for more than one day.

The trash-icon deletes an entry.

The information is saved by clicking the Save-button.

![Exceptions](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/g_exceptions.png)

## Occupancy
The Occupancy expansion panel allows for the user to enter the number of people in the library to indicate how busy it is.

For this the Occupancy expansion panel contains 2 fields.

Maximum occupancy: the maximum number of people allowed in the library at the same time. Usually limited by the number of study-seats available.

Current occupancy: the number of people currently in the library.

This information is saved by clicking the Save-button.

Please note the opening hours service should be able to integrate with tools ‘counting’ or ‘managing’ occupancy in the library. (e.g. Thingdust) Based upon this integration the ‘current occupancy’ number would be updated automatically in real time.  

![Occupancy](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/h_occupancy.png)

## Additional Info
The Additional Info expansion panel works exactly the same as the General Info expansion panel. It was added to prevent the General Info expansion panel to become cluttered with to many fields.

![Additional info](https://github.com/libis/opening_hours_cloudapp/blob/main/cloudapp/docs/i_additional.png)


