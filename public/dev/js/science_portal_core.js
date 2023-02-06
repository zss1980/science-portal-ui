;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            core: {
              PortalCore: PortalCore,
              // Events
              events: {
                onAuthenticated: new jQuery.Event("sciPort:onAuthenticated"),
                onServiceURLOK: new jQuery.Event("sciPort:onServiceURLOK"),
                onServiceURLFail: new jQuery.Event("sciPort:onServiceURLFail")
              },
              headerURI: {
                search: "ivo://cadc.nrc.ca/search",
                gmui: "ivo://cadc.nrc.ca/groups"
              }
            }
          }
        }
      }
    }
  })

  /**
   * Common functions to support Science Portal UI.
   *
   * @constructor
   * @param {{}} inputs   Input configuration.
   * @param {String} [inputs.baseURL="https://www.canfar.net/"] URL of the /reg web service
   * needed by the Registry to look up web service and ui URLs for use in ajax calls by this page.
   */
  function PortalCore(inputs) {

    var _selfPortalCore = this
    var baseURL =
            inputs && inputs.hasOwnProperty("baseURL")
                ? inputs.baseURL
                : "https://www.canfar.net"

    var _registryClient
    var _headerURLCallCount = 0

    if (typeof inputs.registryLocation !== "undefined") {
      _registryClient= new Registry({
        baseURL: inputs.registryLocation
      })
      inputs.registryClient = _registryClient
    } else {
      _registryClient = new Registry({
        baseURL: baseURL
      })
    }

    var portalLogin = new cadc.web.science.portal.login.PortalLogin(inputs)
    this.userManager = new cadc.web.UserManager(inputs)
    var _isAuthenticated = false

    var _rApp = inputs.reactApp
    this.pageState = _rApp.getPageState()
    this.pageSections = {
      "all" : "all",
      "sessionList" : "spSessionList",
      "form" : "spForm",
      "usage" : "spPlatformUsage"
    }

    var _sessionServiceResourceID = inputs.sessionsResourceID

    function init(overrideURLs) {
      setSessionServiceURLs(overrideURLs)
    }

    // Primarily used for testing
    function setReactAppRef(reactApp) {
      _selfPortalCore._rApp = reactApp
    }

    // ------------ Page state management functions ------------

    function setModal(modalLink, title, msg, showSpinner, showReload, showHome) {
      var modaldata = {
        "msg": msg,
        "title": title,
        "isOpen": true,
        "showSpinner": showSpinner,
        "showReload": showReload,
        "showHome" : showHome
      }
      _rApp.updateModal(modaldata)
    }

    function hideModal() {
      var modaldata = {
        "msg": "",
        "title": "",
        "isOpen": false,
        "showSpinner": false,
        "showReload": false,
        "showHome" : false
      }
      _rApp.updateModal(modaldata)
    }

    function setConfirmModal(modalLink, confirmFn, confirmData) {
      var deleteMsg = "Session name " + confirmData.name + ", id " + confirmData.id

      var modaldata = {
        handlers: {
          "onConfirm": confirmFn,
          "onClose": hideConfirmModal
        },
        dynamicProps: {
          "msg": deleteMsg,
          "isOpen": true,
          "confirmData": confirmData
        }
      }
      _rApp.openConfirmModal(modaldata)
    }

    function initConfirmModal(modalLink, confirmFn, cancelFn) {
      var modaldata = {
        handlers: {
          "onConfirm": confirmFn,
          "onClose": hideConfirmModal
        },
        dynamicProps: {
          "msg": "",
          "isOpen": false,
          "confirmData": {}
        }
      }
      _rApp.setConfirmModal(modaldata)
    }

    function hideConfirmModal(modalLink) {
      var
        modalData =  {
        dynamicProps:  {
            "msg": "",
            "buttonText": "Delete",
            "confirmData": {}
          }
        }
      _rApp.closeConfirmModal(modalData)
    }

    function showLoginModal() {
      _rApp.openLoginModal(true)
    }

    function hideLoginModal() {
      _rApp.openLoginodal(false)
    }

    function clearAjaxAlert() {
      setPageState(_selfPortalCore.pageSections.all,"success", false)
    }


    function _mkAlertData(barType, msg, show) {
      var alert = {}
      if ((typeof msg !== "undefined") && (msg !== "") ) {
        alert = {
          "type": barType,
          "show":  true,
          "message": msg
        }
      } else {
        alert = {
          "show": false
        }
      }
      return alert
    }

    function _mkProgressBarData(barType, isAnimated) {
      var progressBar = {
        "type": barType,
        "animated": isAnimated
      }

      return progressBar
    }

    // Communicate AJAX progress and status using progress bar
    // function setPageState(barType, isAnimated, formMsg, sessionActionAlertMsg) {

      function setPageState(pageSection, barType, isAnimated, msg) {

      var pageState = _selfPortalCore.pageState

        if (pageSection === "all") {
          // Used to reset entire page, or to
          // set all progress bars to red if there's a skaha service error
          pageState.spForm.alert.show = false
          pageState.spForm.progressBar = _mkProgressBarData(barType, isAnimated)
          pageState.spPlatformUsage.alert.show = false
          pageState.spPlatformUsage.progressBar = _mkProgressBarData(barType, isAnimated)
          pageState.spSessionList.alert.show = false
          pageState.spSessionList.progressBar = _mkProgressBarData(barType, isAnimated)
        } else {
          // pageState[pageSection].alert = _mkAlertData(barType, )

          // var show = true
          pageState[pageSection].progressBar = _mkProgressBarData(barType, isAnimated)
          if (barType == "danger") {
            pageState[pageSection].alert = _mkAlertData(barType, msg, true)
          } else {
            pageState[pageSection].alert.show = false
          }
          // if ((typeof msg !== "undefined") && (msg !== "") ) {
          //
          //
          // } else {
          //
          // }

        }

      _rApp.setPageStatus(pageState)
    }

    function setAjaxFail(pageSection, message) {
      var alertMsg = message.status + ": " + getRcDisplayText(message)
      setPageState(pageSection,"danger", false, alertMsg)
      hideModal()
    }

    function setAjaxSuccess(pageSection, message) {
      setPageState(pageSection,"success", false, message)
    }

    function handleAjaxError(pageSection, request) {
      hideModal()
      setAjaxFail(pageSection, request)
    }

    // ----------- Data Filtering and Display Functions -----------------

    function getDisplayStartTime(startTime) {
      // v 3.0: Times come from skaha in UTC, with 'T' and 'Z'
      var tmpTime = ""
      if (startTime !== undefined) {
        tmpTime = startTime.replace("T", " ")
        // Truncate seconds and "Z" from time stamp
        tmpTime = tmpTime.substr(0, tmpTime.lastIndexOf(":"))

      } else {
        tmpTime = "not available"
      }
      return tmpTime
    }

    function getDisplayImageName(imageName) {
      // v 3.0: each image has the host name of the
      // harbor instance as it's first element. For now,
      // this is pruned off as it's the same for all images
      // served by the portal
      var firstSlashIdx = imageName.indexOf("/")
      var prunedImage = imageName.substr(firstSlashIdx + 1, imageName.length)
      return prunedImage
    }

    // Structure is used to pass into science_portal_form to produce the image list for display,
    // also used in science_portal to set data to be passed into SessionItem react component.
    // values are the functions immediately above this declaration
    this.dataFilters = {
      "startTime" : getDisplayStartTime,
      "imageName" : getDisplayImageName
    }

    // ---------- Event Handling Functions ----------

    function subscribe(target, event, eHandler) {
      $(target).on(event.type, eHandler)
    }

    function unsubscribe(target, event) {
      $(target).unbind(event.type)
    }

    function trigger(target, event, eventData) {
      $(target).trigger(event, eventData)
    }


    // ------------ HTTP/Ajax functions ------------

    function getSessionServiceEndpoint() {
      return _registryClient
          .getServiceURL(
            _sessionServiceResourceID,
              "vos://cadc.nrc.ca~vospace/CADC/std/Proc#sessions-1.0",
              "vs:ParamHTTP",
              "cookie"
          )
    }

    // ------ Set up web service URLs ------

    function setSessionServiceURLs(URLs) {
      if (typeof URLs !== "undefined") {
        _selfPortalCore.sessionServiceURLs = URLs
        trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLOK)
      } else {
        setModal(_rApp, "Loading Page Resources", "Locating session web service.", true, false, false)
        Promise.resolve(getSessionServiceEndpoint())
          .then(function (serviceURL) {
              if (typeof serviceURL != "undefined") {

                _selfPortalCore.sessionServiceURLs = {
                  "base": serviceURL,
                  "session": serviceURL + "/session",
                  "context": serviceURL + "/context",
                  "images": serviceURL + "/image"
                }
                _selfPortalCore.hideModal()
                trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLOK)
              } else {
                // Don't hide modal as the page isn't ready to be interacted with yet
                trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLFail)
              }
            }
          )
          .catch(function (message) {
            trigger(_selfPortalCore, cadc.web.science.portal.core.events.onServiceURLFail)
          })
      }
    }

    function setHeaderURLs() {
        // TODO: this modal likely to go away
        setModal(_rApp, "Loading Header Resources", "Locating session web service.", true, false, false)

        const headerURIs = [
          ca.nrc.cadc.accountURI.passchg,
          ca.nrc.cadc.accountURI.passreset,
          ca.nrc.cadc.accountURI.acctrequest,
          ca.nrc.cadc.accountURI.acctupdate,
          cadc.web.science.portal.core.headerURI.gmui,
          cadc.web.science.portal.core.headerURI.search
        ]
        _selfPortalCore.headerURLs = new Object()
        _selfPortalCore.headerURLs.baseURLCanfar = baseURL
        _headerURLCallCount = headerURIs.length

      // Get entire applications registry to process
      _registryClient.getApplicationsEndpoints()
        .then(function (urlRequest) {
          for (var i = 0; i < headerURIs.length; i++) {
            var uri = headerURIs[i]
            let url = _registryClient.extractURL(urlRequest, uri)
            var uriKey = uri.substring(uri.lastIndexOf("\/") + 1, uri.length)
            console.log("uriKey: " + uriKey)
            _selfPortalCore.headerURLs[uriKey] = url
            console.log("finished loop step " + i)
          }
          _rApp.setHeaderURLs(_selfPortalCore.headerURLs)
        })
        .catch(function (err) {
          alert("Error obtaining registry applications list msg: " + err)
        })

    }

