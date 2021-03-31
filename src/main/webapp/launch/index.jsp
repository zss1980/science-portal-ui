<%@ page import="ca.nrc.cadc.web.Configuration" %>
<%@ page import="ca.nrc.cadc.config.ApplicationConfiguration" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" session="false" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<meta http-equiv="Cache-control" content="no-cache">

<%
  final ApplicationConfiguration configuration = new ApplicationConfiguration(Configuration.DEFAULT_CONFIG_FILE_PATH);
  final String sessionsResourceID = configuration.lookup("org.opencadc.science-portal.sessions.resourceID");
%>

<!-- Default to current host. -->
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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
          crossorigin="anonymous">

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
                <a id="canfar_science_portal" class="anchor" href="#sp_launch" aria-hidden="true">
                  <span aria-hidden="true" class="octicon octicon-link"></span>
                </a>Science Portal
              </h3>

              <%--   Session list section starts here  --%>
              <div class="science-portal-authenticated">
                <div id="sp_listnavbar" class="panel panel-default sp-panel">

                  <div class="panel-heading sp-panel-heading">
                    <nav class="navbar navbar-expand-sm sp-header-navbar" id="list-navbar-functions">
                      <ul class="nav navbar-nav sp-header-navbar">
                        <li class="nav-item"><h4>Active Sessions</h4></li>
                      </ul>
                    </nav>
                  </div>
                  <div id="sp_list_progress_bar"></div>

                  <%-- Body of session list will be built in this div  --%>
                  <div class="panel-body science-portal-panel-body" id="sp_session_list">
                  </div>
                <div class="sp-button-bar">
                  <%-- session action button bar --%>
                  <button class="sp-button-bar-button sp-add-session fa fa-plus"></button>
                  <button class="sp-button-bar-button sp-session-reload fa fa-redo"></button>
                </div>

                <%--   Launch Form starts here             --%>
                <div id="sp_launch_form_div" class="panel panel-default sp-panel hidden">
                  <div class="panel-heading sp-panel-heading">
                    <nav class="navbar navbar-expand-sm sp-header-navbar" id="navbar-functions">
                      <ul class="nav navbar-nav sp-header-navbar">
                        <li class="nav-item"><h4>Launch Session</h4></li>
                      </ul>
                    </nav>
                  </div>

                  <div id="sp_progress_bar"></div>

                  <div class="panel-body science-portal-panel-body">

                    <!-- Noficiation and Alert bars -->
                    <div class="alert alert-danger hidden">
                      <strong id="status_code">444</strong>&nbsp;&nbsp;<span id="error_msg">Server error</span>
                    </div>

                    <div class="alert alert-success hidden">
                      <span id="alert_msg"></span>
                    </div>

                    <!-- Form starts -->
                    <div class="science-portal-form-body">
                      <form id="session_request_form" class="form-horizontal">

                        <!-- Session Name -->
                        <div class="form-group">
                          <label for="sp_session_name"
                                 class="col-sm-3 control-label"
                                 id="sp_session_name_label">name
                            <div id="session_name"
                                class="science-portal-tooltip"
                                data-contentkey="session_name"></div>
                          </label>
                          <div class="col-sm-6">
                            <input type="text" class="form-control sp-form sp-form-input"
                                   id="sp_session_name" name="name"
                                   placeholder="provide session name" tabindex="1" required/>
                          </div>
                        </div>  <!-- end form group -->

                        <!-- Session type list -->
                        <div class="form-group">
                          <label for="sp_session_type"
                                 class="col-sm-3 control-label"
                                 id="sp_session_type_label">type
                            <div id="session_type"
                                 class="science-portal-tooltip"
                                 data-contentkey="session_type"
                                 data-title="Session Type">
                            </div>
                          </label>
                          <div class="col-sm-6">
                            <select name="type" id="sp_session_type"
                                    class="form-control sp-form sp-form-input"
                                    tabindex="2" required>
                              <option value="" selected disabled><em>-- loading types --</em></option>
                            </select>
                          </div>
                        </div>

                        <!-- Container image (Image list) -->
                        <div class="form-group">
                          <label for="sp_software_stack"
                                 class="col-sm-3 control-label"
                                 id="sp_software_stack_label">container image
                            <div id="software_stack"
                                class="science-portal-tooltip"
                                data-contentkey="software_stack"
                                data-title="Software Stack">
                            </div>
                          </label>
                          <div class="col-sm-6">
                            <select name="image" id="sp_software_stack"
                                    class="form-control sp-form sp-form-input"
                                    tabindex="3" required>
                              <option value="" selected disabled><em>-- loading images --</em></option>
                            </select>
                          </div>
                        </div>


                        <%--  TODO: add content dropdowns after this                      --%>
                        <div class="form-group">
                          <label for="sp_memory"
                                 class="col-sm-3 control-label"
                                 id="science_portal_memory_label">memory
                                    <div id="context_memory"
                                         class="science-portal-tooltip"
                                         data-contentkey="context_memory"
                                         data-title="Memory"></div>
                          </label>
                            <div class="col-sm-6">
                              <select name="ram" id="sp_memory"
                                      class="form-control sp-form sp-form-input"
                                      tabindex="4">
                                <option value="" selected disabled>-- loading resource list --</option>
                              </select>
                            </div>
                        </div>

                    <div class="form-group">
                      <label for="sp_cores"
                             class="col-sm-3 control-label"
                             id="sp_cores_label"># cores
                                <div id="context_cores"
                                      class="science-portal-tooltip"
                                      data-contentkey="context_cores"
                                      data-title="Number of Cores"></div>
                      </label>
                      <div class="col-sm-6">
                        <select name="cores" id="sp_cores"
                                class="form-control sp-form sp-form-input"
                                tabindex="5">
                          <option value="" selected disabled>-- loading resource list --</option>
                        </select>
                      </div>
                    </div>

                        <!-- Buttons -->
                        <div class="form-group">
                          <label for="session_request_button" class="doi_action_button doi_action_label col-sm-3 control-label">
                           </label>
                          <div class="col-sm-9">
                            <div class="button-group sp-button-group col-sm-4" role="group">
                              <button type="submit" class="doi_action_button btn btn-primary" id="session_request_button" tabindex="5">Launch</button>
                              <button type="reset" class="btn btn-default sp-button" id="sp_reset_button" tabindex="6">Reset</button>
                             </div>
                         </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Info/Error Modal -->
              <div class="modal" id="info_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="infoModalLongTitle"></h5>
                    </div>
                    <div class="modal-body">
                      <span class="info-span"></span>
                      <span class="spinner-span glyphicon glyphicon-refresh fast-right-spinner"></span>
                    </div>
                    <div id="pageReload" class="modal-footer">
                      <button type="button" class="btn btn-success" data-dismiss="modal" id="pageReloadButton">Reload</button>
                    </div>
                    <div id="infoHome" class="sp-modal-footer-info-link">
                      <a href="<c:out value="${baseURL}" />" class="account_access_info" title="CANFARHome" target="_blank">
                        CANFAR Home</a>
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


    <script type="application/javascript" src="<c:out value=" ${baseURL}/canfar/javascript/cadc.contexthelp.js" />"></script>
    <script type="application/javascript" src="<c:out value=" ${baseURL}/canfar/javascript/cadc.progressbar.js" />"></script>
    <script type="application/javascript" src="<c:out value=" ${baseURL}/science-portal/js/science_portal_core.js" />"></script>
    <script type="application/javascript" src="<c:out value=" ${baseURL}/science-portal/js/science_portal_session.js" />"></script>
    <script type="application/javascript" src="<c:out value=" ${baseURL}/science-portal/js/science_portal.js" />"></script>

    <script type="application/javascript">
      $(document).ready(function() {
        // Set up controller for Science Portal Session Launch page
        launch_js = new cadc.web.science.portal.PortalApp({
          baseURL: window.location.origin,
          sessionsResourceID: '<%= sessionsResourceID %>'
        })
        launch_js.init()
      });

    </script>

  </body>

</html>

