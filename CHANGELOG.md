

## Nov 4, 2022
### 2.2
Supporting Changes
- rework of code, launch form is in own class now to promote component
architecture of the javascript cdoe. 
- form data caching performed (so no ajax calls during form interaction,)
and data load occurs in a staged manner at page load in an attempt to
upgrade user experience of the page.

User-facing changes
- new modal added to show when user credentials are being authenticated (at page load it 
could look suspiciously like nothing was happening.)
- launch form button is disabled until form data is available
- launch form data is cached so the form should be far more responsive

## May 10, 2022
### 2.1
Minor changes
- Added 'contributed' session type

## April 9, 2021
### 2.0
Major changes
- Adding list of available sessions
- Support multiple session types (notebook, desktop, carta)
- Ability to delete sessions through UI




