# Bitacora

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It uses [react-bootstrap](https://react-bootstrap.github.io/) as user interface library.
 
This project is about a flight log book, implemented around getting all possible data directly from the igc file(s) instead of entering data manually. It will be still possible to upload data manually, but the first use case is to upload form the IGC file.

The data is stored in firebase and should be public once it is published. It uses the Realtime database to store profile data and flight data and uses firebase storage to store the unchanged igc files.

## Dashboard
The Dashboard shows an overview of the pilot´s profile data. It shows the Pilot´s name, his license(s), his wing(s) and the rest of his equipment (harness, etc.) ***This needs to be implemented yet***
## Save new flight
This page allows the user to enter a fresh new flight either by droping a single ICG file into a dropzone or typing all data manuallly. The max height and date of the flight can be edited via a dialog ***This might change later...***. 
It is functional, but it needs more user feedback on successful upload, cleaning-up the form, etc.

The application checks if the flight exists (same date and same launch time)

## Bulk upload
Bulk upload allows the user to save many flights at once. The user can drop a directory path in the drop zone and the page will list the igc files available in that path. The user can select which ones he one to upload and they get saved similar to the **Save new Flight**

## Log Book
***Not implemented yet.*** Should list the flights, but I have not decided in which form

## Flight stats
***Not implemented yet.*** Should allow the user to create queries and reports. Still figuring out how it should work.