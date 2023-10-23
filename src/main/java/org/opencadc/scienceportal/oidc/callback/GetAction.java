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

package org.opencadc.scienceportal.oidc.callback;

import ca.nrc.cadc.auth.SSOCookieManager;
import ca.nrc.cadc.net.HttpPost;
import ca.nrc.cadc.rest.InlineContentHandler;
import ca.nrc.cadc.rest.RestAction;
import org.json.JSONObject;
import org.opencadc.scienceportal.ApplicationConfiguration;
import org.opencadc.scienceportal.OIDCConfiguration;
import org.opencadc.scienceportal.SciencePortalAuthAction;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class GetAction extends RestAction {
    private static final String COOKIE_FORMAT = SciencePortalAuthAction.FIRST_PARTY_COOKIE_NAME
                                                + "=%s; Domain=%s; SameSite=Strict; Secure; HttpOnly";

    @Override
    protected InlineContentHandler getInlineContentHandler() {
        return null;
    }

    @Override
    public void doAction() throws Exception {
        final OIDCConfiguration oidcConfiguration = new OIDCConfiguration(new ApplicationConfiguration());
        final String code = syncInput.getParameter("code");
        final String state = syncInput.getParameter("state");
        final URL authorizationURL = OIDCConfiguration.getTokenEndpoint();

        final String basicAuthHeader = String.format("%s:%s", oidcConfiguration.getClientID(),
                                                     oidcConfiguration.getClientSecret());
        final String encodedBasicAuthHeader = "basic " + new String(Base64.getEncoder().encode(
                basicAuthHeader.getBytes(StandardCharsets.UTF_8)));

        final Map<String, Object> payload = GetAction.tokenPayload(code, state, oidcConfiguration);

        final HttpPost postAuthorizationCode = new HttpPost(authorizationURL, payload, false);
        postAuthorizationCode.setRequestProperty("authorization", encodedBasicAuthHeader);
        postAuthorizationCode.prepare();

        try (final BufferedReader bufferedReader =
                     new BufferedReader(new InputStreamReader(postAuthorizationCode.getInputStream()))) {
            String line;
            final StringBuilder tokenBuilder = new StringBuilder();
            while ((line = bufferedReader.readLine()) != null) {
                tokenBuilder.append(line.trim());
            }

            final JSONObject tokenSetJSON = new JSONObject(tokenBuilder.toString());
            syncOutput.setHeader("set-cookie", String.format(GetAction.COOKIE_FORMAT,
                                                             tokenSetJSON.getString("access_token"),
                                                             new URL(syncInput.getRequestURI()).getHost()));

            syncOutput.setCode(HttpServletResponse.SC_FOUND);
            syncOutput.setHeader("location", oidcConfiguration.getCallbackURI());
        }
    }

    private static Map<String, Object> tokenPayload(final String code, final String state,
                                                    final OIDCConfiguration oidcConfiguration) {
        final Map<String, Object> payload = new HashMap<>();
        payload.put("code", code);
        payload.put("state", state);
        payload.put("scope", oidcConfiguration.getScope());
        payload.put("redirect_uri", oidcConfiguration.getRedirectURI());
        payload.put("grant_type", "authorization_code");
        payload.put("client_id", oidcConfiguration.getClientID());
        payload.put("client_secret", oidcConfiguration.getClientSecret());
        return payload;
    }
}
