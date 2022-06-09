/*
 ************************************************************************
 *******************  CANADIAN ASTRONOMY DATA CENTRE  *******************
 **************  CENTRE CANADIEN DE DONNÉES ASTRONOMIQUES  **************
 *
 *  (c) 2022.                            (c) 2022.
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
 ************************************************************************
 */
package ca.nrc.cadc.scienceportal.integration;

import org.junit.Test;

public class SciencePortalPageTest extends AbstractSciencePortalIntegrationTest {
    // TODO: these tests need to be finished

    public SciencePortalPageTest() throws Exception {
        super();
    }

    @Test
    public void testPageLoad() throws Exception {
        SciencePortalPage portalPage = goTo(endpoint, null, SciencePortalPage.class);

        portalPage.pageLoadLogin();
        // Q: what will determine papge is loaded?
        // Q: how to test the different states that can occur if these tests won't run in a guaranteed order?
//        requestPage.waitForCreateStateReady();

//        requestPage.setDoiTitle("DOI PUBLICATION TITLE");
//        requestPage.setDoiAuthorList("Flintstone, Fred");
//        requestPage.setJournalRef("2018, Astronomy Today, ApJ, 3000, 300");
//
//        requestPage.resetForm();
//
//        Assert.assertTrue(requestPage.getDoiTitle().equals(""));
//
//        requestPage.setDoiTitle("TEST publication title");
//        // Change format to something non-standard that is similar to a group name
//        requestPage.setDoiAuthorList("Yellow Warbler Jamboree");
//        requestPage.setJournalRef("2018, Nature, ApJ, 1000, 100");
//
//        requestPage.requestDoi();
//
//        Assert.assertTrue(requestPage.isStateOkay());
//
//        // Check that landing page for this DOI renders as exepcted
//        requestPage.waitForJournalRefLoaded();
//        String doiNumber = requestPage.getDoiNumber();
//        System.out.println(doiNumber);
//        String doiSuffix = doiNumber.split("/")[1];
//        System.out.println("doi suffix: " + doiSuffix);
//
//        DataCitationLandingPage landingPage = goTo("/citation/landing",
//            "?doi=" + doiSuffix,
//            DataCitationLandingPage.class
//        );
//
//        Assert.assertEquals("doi number incorrect on landing page", landingPage.getDoiNumber(), doiNumber);
//
//        // Return to the /citation/request page...
//        requestPage = goTo(endpoint,
//            "&doi=" + doiSuffix,
//            DataCitationRequestPage.class
//        );
//
//        requestPage.waitForJournalRefLoaded();
//
//        // Update the journal reference and title
//        // one is an XML file change, one is a vospace attribute change
//        String newJournalRef = "2018, Nature, ApJ, 5000, 1000";
//        String newDoiTitle = "Birdsong in the Afternoon: AUTOMATED TEST DOI";
//        requestPage.setDoiTitle(newDoiTitle);
//        requestPage.setJournalRef(newJournalRef);
//
//        requestPage.updateDoi();
//        requestPage.waitForDOIGetDone();
//
//        Assert.assertTrue(requestPage.isStateOkay());
//
//        // Go back to landing page and verify the title and journal reference have changed
//        landingPage = goTo("/citation/landing",
//            "?doi=" + doiSuffix,
//            DataCitationLandingPage.class
//        );
//
//        if (newDoiTitle.equals(landingPage.getDoiTitle())) {
//            Assert.assertEquals("DOI title update didn't succeed", newDoiTitle, landingPage.getDoiTitle());
//        } else {
//            // reload the page - sometimes the update is slow
//            landingPage = goTo("/citation/landing",
//                "?doi=" + doiSuffix,
//                DataCitationLandingPage.class
//            );
//        }
//        Assert.assertEquals("DOI Journal ref update didn't succeed", newJournalRef, landingPage.getDoiJournalRef());
//
//        // Return to the /citation/request page...
//        requestPage = goTo(endpoint,
//            "&doi=" + doiSuffix,
//            DataCitationRequestPage.class
//        );
//
//        // Delete session just created
//        requestPage.deleteDoi();
//        Assert.assertTrue(requestPage.isStateOkay());

        System.out.println("testDoiWorkflow test complete.");
    }

}
