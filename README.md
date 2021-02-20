# CANFAR Science Portal
### V 1.0
#####Feb 2021

UI for launching and connecting to Jupyter notebook sessions that back onto CANFAR resources. 

## Description
This CANFAR service provides the ability to connect to and launch Jupyter notebook sessions that back
on to CANFAR resources. Using Software Stack images and current system resource values (context) provided by Skaha, you can
launch a session using the image you select powered with the amount of memory and number of cores you designate. 

## Endpoint locations
All endpoints require authentication with CANFAR, and authorization to access Skaha resource allocations.

Science Portal Session Launch
http://www.canfar.net/science-portal/launch

## Skaha Web Service
Skaha provides Science Portal with access to Jupyter Notebook sessions. 

More information can be found in the swagger docs: https://ws-uv.canfar.net/skaha

## CANFAR Science Portal Workflow

### Launching and Connecting to Notebook sessions

1) Log in with a CADC account (Authenticate)
2) If you have a currently running session, Science Portal will attempt to connect and forward to it.
3) If you do not have a currently running session, Science Portal will display a form where
you can select the Software Stack image, amount of memory (RAM) and number of cores, designate
a name and launch a session.
4) Science Portal will poll for 30 seconds, attempting to connect to the session after Skaha 
says it is in 'Running' state. 

### Deleting sessions
This can be done from within the session, or via curl directly to the Skaha web service. (See the swagger
docs link above.)

