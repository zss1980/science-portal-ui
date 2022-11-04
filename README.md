# CANFAR Science Portal
### V 2.2
##### Nov 4 2022

UI for accessing and managing Jupyter notebook, carta or desktop sessions that back onto CANFAR resources. 

## Description
This CANFAR service provides the ability to access and manage Jupyter notebook, desktop (vnc), and carta sessions that back
on to CANFAR resources. Using container images and current system resource values (context) provided by Skaha, you can
launch and manage sessions using the container image you select. Contextualization is provided for some session types 
 (currently notebook only,) allowing the amount of memory and number of cores you designate to be used to power
 your session. 

## Endpoint locations
All endpoints require authentication with CANFAR, and authorization to access Skaha resource allocations.

Science Portal URL
https://www.canfar.net/science-portal

## Skaha Web Service
Skaha provides Science Portal with access to supported session types (Jupyter notebooks, desktop (vnc) and carta)
More information can be found in the swagger docs: https://ws-uv.canfar.net/skaha

## CANFAR Science Portal Workflows
All workflows assume you are logged in with a CADC account


### Connecting to existing sessions

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will poll for and display any sessions you currently have
3) Clicking on a session icon will connect to and forward you to the session


### Launch a new session

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will poll for and display any sessions you currently have
3) Clicking on the '+' icon below the session list
4) A form will be displayed for gathering data for your session 
5) Select the type of session you want to launch (default is 'notebook')
6) The container image list will be updated for the session type
7) Optionally change the name of the session, and any available context values
(ie memory or # of cores)
8) Select 'Launch'
9) Science Portal will request the session be started, will add the session 
to the list at the top of the page. 


### Delete an existing session

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will poll for and display any sessions you currently have
3) Clicking on the 'X' icon at the top right of a session listing will bring
up a confirmation box. 
4) Continue to delete or cancel
5) Science Portal will request the session be deleted, will mark the session 
   as inaccessible in the list at the top of the page, polling Skaha until 
   the session is deleted, at which point it's removed from the list



