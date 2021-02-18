;(function($) {
  // register namespace
  $.extend(true, window, {
    cadc: {
      web: {
        science: {
          portal: {
            session: {
              PortalSession: PortalSession,
              // Events
              events: {
                onFindSessionOK: new jQuery.Event('sciPort:onFindSessionOK'),
                onFindSessionFail: new jQuery.Event('sciPort:onFindSessionFail'),
                onFindSessionError: new jQuery.Event('sciPort:onFindSessionError')
              }
            }
          }
        }
      }
    }
  })


  /**
   * Class for handling Skaha session interaction and data
   * @constructor
   */
  function PortalSession() {
    var _selfPortalSess = this
    var _isEmpty = true
    this._sessionList = {}
    this.sessionURLs = {}

    function setServiceURLs(URLObject) {
      _selfPortalSess.sessionURLs = URLObject
    }

    function initSessionList() {
      _isEmpty = true
      _selfPortalSess._sessionList = {}
    }

    function getSessionList() {
      if (_selfPortalSess._sessionList === {}) {
        initSessionList()
        return _selfDoc._sessionList
      }
    }

    function getCurrentSession() {
      // return first list entry as 'current'
      if (_selfPortalSess._sessionList != {}) {
        return _selfPortalSess._sessionList[0]
      }
      else {
        return {}
      }
    }

    function isRunningSession(sessionObj) {
      if (sessionObj != {}) {
          if (sessionObj.status == 'Running') {
            return true
          } else {
            return false
          }
      }
      return false
    }

    function setSessionList(sessionList) {
      if (sessionList.length > 0) {
        _selfPortalSess._sessionList = sessionList
        _selfPortalSess._isEmpty = false
      }
    }

    function isSessionListEmpty() {
      return _selfPortalSess._isEmpty
    }

    /**
     * Run this on page load to see if there's something to start up.
    */
    function findCurrentSession() {
      Promise.resolve(getSessionListAjax(_selfPortalSess.sessionURLs.session, {}))
        .then(function(sessionList) {

          if (sessionList.length > 0) {
            setSessionList(sessionList)
            _selfPortalSess.curSession = getCurrentSession()
            trigger(_selfPortalSess, cadc.web.science.portal.session.events.onFindSessionOK, _selfPortalSess.curSession)
          } else {
            // No session found
            trigger(_selfPortalSess, cadc.web.science.portal.session.events.onFindSessionFail)
          }
        })
        .catch(function(message) {
          // get session list failed in a way that can't allow page to continue
          trigger(_selfPortalSess, cadc.web.science.portal.session.events.onFindSessionError, message)
        })
    }

    function getSessionListAjax(serviceURL, sessionData) {

      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest()

        // 'load' is the XMLHttpRequest 'finished' event
        request.addEventListener(
          'load',
          function () {
            if (request.status === 200) {
              var jsonData = JSON.parse(request.responseText)
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

    function pollSessionStatus(sessionData, timeout, interval) {
      // Set a reasonable timeout
      var endTime = Number(new Date()) + (timeout || 10000)
      interval = interval || 200

      var checkCondition = function(resolve, reject) {

        getSessionListAjax(_selfPortalSess.sessionURLs.session)
          .then(function (sessionList) {

            if (sessionList.length > 0) {
              if (_selfPortalSess.isRunningSession(sessionList[0])) {
                resolve(sessionList[0])
              } else if (Number(new Date()) < endTime) {
                // If neither of the conditions are met and the timeout
                // hasn't elapsed, go again
                // update info modal with current status?
                setTimeout(checkCondition, interval, resolve, reject)
              } else {
                // Didn't match and too much time, reject!
                reject(new Error('Session took too long to start running. Try refreshing the page to connect or contact CANFAR admin for assistance.'))
              }
            } else {
              // could be that the system hasn't caught up to the request yet and
              // an empty return occurred
              setTimeout(checkCondition, interval, resolve, reject)
            }
          })
          .catch(function (message) {
            handleAjaxError(message)
          })
      } // end checkCondition

      return new Promise(checkCondition)
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


    initSessionList()

      $.extend(this, {
        setServiceURLs: setServiceURLs,
        initSessionList: initSessionList,
        getSessionList: getSessionList,
        setSessionList: setSessionList,
        getCurrentSession: getCurrentSession,
        findCurrentSession: findCurrentSession,
        isRunningSession: isRunningSession,
        isSessionListEmpty : isSessionListEmpty,
        pollSessionStatus: pollSessionStatus
      })
    }

})(jQuery)