// ------------ Service Status parsing & display functions ------------

    /**
     * Parse return codes and add text for the screen
     * @param request
     * @returns {string}
     */
    function getRcDisplayText(request) {
      var displayText
      switch(request.status) {
        case 403:
          displayText = "You are not authorised to use Skaha resources. Contact CANFAR admin" +
          " for information on how to get set up with a resource allocation and permission to access the service."
          break
        case 400:
          // Do as good a test for max number of sessions reached message from Skaha as possible:
          if (request.responseText.includes("session already running")) {
            displayText = "Limit of number of sessions of selected type reached"
            break
          }
        default:
          displayText = request.responseText
          break
      }

      return displayText
    }

    /**
     * Parse return codes and add text for the screen
     * @param request
     * @returns {string}
     */
    function getRcDisplayTextPlusCode(request) {
      var displayText
      switch(request.status) {
        case 403:
          displayText = "Your username is not authorized to use Skaha resources. Contact CANFAR admin" +
            " for information on how to get set up with a resource allocation and permissions."
          break
        default:
          displayText = request.responseText
          break
      }

      return "(" + request.status + ")" + displayText
    }


    // ------------ Authentication functions ------------

    function checkAuthentication(isDev) {
      // From cadc.user.js. Listens for when user logs in
      _selfPortalCore.userManager.subscribe(cadc.web.events.onUserLoad,
          function (event, data) {
            // Check to see if user is logged in or not
            if (typeof(data.error) !== "undefined") {
              hideModal()
              var userState = {
                loginHandler : portalLogin.handleLoginRequest
              }
              _rApp.setNotAuthenticated(userState)
            } else {
              // Don't directly access react app from here so this
              // function can be connected to the portalLogin
              // cadc.web.science.portal.login.events.onAuthenticateOK event as well.
              // That event is fired after the login form is submitted.
              setAuthenticated()
            }
          })

      if (isDev === true) {
        _selfPortalCore.userManager.user = {fullname: "dev user"}
        setAuthenticated()
      } else {
        // Call the whoami endpoint to get the user details
        // if they are not logged in, same event is thrown, return payload
        // needs to be checked
        _selfPortalCore.userManager.loadCurrent()
      }
    }

    function afterAuthActions() {
      // Call the whoami endpoint again
      _selfPortalCore.userManager.loadCurrent()
    }

    function setAuthenticatedError() {
      var userState = {
        "username": "Login",
        "submitHandler": portalLogin.handleLoginRequest,
        "errMsg": "unable to log in (invalid username or password, or system error)"
      }
      _rApp.setAuthenticatedError(userState)
    }

    function setAuthenticated() {
      var userFullname = "Username"
      if (_selfPortalCore.userManager.user.getFullName !== undefined) {
        userFullname = _selfPortalCore.userManager.user.getFullName()
      } else if (_selfPortalCore.userManager.user.fullname !== undefined) {
        userFullname = _selfPortalCore.userManager.user.ffullname
      }
      var userState = {
        "username": userFullname
      }
      _rApp.setAuthenticated(userState)
      trigger(_selfPortalCore, cadc.web.science.portal.core.events.onAuthenticated, {"userState": userState})
    }

    $.extend(this, {
      init: init,
      getSessionServiceEndpoint: getSessionServiceEndpoint,
      setHeaderURLs: setHeaderURLs,
      setSessionServiceURLs: setSessionServiceURLs,
      setAjaxSuccess: setAjaxSuccess,
      setAjaxFail: setAjaxFail,
      // setSessionActionAjaxFail: setSessionActionAjaxFail,
      setPageState: setPageState,
      setReactAppRef: setReactAppRef,
      clearAjaxAlert: clearAjaxAlert,
      handleAjaxError: handleAjaxError,
      setConfirmModal: setConfirmModal,
      hideConfirmModal: hideConfirmModal,
      checkAuthentication: checkAuthentication,
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      trigger: trigger,
      getRcDisplayText: getRcDisplayText,
      getRcDisplayTextPlusCode: getRcDisplayTextPlusCode,
      setModal: setModal,
      hideModal: hideModal,
      showLoginModal: showLoginModal,
      hideLoginModal: hideLoginModal,
      initConfirmModal: initConfirmModal
    })
  }

})(jQuery)
