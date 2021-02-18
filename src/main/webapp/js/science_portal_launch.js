;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            launch: {
              PortalLaunch: PortalLaunch,
              // Events
              events: {
                onSessionRequestOK: new jQuery.Event('sciPort:onSessionRequestOK'),
                onSessionRequestFail: new jQuery.Event('sciPort:onSessionRequestFail'),
              }
            }
          }
        }
      }
    }
  })

  /**
   * Controller for Science Portal Launch UI.
   *
   * @constructor
   * @param {{}} inputs   Input configuration.
   *
   * where
   *  inputs = {
   *       baseURL: <URL app is launched from>
   *       sessionsResourceID: '<resourceID of session web service>'
    *    }
   */
  function PortalLaunch(inputs) {
    // PortalSession object is owned by PortalCore.
    // Session list, current session, etc. come from there
    var portalCore = new cadc.web.science.portal.core.PortalCore(inputs)
    var portalSessions = new cadc.web.science.portal.session.PortalSession(inputs)
    var _selfPortalLaunch = this

    // ------------ Page load functions ------------

    function init() {
      attachListeners()
      // Nothing happens if user is not authenticated, so no other page
      // load information is done until this call comes back (see onAuthenticated event below)
      portalCore.checkAuthentication()
    }

    function attachListeners() {
      // Button listeners
      $('#sp_reset_button').click(handleResetFormState)
      $('#session_request_form').submit(handleSessionRequest)

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onAuthenticated, function (e, data) {
        // onServiceURLOK comes from here
        // Contacts the registry to discover where the sessions web service is,
        // builds endpoints used in launch app
        portalCore.init()
      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLOK, function (e, data) {
        // This will forward to an existing session if it exists
        // Enforces 'one session per user' rule
        portalSessions.setServiceURLs(portalCore.sessionServiceURL)
        checkForSession()
      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLFail, function (e, data){
        // Unable to contact registry to get sessions web service URL
        portalCore.setProgressBar('error')
        portalCore.setInfoModal('Page Unavailable', 'Unable to establish session web service communication. '
          + 'Refresh to try again or contact CANFAR admin for assistance.', true, true)
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onFindSessionOK, function (e, data) {
        // This function display a 'helpful message' if the session status is not 'Running'
        forwardToSession(data)
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onFindSessionFail, function (e, data) {
        // No session found for currently authenticated user, so continue to form
        loadSoftwareStackImages()
        loadContext()
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onFindSessionError, function (e, request){
        // This should be triggered if the user doesn't have access to Skaha resources, as well as
        // other error conditions. Without access to Skaha, the user should be blocked from using the page,
        // but be directed to some place they can ask for what they need (a resource allocation.)
        portalCore.hideInfoModal(true)

        if (request.status == 403) {
          portalCore.setInfoModal('Skaha authorisation issue', portalCore.getRcDisplayText(request), true, true)
        } else {
          // There some other problem contacting the session service. Report the error
          portalCore.setAjaxFail(request)
        }
      })

      portalCore.subscribe(_selfPortalLaunch, cadc.web.science.portal.launch.events.onSessionRequestOK, function (e, sessionData) {
        // Start polling for session status to discover when/if the requested session comes up.
        // Function returns a Promise, so need .then and .catch here
        portalCore.setInfoModal('Waiting', 'Waiting for session startup', false, false)
        portalSessions.pollSessionStatus({}, 10000, 200)
          .then( function(runningSession) {
            forwardToSession(runningSession)
          })
          .catch(function (message) {
            portalCore.hideInfoModal(true)
            portalCore.handleAjaxError(message)
          })
      })

    }

    // ------------ Data display functions

    function populateSelect(selectID, optionData, placeholderText, defaultOptionID) {
      var $selectToAugment = $('#' + selectID)

      // Clear select content first
      $selectToAugment.empty()

      if (typeof optionalDefault == 'undefined') {
        // Add given placeholder text
        // TODO: change css to match this to name input colouring
        $selectToAugment.append('<option value="" selected disabled>' + placeholderText + '</option>')
      }

      // Build new list
      $(optionData).each(function () {
        var option = $('<option />')
        option.val(this.optionID)
        if (this.optionID == defaultOptionID ) {
          option.prop("selected", true)
        }
        option.html(this.name)
        $selectToAugment.append(option)
      });
    }

    /**
     * Intended to be run at page startup in order to enforce the 'one session per user' rule
     */
    function checkForSession() {
      portalCore.setInfoModal('Session Check', 'Checking for running session', false, false)
      // This is an ajax function that will fire either onFindSessionOK or onFindSessionFail
      // and listeners to those will respond accordingly
      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('busy')
      portalSessions.findCurrentSession()
    }

    function forwardToSession(curSession) {
      //portalCore.hideInfoModal(true)
      if (portalSessions.isRunningSession(curSession)) {
        portalCore.setProgressBar('okay')
        portalCore.setInfoModal('Connecting to Session', 'Connecting to existing session ' + curSession.name
          + ' (' + curSession.id + ')', false, false)
        // just forward people to next page, in this same window
        window.location.replace(curSession.connectURL);
      } else {
        portalCore.setProgressBar('error')
        portalCore.setInfoModal('Can\'t connect to session', 'An existing session was found, but is not running. (' +
          curSession.status + '). Try refreshing page to reconnect. Otherwise please contact CANFAR admin for assistance.', true, false);
      }
    }

    // ------------ HTTP/Ajax functions ------------
    // ---------------- POST ------------------

    /**
     * Submit button function
     * @param event
     */
    function handleSessionRequest(event) {
      // Stop normal form submit
      event.preventDefault()
      portalCore.clearAjaxAlert()
      var formData = gatherFormData()

      portalCore.setInfoModal('Requesting Session', 'Requesting new session', false, true)
      Promise.resolve(postSessionRequestAjax(portalCore.sessionServiceURL.session, formData))
        .then(function(sessionInfo) {
          portalCore.setProgressBar('okay')
          portalCore.hideInfoModal(true)
          portalCore.trigger(_selfPortalLaunch, cadc.web.science.portal.launch.events.onSessionRequestOK, sessionInfo)
        })
        .catch(function(message) {
          portalCore.handleAjaxError(message)
        })
    }

    function postSessionRequestAjax(serviceURL, sessionData) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = portalCore.parseJSONStr(request.responseText)
              resolve(jsonData)
            } else {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open('POST', serviceURL)
        request.send(sessionData)
      }) // end Promise

    }

    // Used in POST for /session endpoint
    function gatherFormData() {
      var _formdata = $('#session_request_form').serializeArray()
      var _prunedFormData = new FormData();

      _formdata.forEach(function(currentValue, index, arr) {
        _prunedFormData.append(currentValue.name, currentValue.value)
      })
      return _prunedFormData
    }


    // ---------------- GETs ----------------
    // ------- Dropdown Ajax functions

    function loadSoftwareStackImages() {
      portalCore.setInfoModal('Loading Images', 'Getting software stack list', false, true)
      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('busy')

      Promise.resolve(getImageListAjax(portalCore.sessionServiceURL.images + "?type=notebook", {}))
        .then(function(imageList) {
          portalCore.hideInfoModal(true)
          portalCore.setProgressBar('okay')

          if (imageList.length > 0) {

            var cores = imageList.availableCores
            var tempImageList = new Array()
            for (var i = 0; i < imageList.length; i++) {
              // each entry has id, type, digest, only 'id' is needed
              tempImageList.push({name: imageList[i].id, optionID: imageList[i].id})
            }
            populateSelect('sp_software_stack', tempImageList, 'select stack')
          } else {
            portalCore.setInfoModal('No Images found','No public Software Stack Images found for your username.')
          }

        })
        .catch(function(message) {
          portalCore.setInfoModal('Problem Loading Images', 'Problem loading software stack resources. '
            + 'Try to reset the form to reload.', true, false)
          portalCore.handleAjaxError(message)
        })
    }

    function getImageListAjax(serviceURL, sessionData) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = portalCore.parseJSONStr(request.responseText)
              resolve(jsonData)
            } else {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open('GET', serviceURL)
        request.send(null)
      })
    }

    function loadContext() {
      // go to /context endpoint and then populate the sp_cores and sp_memory dropdowns
      portalCore.setInfoModal('Loading Context Resources', 'Getting current context resources', false, true)

      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('busy')

      var tmpServiceURL = portalCore.sessionServiceURL.context

      Promise.resolve(getCurrentContextAjax(tmpServiceURL, {}))
        .then(function(curContext) {
          portalCore.hideInfoModal(true)
          portalCore.setProgressBar('okay')

          var cores = curContext.availableCores
          var tempCoresSelectData = new Array()
          for (var i=0; i< cores.length; i++) {
            tempCoresSelectData.push({name: cores[i], optionID: cores[i]})
          }
          populateSelect('sp_cores', tempCoresSelectData, 'select # cores', curContext.defaultCores)

          var memory = curContext.availableRAM
          var tempMemorySelectData = new Array()
          for (var i=0; i< memory.length; i++) {
            tempMemorySelectData.push({name: memory[i], optionID: memory[i]})
          }
          populateSelect('sp_memory', tempMemorySelectData, 'select RAM', curContext.defaultRAM)
        })
        .catch(function(message) {
          portalCore.setInfoModal('Problem Loading Context', 'Problem loading server context resources. '
            + 'Try to reset the form to reload.', true, false)
          portalCore.handleAjaxError(message)
        })
    }

    function getCurrentContextAjax(serviceURL, sessionData) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = portalCore.parseJSONStr(request.responseText)
              resolve(jsonData)
            } else {
              reject(request)
            }
          },
          false
        )
        // withCredentials enables cookies to be sent
        // Note: SameSite cookie header isn't set with this method,
        // may cause problems with Chrome and other browsers? Feb 2021
        request.withCredentials = true
        request.open('GET', serviceURL)
        request.send(null)
      }) // end Promise
    }

    function handleResetFormState(event) {
      event.preventDefault()
      // Clear messages
      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('okay')

      // Clear form, refresh context and image list
      // clear name field
      $('#sp_session_name').val('')

      // reload the dropdowns with the latest info
      loadSoftwareStackImages()
      loadContext()
    }

    $.extend(this, {
      init: init
    })
  }

})(jQuery)
