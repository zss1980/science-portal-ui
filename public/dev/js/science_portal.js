;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            PortalApp: PortalApp,
            // Events
            events: {
              onSessionRequestOK: new jQuery.Event("sciPort:onSessionRequestOK"),
              onSessionRequestFail: new jQuery.Event("sciPort:onSessionRequestFail"),
            }
          }
        }
      }
    }
  })

  /**
   * Controller for Science Portal UI. Contains event management backbone for the form, session list
   * and error handling. Behaviour of page is controlled from here, including showing and hiding
   * various page elements which are included in the index.jsp file for the project.
   * Individual session list items are built dynamically within this code.
   *
   * @constructor
   * @param {{}} inputs   Input configuration.
   *
   * where
   *  inputs = {
   *       baseURL: <URL app is launched from>
   *       sessionsResourceID: "<resourceID of session web service>"
    *    }
   */
  function PortalApp(inputs) {
    var _reactApp = window.SciencePortalApp

    inputs.reactApp = _reactApp
    //var portalLogin = new cadc.web.login.PortalLogin(inputs)
    var portalCore = new cadc.web.science.portal.core.PortalCore(inputs)
    var portalSessions = new cadc.web.science.portal.session.PortalSession(inputs)
    var portalForm = new cadc.web.science.portal.form.PortalForm(inputs)

    var _selfPortalApp = this

    this.baseURL = inputs.baseURL

    // This folder is the location of config json and other assets
    // Variable to support the dev and dist environments
    var contentBase = inputs.contentBase

    this.isDev = false
    if (typeof inputs.isDev !== "undefined") {
      this.isDev = inputs.isDev
    }

    // NOTE: this is for dev or situations where a registry app
    // might not be available
    var URLOverrides = inputs.URLOverrides

    this.isPolling = false
    var _state = {
      currentSessionData: {}
    }
    var _curSessionType

    // ------------ Page load functions ------------

    function init() {
      attachListeners()
      // loads from session_type_map_en.json.
      // Timing issues can occur on very fast systems, so this issues it's own
      // event when finished to control when the next stage of portal initialization occurs
      portalCore.setHeaderURLs()
      portalForm.setContentBase(contentBase)
      portalForm.loadSessionTypeMap()
    }

    function continueInit() {
      portalSessions.setSessionTypeList(portalForm.getSessionTypeList())

      // Put this up because the authentication step can be a bit tardy, otherwise
      // it looks like the portal isn't doing anything.
      portalCore.setModal(_reactApp, "Initializing", "Validating credentials", true, false, false)
      portalCore.initConfirmModal(_reactApp, handleConfirmedDelete, handleCancelDelete)

      if (typeof inputs.bannerText !== "undefined") {
        _reactApp.setBanner(inputs.bannerText)
      }

      // Nothing happens if user is not authenticated, so no other page
      // load information is done until this call comes back (see onAuthenticated event below)
      // onAuthenticated event triggered if everything is OK.
      portalCore.checkAuthentication(_selfPortalApp.isDev)
    }

    function attachListeners() {
      // Button/page click listeners
      $(".sp-session-reload").click(checkForSessions)

      // Data Flow/javascript object listeners
      // portalCore listeners
      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onAuthenticated, function (e, data) {
        // onServiceURLOK comes from here
        // Contacts the registry to discover where the sessions web service is,
        // builds endpoints used to manage sessions, get session, context, image lists, etc.
        portalCore.init(URLOverrides)
      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLOK, function (e, data) {
        portalSessions.setServiceURLs(portalCore.sessionServiceURLs)
        portalForm.setServiceURLs(portalCore.sessionServiceURLs)

        portalForm.setDataFilters(portalCore.dataFilters)

        // Get portalForm to start collecting form data
        portalForm.getFormData()

        // Get global session statistics
        portalSessions.loadGlobalStats()

        // Start loading session lists
        checkForSessions()


      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLFail, function (e, data){
        // Unable to contact registry to get sessions web service URL
        portalCore.setPageState(portalCore.pageSections.all,"danger", false)

        portalCore.setModal(_reactApp, "Portal Unavailable",
          "Unable to establish communication with Skaha web service. "
            + "Reload page to try again or contact CANFAR admin for assistance.",
          false, true, true)
      })


      // portalSessions listeners
      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadSessionListDone, function (e) {
        // Build session list on top of page
        var filteredList = portalSessions.getFilteredSessionList()
        populateSessionList(filteredList)
        portalCore.setPageState(portalCore.pageSections.sessionList, "success", false)
        portalCore.hideModal(_reactApp)

        if (( _selfPortalApp.isPolling === false)
          && (portalSessions.isAllSessionsStable() === false) ){

          // Flag polling is occurring so only one instance is running at a time.
          // Any changes in session list will be picked up by the single polling instance
          _selfPortalApp.isPolling = true

          // If everything is stable, stop. If no, kick off polling
          portalSessions.pollSessionList(8000)
            .then(function (finalState) {
              if (finalState == "done") {
                // Grab new session list
                var filteredList = portalSessions.getFilteredSessionList()
                populateSessionList(filteredList)
              }
            })
            .catch(function (message) {
              portalCore.setModal(_reactApp, "Error getting session list",
                "Unable to get session list. " +
                "Reload the page to try again, or contact CANFAR admin for assistance.",
                false, true, true)
            })

          _selfPortalApp.isPolling = false
        }
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onPollingContinue, function (e) {
        // Rebuild session list on top of page
        var filteredList = portalSessions.getFilteredSessionList()
        populateSessionList(filteredList)
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadSessionListError, handleServiceError)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onSessionActionDone, refreshSessionForm)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onSessionActionError, handleSessionActionError)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadGlobalStatsDone, populateGlobalStats)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadGlobalStatsError, handleSessionActionError)

      // Listeners for this class (science_portal.js)
      portalCore.subscribe(_selfPortalApp, cadc.web.science.portal.events.onSessionRequestOK, refreshSessionForm)

      // Portal Form listeners
      portalCore.subscribe(portalForm, cadc.web.science.portal.form.events.onLoadFormDataDone, initForm)
      portalCore.subscribe(portalForm, cadc.web.science.portal.form.events.onLoadTypeMapDone, continueInit)
      portalCore.subscribe(portalForm, cadc.web.science.portal.form.events.onLoadContextDataError, handleServiceError)
      portalCore.subscribe(portalForm, cadc.web.science.portal.form.events.onLoadImageDataError, handleServiceError)


    } // end attachListeners()

    function handleServiceError(e, request) {

      // Stop any outstanding ajax calls from being processed. If one has failed,
      // it's assumed the skaha service is unreachable or has something else wrong,
      // so the page becomes unavailable
      portalForm.interruptAjaxProcessing()

      // This should be triggered if the user doesn't have access to Skaha resources, as well as
      // other error conditions. Without access to Skaha, the user should be blocked from using the page,
      // but be directed to some place they can ask for what they need (a resource allocation.)
      var msgHeader = "Service Error"
      var msgBody = portalCore.getRcDisplayText(request)
      if (request.status === 403 || request.status === 401) {
        msgHeader = "Skaha authorization issue"
        msgBody = "Your userid is not authorized to use Skaha resources. Contact CANFAR admin for assistance."
      }
      portalCore.setModal(_reactApp, msgHeader, msgBody, false, true, true)
    }

    function handleSessionActionError(e, request) {
      // portalCore.setSessionActionAjaxFail(request)
      portalCore.setAjaxFail(portalCore.pageSections.sessionList, request)
    }

    function refreshSessionForm() {
      _curSessionType = portalForm.getSessionTypeDefault()
      setLaunchForm(_curSessionType)
      checkForSessions()
    }

    // ------------ Data display functions

    function populateGlobalStats() {
      var globalStats = portalSessions.getGlobalStats()

      // pass globalStats to the react App for rendering
      _reactApp.updateGlobalStats(globalStats)
    }

    function populateSessionList(sessionData) {
      var $sessionListDiv = $("#sp_session_list")

      if (JSON.stringify(sessionData) === "[]") {
        // Pass list to the react app portion for rendering
        var sessDataObj = {
          "listType" : "empty",
          "sessData" : []
        }
        var currentState = _reactApp.updateSessionList(sessDataObj)
      } else {

        // Build new list
        // Assuming a list of sessions is provided, with connect url, name, type
        var newSessionList = new Array()
        $(sessionData).each(function () {

          var mapEntry = portalForm.getMapEntry(this.type)
          // Check to see if there are any items in the sessionType_map that
          // may override the defaults
          var iconSrc= _selfPortalApp.baseURL + "/science-portal/images/"
          if (mapEntry != null) {
            if (typeof mapEntry.portal_icon != "undefined") {
              iconSrc += mapEntry.portal_icon
            } else {
              iconSrc += "fas_cube.png"
            }

            // Default is the type. May be overridden in the sessiontype_map_en.json file
            var iconLabel = this.type
            if (typeof mapEntry.portal_text != "undefined") {
              iconLabel = mapEntry.portal_text
            }
          }

          // TODO: fill in actual RAM & cores values from /session endpoint
          // once that update is available. Jan 2023: they are not displayed
          // on the SessionItem cards currently.

          var nextSessionItem = {
            "id" : this.id,
            "name" : this.name,
            "status": this.status,
            "logo": iconSrc,
            "image": portalCore.dataFilters.imageName(this.image),
            "requestedRAM": this.requestedRAM,
            "ramInUse": this.ramInUse,
            "requestedCPUCores": this.requestedCPUCores,
            "coresInUse": this.coresInUse,
            "altText": iconLabel,
            "connectURL": this.connectURL,
            "startTime": portalCore.dataFilters.startTime(this.startTime),
            "expiryTime": portalCore.dataFilters.startTime(this.expiryTime),
            "type" : this.type,
            "deleteHandler": handleDeleteSession,
            "connectHandler": handleConnectRequest,
            "renewHandler": handleRenewSession
          }

          // Add to the list
          newSessionList.push(nextSessionItem)

        })

        // Pass list to the react app portion for rendering
        var sessDataObj = {
          "listType" : "list",
          "sessData" : newSessionList
        }
        var currentState = _reactApp.updateSessionList(sessDataObj)
        var todo='remove me'
      }
    }


    function checkForSessions() {
      portalCore.setModal(_reactApp,"Session Check", "Fetching session list", true, false, false)
      portalCore.clearAjaxAlert(portalCore.pageSections.sessionList)
      portalCore.setPageState(portalCore.pageSections.sessionList, "success", true)
      portalSessions.loadSessionList()
    }


    // ------------ Event Handlers ------------

    /**
     * Instead of going directly to the session, check to make sure it's in 'Running' state first.
     * @param curSession
     */
    function handleConnectRequest(event, data) {
      event.preventDefault()
      // Pull data-* information from anchor element
      var sessionData = $(event.currentTarget).data()
      portalCore.setPageState(portalCore.pageSections.all,"success", false)
      window.open(sessionData.connecturl, "_blank")
    }

    /**
     * Triggered from "Reload" button on info modal
     */
    function handlePageRefresh() {
      window.location.reload()
    }

    /**
     * Triggered from delete element on individual session
     */
    function handleDeleteSession(event) {
      event.preventDefault()
      portalCore.clearAjaxAlert(portalCore.pageSections.sessionList)
      var sessionData = event.currentTarget.dataset
      _state.currentSessionData = sessionData
      portalCore.setConfirmModal(_reactApp, handleConfirmedDelete, sessionData)
    }

    /**
     * Triggered from the delete modal
     */
    function handleConfirmedDelete(event) {
      var sessionData = _state.currentSessionData
      portalCore.hideConfirmModal(_reactApp)
      portalCore.setModal(_reactApp, "Delete Request", "Deleting session", true, false, false)
      portalSessions.deleteSession(sessionData.id)
    }

    /**
     * Triggered from the delete modal
     */
    function handleCancelDelete(event) {
      portalCore.hideConfirmModal(_reactApp)
    }

    /**
     * Triggered from the renew icon on a session card
     */
    function handleRenewSession(event) {
      portalCore.clearAjaxAlert(portalCore.pageSections.sessionList)
      var sessionData = event.currentTarget.dataset
      portalCore.setModal(_reactApp, "Renew Session Request", "Extending session time", true, false, false)
      portalSessions.renewSession(sessionData.id)
    }



    // ------------ HTTP/Ajax functions & event handlers ------------
    // ---------------- POST ------------------

    /**
     * Submit button function
     * @param event
     */
    function handleSessionRequest(event) {
      // Stop normal form submit
      event.preventDefault()
      portalCore.clearAjaxAlert(portalCore.pageSections.form)

      var _prunedFormData = new FormData();

      for (var i=0; i< event.target.length; i++) {
        var currentValue = event.target[i]
        _prunedFormData.append(currentValue.name, currentValue.value)
        console.log(currentValue.name + ": " + currentValue.value)
      }

      portalCore.setModal(_reactApp, "Requesting Session", "Requesting new session", true, false, false)
      Promise.resolve(postSessionRequestAjax(portalCore.sessionServiceURLs.session, _prunedFormData))
        .then(function(sessionInfo) {
          portalCore.setPageState(portalCore.pageSections.form,"success", false)
          portalCore.hideModal(_reactApp)
          portalCore.trigger(_selfPortalApp, cadc.web.science.portal.events.onSessionRequestOK, sessionInfo)
        })
        .catch(function(request) {
          portalCore.handleAjaxError(portalCore.pageSections.form, request)
        })
    }

    function postSessionRequestAjax(serviceURL, sessionData) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // "load" is the XMLHttpRequest "finished" event
        request.addEventListener(
          "load",
          function () {
            if (request.status === 200) {
              // Session ID and data from server not returned with
              // this request. Use the name & type posted in form
              // to identify this request going forward
              resolve({"name": sessionData.get("name"), "type": sessionData.get("type")})
            } else if (request.status === 400) {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open("POST", serviceURL)
        request.send(sessionData)
      }) // end Promise

    }

    // ---------------- Launch form handling functions ----------------

    // This can only happen after the portalForm has grabbed all the data
    // triggered when onLoadFormDataDone is issued
    function initForm() {
      //_curSessionType = portalForm.getSessionTypeDefault()
      //setLaunchForm(_curSessionType)
      resetLaunchForm()
    }

    function buildFormDataForType(sType) {
      var defaultName = portalSessions.getDefaultSessionName(sType.trim())
      var formDataForType = portalForm.getFormDataForType(sType, defaultName)
      // Q: not sure what happens with the old handlers, are they GCd correctly?
      // Consider having handlers submitted as props, and only the variable
      // parts of the form - dropdown content, set as state values
      formDataForType.submitHandler = handleSessionRequest
      formDataForType.changeTypeHandler = setLaunchFormForType
      formDataForType.resetHandler = resetLaunchForm
      return formDataForType
    }

    function setLaunchForm(curType) {
      var fData = buildFormDataForType(curType)
      _reactApp.updateLaunchForm(fData)
    }

    function resetLaunchForm() {
      portalCore.clearAjaxAlert()
      _curSessionType = portalForm.getSessionTypeDefault()
      setLaunchForm(_curSessionType)
    }

    function setLaunchFormForType(e) {
      e.preventDefault()
      var sessionType = e.target.value
      setLaunchForm(sessionType)
      _curSessionType = sessionType
    }

    // TODO: this is for testing only
    function sortSessionList(theList) {
      return portalSessions.sortSessions(theList)
    }

    $.extend(this, {
      init: init,
      sortSessionList: sortSessionList,
      portalCore: portalCore
    })
  }

})(jQuery)
