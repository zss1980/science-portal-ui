/*
************************************************************************
****  C A N A D I A N   A S T R O N O M Y   D A T A   C E N T R E  *****
*
* (c) 2013.                         (c) 2013.
* National Research Council            Conseil national de recherches
* Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
* All rights reserved                  Tous droits reserves
*
* NRC disclaims any warranties         Le CNRC denie toute garantie
* expressed, implied, or statu-        enoncee, implicite ou legale,
* tory, of any kind with respect       de quelque nature que se soit,
* to the software, including           concernant le logiciel, y com-
* without limitation any war-          pris sans restriction toute
* ranty of merchantability or          garantie de valeur marchande
* fitness for a particular pur-        ou de pertinence pour un usage
* pose.  NRC shall not be liable       particulier.  Le CNRC ne
* in any event for any damages,        pourra en aucun cas etre tenu
* whether direct or indirect,          responsable de tout dommage,
* special or general, consequen-       direct ou indirect, particul-
* tial or incidental, arising          ier ou general, accessoire ou
* from the use of the software.        fortuit, resultant de l'utili-
*                                      sation du logiciel.
*
*
* @author jenkinsd
* 12/13/13 - 1:44 PM
*
*
*
****  C A N A D I A N   A S T R O N O M Y   D A T A   C E N T R E  *****
************************************************************************
*/
package ca.nrc.cadc.scienceportal.integration;


import ca.nrc.cadc.util.Log4jInit;
import ca.nrc.cadc.util.StringUtil;
import ca.nrc.cadc.web.selenium.AbstractWebApplicationIntegrationTest;
import java.net.URI;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.junit.BeforeClass;


public abstract class AbstractSciencePortalIntegrationTest extends AbstractWebApplicationIntegrationTest
{
    private static final Logger log = Logger.getLogger(ca.nrc.cadc.scienceportal.integration.AbstractSciencePortalIntegrationTest.class);

    private static final String DEFAULT_ENDPOINT = "/science-portal";
    protected static URI SKAHA_RESOURCE_ID = URI.create("ivo://cadc.nrc.ca/skaha");


    static {
        Log4jInit.setLevel("ca.nrc.cadc.ca.nrc.cadc.scienceportal", Level.INFO);
    }

    final String endpoint;

    AbstractSciencePortalIntegrationTest() throws Exception
    {
        super();
        setFailOnTimeout(true);

        // Base Host of the web application to be tested.
        final String configuredEndpoint = System.getProperty("web.app.endpoint");
        endpoint = StringUtil.hasText(configuredEndpoint) ? configuredEndpoint : DEFAULT_ENDPOINT;
    }


    @BeforeClass
    public static void staticInit() throws Exception {
        // CadcAuthtest1 will have write access to DOI data folders
        // CadcRegtest1 will only have read access
//        CADCAUTHTEST_CERT = FileUtil.getFileFromResource("x509_CADCAuthtest1.pem", ca.nrc.cadc.scienceportal.integration.AbstractSciencePortalIntegrationTest.class);
        // which cert files will be used for the workflow?

    }


}