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
              onSessionRequestOK: new jQuery.Event('sciPort:onSessionRequestOK'),
              onSessionRequestFail: new jQuery.Event('sciPort:onSessionRequestFail'),
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
   *       sessionsResourceID: '<resourceID of session web service>'
    *    }
   */
  function PortalApp(inputs) {
    var portalCore = new cadc.web.science.portal.core.PortalCore(inputs)
    var portalSessions = new cadc.web.science.portal.session.PortalSession(inputs)
    var portalForm = new cadc.web.science.portal.form.PortalForm(inputs)
    var _selfPortalApp = this
    this.baseURL = inputs.baseURL
    this.isPolling = false

    // Used for populating type dropdown and displaying appropriate form fields
    // per session type
    //var _sessionTypeMap

    // Complete list of form fields available
    var _launchFormFields = ['name', 'type', 'image', 'memory', 'cores']
    var _curSessionType

    // ------------ Page load functions ------------

    function init() {
      attachListeners()
      // loads from session_type_map_en.json. No known timing issues
      portalForm.loadSessionTypeMap()

      // add tooltips
      $('[data-toggle="tooltip"]').tooltip()
      
      // Nothing happens if user is not authenticated, so no other page
      // load information is done until this call comes back (see onAuthenticated event below)
      // onAuthenticated event triggered if everything is OK.
      // Put this up because the authentication step can be a bit tardy, otherwise
      // it looks like the portal isn't doing anything.
      portalCore.setInfoModal('Initialising', 'Validating credentials',
        false, true, true)
      portalCore.checkAuthentication()
    }

    function attachListeners() {
      // Button/page click listeners
      $('.sp-add-session').click(handleAddSession)
      $('.sp-session-reload').click(checkForSessions)

      // These elements are on the icons in the session list
      $('.sp-session-connect').click(handleConnectRequest)

      // These elements are on the session launch form
      $('#sp_reset_button').click(handleResetFormState)
      $('#session_request_form').submit(handleSessionRequest)
      $('#sp_session_type').change(function(){
        setLaunchFormForType($(this).val(), false)
      })

      // This element is on the info modal
      $('#pageReloadButton').click(handlePageRefresh)

      // This element is on the delete modal
      $('#delete_session_button').click(handleConfirmedDelete)
      $('#delete_cancel').click(handleCancelDelete)
      $('.sp-close-delete-modal').click(handleCancelDelete)

      // Data Flow/javascript object listeners
      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onAuthenticated, function (e, data) {
        // onServiceURLOK comes from here
        // Contacts the registry to discover where the sessions web service is,
        // builds endpoints used to manage sessions, get session, context, image lists, etc.
        portalCore.init()
      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLOK, function (e, data) {
        // This will forward to an existing session if it exists
        // Enforces 'one session per user' rule
        portalSessions.setServiceURLs(portalCore.sessionServiceURLs)
        portalForm.setServiceURLs(portalCore.sessionServiceURLs)

        // Get portalForm to start collecting form data
        portalForm.getFormData()

        // Start loading session lists
        checkForSessions()
      })

      portalCore.subscribe(portalCore, cadc.web.science.portal.core.events.onServiceURLFail, function (e, data){
        // Unable to contact registry to get sessions web service URL
        portalCore.setProgressBar('error')
        portalCore.setInfoModal('Page Unavailable', 'Unable to establish communication with Skaha web service. '
          + 'Reload page to try again or contact CANFAR admin for assistance.', true, false, false)
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadSessionListDone, function (e) {
        // Build session list on top of page
        populateSessionList(portalSessions.getSessionList())
        portalCore.setProgressBar("okay")
        portalCore.hideInfoModal(true)

        if (( _selfPortalApp.isPolling === false)
          && (portalSessions.isAllSessionsStable() === false) ){

          // Flag polling is occurring so only one instance is running at a time.
          // Any changes in session list will be picked up by the single polling instance
          _selfPortalApp.isPolling == true

          // If everything is stable, stop. If no, kick off polling
          portalSessions.pollSessionList(8000)
            .then(function (finalState) {
              if (finalState == 'done') {
                // Grab new session list
                populateSessionList(portalSessions.getSessionList())
              }
            })
            .catch(function (message) {
              portalCore.setInfoModal('Error getting session list',
                'Unable to get session list. ' +
                'Reload the page to try again, or contact CANFAR admin for assistance.', true, false, false)
            })

          _selfPortalApp.isPolling = false
        }
      })


      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onLoadSessionListError, function (e, request){
        // This should be triggered if the user doesn't have access to Skaha resources, as well as
        // other error conditions. Without access to Skaha, the user should be blocked from using the page,
        // but be directed to some place they can ask for what they need (a resource allocation.)

        if (request.status == 403) {
          portalCore.setInfoModal('Skaha authorization issue', portalCore.getRcDisplayText(request), true, false, false)
        } else {
          // There some other problem contacting the session service. Report the error
          portalCore.setAjaxFail(request)
        }
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onPollingContinue, function (e) {
        // Rebuild session list on top of page
        populateSessionList(portalSessions.getSessionList())
      })

      portalCore.subscribe(_selfPortalApp, cadc.web.science.portal.events.onSessionRequestOK, function (e, sessionData) {
        // hide launch form
        showLaunchForm(false)
        checkForSessions()
      })

      portalCore.subscribe(portalSessions, cadc.web.science.portal.session.events.onSessionDeleteOK, function (e, sessionID) {
        portalCore.hideInfoModal(true)
        checkForSessions()
      })


      // TODO: make sure this works somehow - try triggering it in
      // a situation where the context call works?
      // If this method does work, change the sesion list error to use it as well
      // This should only happen once during a page load
      portalCore.subscribe(portalForm, cadc.web.science.portal.form.events.onLoadFormDataDone, initForm)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.form.events.onLoadContextDataError, handleServiceError)
      portalCore.subscribe(portalSessions, cadc.web.science.portal.form.events.onLoadImageDataError, handleServiceError)

    } // end attachListeners()


    function handleServiceError(e, request) {
      // This should be triggered if the user doesn't have access to Skaha resources, as well as
      // other error conditions. Without access to Skaha, the user should be blocked from using the page,
      // but be directed to some place they can ask for what they need (a resource allocation.)

      if (request.status == 403) {
        portalCore.setInfoModal('Skaha authorization issue', portalCore.getRcDisplayText(request), true, false, false)
      } else {
        // There some other problem contacting the session service. Report the error
        portalCore.setAjaxFail(request)
      }
    }

    // ------------ Data display functions

    function populateSessionList(sessionData) {
      var $sessionListDiv = $('#sp_session_list')

      // Clear listeners
      $('.sp-session-connect').off('click')
      $('.sp-session-delete').off('click')

      // Clear session list
      $sessionListDiv.empty()

      // Make new list from sessionData
      var $unorderedList = $('<ul />')
      $unorderedList.prop('class', 'nav nav-pills')

      if (JSON.stringify(sessionData) === '{}') {
        // Put 'New Session' button last.
        var $listItem = $('<li />')
        $listItem.prop('class', 'sp-session-link sp-session-add')

        var listItemHTML = '<a href="#" class="sp-session-link sp-session-add">' +
          '<i class="service-link"></i>' +
          '<div class="sp-session-help-text">Select \'+\' to launch a session</div>' +
          '</a> </li>'
        $listItem.html(listItemHTML)
        $unorderedList.append($listItem)
        $sessionListDiv.append($unorderedList)
      } else {

        // Build new list
        // Assuming a list of sessions is provided, with connect url, name, type
        $(sessionData).each(function () {

          var $listItem = $('<li />')
          $listItem.prop('class', 'sp-session-link')

          // $itemContainer holds: both the
          // - linkItem with the connect affordance (session type & logo)
          // - delete affordance
          // - potentially a 'blockingDiv' that puts a panel
          // over the linkItem, blocking access when the session
          // isn't Running.
          var $itemContainer = $('<div />')
          $itemContainer.prop('class', 'sp-link-container')

          if (this.status != 'Running') {
            // Add the blocking div
            var $blockingDiv = $('<div />')
            $blockingDiv.prop('class', 'sp-link-disable')
            $itemContainer.append($blockingDiv)
            $blockingDiv.html(this.status)
          }

          // delete button
          var $buttonDiv = $('<div />')
          $buttonDiv.prop('class', 'sp-session-ctl sp-b-tooltip')

          var $deleteButton = $('<button/>')
          // add session data to delete button so it can be
          // sent on click to the delete handler
          $deleteButton.attr('data-id', this.id)
          $deleteButton.attr('data-name', this.name)
          $deleteButton.prop('class', 'fas fa-times sp-session-delete')
          $deleteButton.attr('data-toggle', 'tooltip')
          $deleteButton.attr('title', 'delete session')
          $buttonDiv.append($deleteButton)
          $itemContainer.append($buttonDiv)

          var $anchorDiv = $('<div />')
          $anchorDiv.prop('class', 'sp-session-anchor')

          var $anchorItem = $('<a />')
          $anchorItem.prop('href', '')
          $anchorDiv.append($anchorItem)

          // get display data from _sessiontype_map
          var mapEntry = portalForm.getMapEntry(this.type)
          var $iconItem
          $iconItem = $('<img />')

          // Defaults allow new session types to be added to skaha
          // prior to them being added to science-portal UI.
          // Values from sessionTypeMap override defaults
          // Use fontawesome cube as default if nothing provided in map
          var iconClass = 'fas fa-cube sp-icon-desktop'

          // session type is default label
          var iconLabel = this.type

          // Check to see if there are any items in the sessionType_map that
          // may override the defaults
          if (mapEntry != null) {
            if (typeof mapEntry.portal_icon != 'undefined' ) {
              $iconItem.prop('src', _selfPortalApp.baseURL + '/science-portal/images/' + mapEntry.portal_icon)
              iconClass = 'sp-icon-img'
            }

            if (typeof mapEntry.portal_fa_class != 'undefined' ){
              // Use a fontawesome icon by applying the class name
              iconClass = mapEntry.portal_fa_class
            }

            if (typeof mapEntry.portal_text != 'undefined' ) {
              iconLabel = mapEntry.portal_text
            }
          }

          $anchorItem.attr('data-connecturl', this.connectURL)
          $anchorItem.attr('data-status', this.status)
          $anchorItem.attr('data-id', this.id)
          $anchorItem.attr('data-name', this.name)
          $anchorItem.prop('class', 'sp-session-connect')

          $iconItem.prop('class', iconClass)

          var $nameItem = $('<div />')
          $nameItem.prop('class', 'sp-session-link-type')
          $nameItem.html(iconLabel)

          $anchorItem.append($iconItem)
          $anchorItem.append($nameItem)

          $itemContainer.append($anchorDiv)
          $listItem.append($itemContainer)

          // Add session name to bottom of control
          var $titleItem = $('<div />')
          $titleItem.prop('class', 'sp-session-name')
          $titleItem.html(this.name)
          $listItem.append($titleItem)

          $unorderedList.append($listItem)
        })
        $sessionListDiv.append($unorderedList)
        $('.sp-session-connect').on('click', handleConnectRequest)
        $('.sp-session-delete').on('click', handleDeleteSession)

        // add tooltips
        $('[data-toggle="tooltip"]').tooltip()
      }
    }

    /**
     * This function provides a default session name that integrates
     * the number of sessions of that type. Name can be overridden by user
     * in the launch form.
     * @param sessionType
     */
    function setDefaultSessionName(sessionType) {
      var sessionName = portalSessions.getDefaultSessionName(sessionType)
      $('#sp_session_name').val(sessionName)
    }

    function setFormFields(sessionType) {
      var mapEntry = portalForm.getMapEntry(sessionType)
      if (mapEntry != null) {
        var formList = mapEntry.form_fields

        // go through full form list, and if an item in the full list
        // is not included in type formList, then set it to hidden. otherwise show it
        for (var j = 0; j < _launchFormFields.length; j++) {
          if (formList.indexOf(_launchFormFields[j]) == -1) {
            $('.sp-form-' + _launchFormFields[j]).addClass('hidden')
          } else {
            $('.sp-form-' + _launchFormFields[j]).removeClass('hidden')
          }
        }
      } else {
        // report error - the session type provided isn't configured for
        // the version of science portal being used.
        portalCore.setProgressBar('error')
        portalCore.setInfoModal('Invlaid session type', 'Session type not found. '
          + 'Reload this page to try again. ', true, false, false)
      }

    }

    function populateSelect(selectID, optionData, placeholderText, defaultOptionID) {
      var $selectToAugment = $('#' + selectID)

      // Clear select content first
      $selectToAugment.empty()

      if (typeof optionalDefault == 'undefined') {
        // Add given placeholder text
        $selectToAugment.append('<option value="" selected disabled>' + placeholderText + '</option>')
      }

      // Build new list
      for (i=0; i<optionData.length; i++) {
        var curOption = optionData[i]
        var option = $('<option />')
        option.val(curOption)
        if (curOption === defaultOptionID ) {
          option.prop('selected', true)
        }
        option.html(curOption)
        $selectToAugment.append(option)
      }
    }


    function checkForSessions() {
      portalCore.setInfoModal('Session Check', 'Grabbing session list', false, false)
      // This is an ajax function that will fire either onFindSessionOK or onFindSessionFail
      // and listeners to those will respond accordingly
      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('busy')
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
      portalCore.setProgressBar('okay')
      window.open(sessionData.connecturl, '_blank')
    }

    /**
     * Triggered from 'Reload' button on info modal
     */
    function handlePageRefresh() {
      window.location.reload()
    }

    function showLaunchForm(show) {
      if (show === true) {
        $('#sp_launch_form_div').removeClass('hidden')
      } else {
        $('#sp_launch_form_div').addClass('hidden')
      }
    }

    /**
     * Triggered from '+' button on session list button bar
     */
    function handleAddSession() {
      // TODO: this might not be needed
      // populate the dropdown lists
      //populateForm();

      // Show the launch form
      showLaunchForm(true)
    }

    function showHideLaunchButton() {
      $('.sp-add-session').click(handleAddSession)
    }

    /**
     * Triggered from 'X' button on individual session
     */
    function handleDeleteSession(event) {
      var sessionData = $(event.currentTarget).data()
      portalCore.setConfirmModal("Session name " + sessionData.name + ", id " + sessionData.id, sessionData)
    }

    /**
     * Triggered from the delete modal
     */
    function handleConfirmedDelete(event) {
      var sessionData = $(event.currentTarget).data()
      portalCore.hideConfirmModal(true)
      portalCore.setInfoModal("Delete Request", "Deleting session " + sessionData.name + ", id " + sessionData.id, false, false, true)
      portalSessions.deleteSession(sessionData.id)
    }

    /**
     * Triggered from the delete modal
     */
    function handleCancelDelete(event) {
      portalCore.hideConfirmModal(true)
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
      portalCore.clearAjaxAlert()
      var formData = gatherFormData()

      portalCore.setInfoModal('Requesting Session', 'Requesting new session', false, true, true)
      Promise.resolve(postSessionRequestAjax(portalCore.sessionServiceURLs.session, formData))
        .then(function(sessionInfo) {
          portalCore.setProgressBar('okay')
          portalCore.hideInfoModal(true)
          portalCore.trigger(_selfPortalApp, cadc.web.science.portal.events.onSessionRequestOK, sessionInfo)
        })
        .catch(function(request) {
          portalCore.handleAjaxError(request)
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


    // This can only happen after the portalForm has grabbed all the data
    function initForm() {

      // notebook is default
      _curSessionType = portalForm.getSessionTypeDefault();

      // put values into the 'type' dropdown on the launch form
      // This part of the form will not change throughout the session
      populateSelect('sp_session_type', portalForm.getSessionTypeList(), 'select type', _curSessionType)

      // For now the RAM and # or cores selections do not change, other than their display
      var ramList = portalForm.getRAMArray()
      populateSelect('sp_memory', ramList, 'select RAM', ramList[0])

      var coresList = portalForm.getCoresArray()
      populateSelect('sp_cores', coresList, "select # cores", coresList[0])

      // Set the parts of the launch form that may change per type selection
      setLaunchFormForType(_curSessionType, true)

      // Enable the Launch button
      $('.sp-add-session').removeAttr('disabled')
      $('.sp-add-session').removeClass('sp-button-disable')
    }

    function setLaunchFormForType(sessionType, isReset) {
      // TODO: these functions will still be called, but will
      // need to get the appropriate values from the PortalForm object.
      //loadContainerImages(sessionType)
      // the getImageListForType() function will return an array
      // of IDs only.
      //loadContainerImages(portalForm.getImageListForType(sessionType))

      var tempImageList = portalForm.getImageListForType(sessionType)
      populateSelect('sp_software_stack', tempImageList, 'select stack', tempImageList[0])

      // Display or hide form fields as needed by the session type (ie RAM or cores...)
      setFormFields(sessionType)

      // Don't set the next default session name if the user
      // appears to have changed the name, unless it has been cleared
      var curSessionName = $('#sp_session_name').val().trim()
      if (isReset === true || curSessionName === "" ||
        (curSessionName === portalSessions.getDefaultSessionName(_curSessionType))) {
          setDefaultSessionName(sessionType.trim())
      }
      _curSessionType = sessionType
    }

    function handleResetFormState(event) {
      event.preventDefault()
      // Clear messages
      portalCore.clearAjaxAlert()
      portalCore.setProgressBar('okay')
      var sessionTypeDefault = portalForm.getSessionTypeDefault()

      // set selected back to session type default
      $("#sp_session_type option").each(function() {
        if ($(this).val() === sessionTypeDefault) {
          $(this).attr('selected','selected')
        } else {
          $(this).removeAttr('selected')
        }
      });

      // reload the form for default session type
      setLaunchFormForType(sessionTypeDefault, true)
    }

    $.extend(this, {
      init: init
    })
  }

})(jQuery)
