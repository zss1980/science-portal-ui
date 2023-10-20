/*
 ************************************************************************
 *******************  CANADIAN ASTRONOMY DATA CENTRE  *******************
 **************  CENTRE CANADIEN DE DONNÉES ASTRONOMIQUES  **************
 *
 *  (c) 2023.                            (c) 2023.
 *  Government of Canada                 Gouvernement du Canada
 *  National Research Council            Conseil national de recherches
 *  Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
 *  All rights reserved                  Tous droits réservés
 *
 *  NRC disclaims any warranties,        Le CNRC dénie toute garantie
 *  expressed, implied, or               énoncée, implicite ou légale,
 *  statutory, of any kind with          de quelque nature que ce
 *  respect to the software,             soit, concernant le logiciel,
 *  including without limitation         y compris sans restriction
 *  any warranty of merchantability      toute garantie de valeur
 *  or fitness for a particular          marchande ou de pertinence
 *  purpose. NRC shall not be            pour un usage particulier.
 *  liable in any event for any          Le CNRC ne pourra en aucun cas
 *  damages, whether direct or           être tenu responsable de tout
 *  indirect, special or general,        dommage, direct ou indirect,
 *  consequential or incidental,         particulier ou général,
 *  arising from the use of the          accessoire ou fortuit, résultant
 *  software.  Neither the name          de l'utilisation du logiciel. Ni
 *  of the National Research             le nom du Conseil National de
 *  Council of Canada nor the            Recherches du Canada ni les noms
 *  names of its contributors may        de ses  participants ne peuvent
 *  be used to endorse or promote        être utilisés pour approuver ou
 *  products derived from this           promouvoir les produits dérivés
 *  software without specific prior      de ce logiciel sans autorisation
 *  written permission.                  préalable et particulière
 *                                       par écrit.
 *
 *  This file is part of the             Ce fichier fait partie du projet
 *  OpenCADC project.                    OpenCADC.
 *
 *  OpenCADC is free software:           OpenCADC est un logiciel libre ;
 *  you can redistribute it and/or       vous pouvez le redistribuer ou le
 *  modify it under the terms of         modifier suivant les termes de
 *  the GNU Affero General Public        la “GNU Affero General Public
 *  License as published by the          License” telle que publiée
 *  Free Software Foundation,            par la Free Software Foundation
 *  either version 3 of the              : soit la version 3 de cette
 *  License, or (at your option)         licence, soit (à votre gré)
 *  any later version.                   toute version ultérieure.
 *
 *  OpenCADC is distributed in the       OpenCADC est distribué
 *  hope that it will be useful,         dans l’espoir qu’il vous
 *  but WITHOUT ANY WARRANTY;            sera utile, mais SANS AUCUNE
 *  without even the implied             GARANTIE : sans même la garantie
 *  warranty of MERCHANTABILITY          implicite de COMMERCIALISABILITÉ
 *  or FITNESS FOR A PARTICULAR          ni d’ADÉQUATION À UN OBJECTIF
 *  PURPOSE.  See the GNU Affero         PARTICULIER. Consultez la Licence
 *  General Public License for           Générale Publique GNU Affero
 *  more details.                        pour plus de détails.
 *
 *  You should have received             Vous devriez avoir reçu une
 *  a copy of the GNU Affero             copie de la Licence Générale
 *  General Public License along         Publique GNU Affero avec
 *  with OpenCADC.  If not, see          OpenCADC ; si ce n’est
 *  <http://www.gnu.org/licenses/>.      pas le cas, consultez :
 *                                       <http://www.gnu.org/licenses/>.
 *
 *
 ************************************************************************
 */

package org.opencadc.scienceportal;

import ca.nrc.cadc.net.HttpGet;
import ca.nrc.cadc.reg.Standards;
import ca.nrc.cadc.reg.client.LocalAuthority;
import ca.nrc.cadc.util.StringUtil;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.Objects;

public class OIDCConfiguration {

