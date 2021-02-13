<%@ page language="java" contentType="text/html; charset=UTF-8" session="false" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<c:set var="baseURL" value='<%= System.getenv("CANFAR_WEB_HOST") %>' />

<%-- Default to current host. --%>
<c:if test="${empty baseURL}">
  <c:set var="req" value="${pageContext.request}" />
  <c:set var="url">${req.requestURL}</c:set>
  <c:set var="uri" value="${req.requestURI}" />
  <c:set var="baseURL" value="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}" />
</c:if>


<c:set var="resourceCapabilitiesEndPoint" value="${baseURL}/reg/resource-caps" />
<c:set var="contextPath" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="${fn:substring(url, 0, fn:length(url) - fn:length(uri))}${req.contextPath}/" />

    <c:import url="${baseURL}/canfar/includes/_page_top_styles.shtml" />
    <link rel="stylesheet" type="text/css"
          href="<c:out value=" ${baseURL}/science-portal/css/science-portal.css " />" media="screen"
    />
    <link rel="stylesheet" type="text/css"
          href="<c:out value=" ${baseURL}/cadcVOTV/css/jquery-ui-1.11.4.min.css " />" media="screen"
    />

    <!-- Located in ROOT.war -->
    <script type="application/javascript" src="${baseURL}/canfar/javascript/jquery-2.2.4.min.js"></script>
    <script type="application/javascript" src="${baseURL}/canfar/javascript/bootstrap.min.js"></script>

    <!--[if lt IE 9]>
        <script src="/html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <title>Science Portal</title>
  </head>

  <body>
    <c:import url="${baseURL}/canfar/includes/_application_header.shtml" />
    <div class="container-fluid fill">
      <div class="row fill">
        <div role="main" class="col-sm-12 col-md-12 main fill">
          <div class="inner fill">
            <section id="main_content" class="fill">

              <h3 class="sp-page-header">
                <a id="canfar-sp" class="anchor" href="#canfar-doi" aria-hidden="true">
                  <span aria-hidden="true" class="octicon octicon-link"></span>
                </a>Science Portal
              </h3>


              <div >
                <div class="panel panel-default sp-panel">
                  <div class="panel-heading sp-panel-heading">

                    <nav class="navbar navbar-expand-sm sp-header-navbar" id="navbar-functions">
                      <ul class="nav navbar-nav sp-header-navbar">
                        <li class="nav-item"><h4>Connect to Session</h4></li>
                      </ul>
                    </nav>
                  </div>
                  <div class="progress sp-progress-bar-container">
                    <div class="progress-bar progress-bar-success sp-progress-bar"
                         role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100">
                    </div>
                  </div>

                  <div class="panel-body sp-panel-body">

                    <div class=""><button type="submit" class="btn btn-primary" id="sp_login_button">
                      <i>Attempting to connect to existing session. If one isn't found, the launch page will be displayed. </i></button>
                    </div>

<%--                    <div class="doi-authenticated">--%>
<%--                      <!-- Noficiation and Alert bars -->--%>
<%--                      <div class="alert alert-danger hidden">--%>
<%--                        <strong id="status_code">444</strong>&nbsp;&nbsp;<span id="error_msg">Server error</span>--%>
<%--                      </div>--%>

<%--                      <div class="alert alert-success hidden">--%>
<%--                        <span id="alert_msg"></span>--%>
<%--                      </div>--%>

              <!-- Info/Error Modal -->
              <div class="modal fade" id="info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="infoModalLongTitle"></h5>
                    </div>
                    <div class="modal-body">
                      <span class="info-span"></span>
                      <span class="spinner-span glyphicon glyphicon-refresh fast-right-spinner"></span>
                    </div>
                    <div id="infoThanks" class="modal-footer">
                      <button type="button" class="hidden btn btn-default" data-dismiss="modal">Thanks</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content ends -->
            </section>
          </div>
        </div>
      </div>
    </div>

    <script type="application/javascript">
      $(document).ready(function() {

        // if session doesn't exist, go to launch page
        // Simulate an HTTP redirect:
        window.location.replace(window.location.origin + "/science-portal/launch");

    }); // end body onReady function

    </script>

  </body>

</html>

