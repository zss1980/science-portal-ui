# CANFAR Science Portal
### V 3.2
##### Jan 30, 2023

UI for accessing and managing Jupyterlab notebooks, carta, desktop and other interactive sessions that back onto CANFAR resources.

Platform Usage information is available, including current CPU usage and counts of running instances.

## Description
This CANFAR service provides the ability to access and manage Jupyter notebook, desktop (vnc), and carta sessions that back
on to CANFAR resources. Using container images and current system resource values (context) provided by Skaha, you can
launch and manage sessions using the container image you select. Contextualization is provided for some session types 
allowing the amount of memory and number of cores you designate to be used to power your session. 

## Endpoint locations
All endpoints require authentication with CANFAR, and authorization to access Skaha resource allocations.

### Science Portal URL
https://www.canfar.net/science-portal

### Skaha Web Service
Skaha provides Science Portal with access to supported session types (Jupyter notebooks, desktop (vnc) and carta)
More information can be found in the swagger docs: https://ws-uv.canfar.net/skaha

## CANFAR Science Portal Workflows
All workflows assume you are logged in with a CADC account


### Connecting to existing sessions

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will display any sessions you currently have, including
session metadata
3) Clicking on a session card will connect to and forward you to the session


### Launch a new session

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will poll for and display any sessions you currently have
3) After the form has loaded, scroll down to access 
4) Select the type of session you want to launch (default is 'notebook')
5) The container image list will be updated for the session type
6) Optionally change the name of the session, and any available context values
(ie memory or # of cores) 
7) Select 'Launch'
8) Science Portal will request the session be started 
9) The new session wil be added to the list at the top of the page


### Delete an existing session

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will display any sessions you currently have
3) Clicking on the trash can icon on a session card will bring
up a confirmation box
4) Continue to delete or cancel
5) Science Portal will request the session be deleted, and will remove it
from your session list


### Renew time frame of an existing session

1) From the main page: https://www.canfar.net/science-portal
2) Science Portal will display any sessions you currently have
3) Click on the clock icon on a session card
4) Science Portal will request the session time frame be renewed
(as of v 3.1, this is a 2 week extension from the time the request
is submitted.)
5) Session metadata will be refreshed on the portal

### View and Refresh Platform Usage

1) From the main page: https://www.canfar.net/science-portal
2) The lower right panel (or last panel in mobile mode) displays Platform Usage information
3) In the header, click the refresh button to refresh values
4) A date stamp in lower right of the panel indicates the time of the last refresh