    private static final String OIDC_CLIENT_ID_PROPERTY_KEY =
            String.format("%s.oidc.clientID", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    private static final String OIDC_CLIENT_SECRET_PROPERTY_KEY =
            String.format("%s.oidc.clientSecret", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    private static final String OIDC_REDIRECT_URI_PROPERTY_KEY =
            String.format("%s.oidc.redirectURI", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    private static final String OIDC_CALLBACK_URI_PROPERTY_KEY =
            String.format("%s.oidc.callbackURI", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    private static final String OIDC_SCOPE_PROPERTY_KEY =
            String.format("%s.oidc.scope", ApplicationConfiguration.PROPERTY_NAME_PREFIX);

    private static final String WELL_KNOWN_ENDPOINT = "/.well-known/openid-configuration";
    private static final String AUTH_ENDPOINT_KEY = "authorization_endpoint";
    private static final String TOKEN_ENDPOINT_KEY = "token_endpoint";

    private final ApplicationConfiguration applicationConfiguration;

    public OIDCConfiguration(final ApplicationConfiguration applicationConfiguration) {
        this.applicationConfiguration = applicationConfiguration;
    }

    public String getClientID() {
        return applicationConfiguration.getStringValue(OIDCConfiguration.OIDC_CLIENT_ID_PROPERTY_KEY, true);
    }

    public String getClientSecret() {
        return applicationConfiguration.getStringValue(OIDCConfiguration.OIDC_CLIENT_SECRET_PROPERTY_KEY, true);
    }

    public String getCallbackURI() {
        return applicationConfiguration.getStringValue(OIDCConfiguration.OIDC_CALLBACK_URI_PROPERTY_KEY, true);
    }

    public String getRedirectURI() {
        return applicationConfiguration.getStringValue(OIDCConfiguration.OIDC_REDIRECT_URI_PROPERTY_KEY, true);
    }

    public String getScope() {
        return applicationConfiguration.getStringValue(OIDCConfiguration.OIDC_SCOPE_PROPERTY_KEY, true);
    }

    public static boolean isConfigured() {
        try {
            OIDCConfiguration.getIssuer();
            return true;
        } catch (UnsupportedOperationException noOpenID) {
            return false;
        }
    }

    public static URI getIssuer() {
        final LocalAuthority localAuthority = new LocalAuthority();
        final URI openIDIssuerURI = localAuthority.getServiceURI(Standards.SECURITY_METHOD_OPENID.toASCIIString());
        if (!"https".equals(openIDIssuerURI.getScheme())) {
            throw new UnsupportedOperationException("OpenID Provider not configured.");
        } else {
            return openIDIssuerURI;
        }
    }

    public static URL getAuthorizationEndpoint() throws MalformedURLException {
        final JSONObject jsonObject = OIDCConfiguration.getWellKnownJSON();
        final String authEndpointString = jsonObject.getString(OIDCConfiguration.AUTH_ENDPOINT_KEY);
        return new URL(authEndpointString);
    }

    public static URL getTokenEndpoint() throws MalformedURLException {
        final JSONObject jsonObject = OIDCConfiguration.getWellKnownJSON();
        final String tokenEndpointString = jsonObject.getString(OIDCConfiguration.TOKEN_ENDPOINT_KEY);
        return new URL(tokenEndpointString);
    }

    /**
     * Obtain the .well-known endpoint JSON output.
     * TODO: Cache this?
     *
     * @return The JSON Object of the response data.
     * @throws MalformedURLException If URLs cannot be created as expected.
     */
    private static JSONObject getWellKnownJSON() throws MalformedURLException {
        final URI oidcIssuer = OIDCConfiguration.getIssuer();
        final URL oidcIssuerURL = oidcIssuer.toURL();
        final URL configurationURL = new URL(oidcIssuerURL.toExternalForm()
                                             + OIDCConfiguration.WELL_KNOWN_ENDPOINT);
        final Writer writer = new StringWriter();
        final HttpGet httpGet = new HttpGet(configurationURL, inputStream -> {
            final Reader inputReader = new BufferedReader(new InputStreamReader(inputStream));
            final char[] buffer = new char[8192];
            int charsRead;
            while ((charsRead = inputReader.read(buffer)) >= 0) {
                writer.write(buffer, 0, charsRead);
            }
            writer.flush();
        });

        httpGet.run();

        return new JSONObject(writer.toString());
    }
}
