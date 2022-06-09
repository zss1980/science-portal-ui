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

import ca.nrc.cadc.web.selenium.AbstractTestWebPage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class SciencePortalPage extends AbstractTestWebPage {
    protected static final By SP_TITLE_BY = By.id("doi_title");
    protected static final By SP_LOGOUT_BY = By.id("logout");
    protected static final By SP_INFO_PANEL = By.className("alert-danger");
    protected static final By SP_MODAL_LOGIN = By.xpath("//*[@id=\"modalloginForm\"]/div[2]/button");


    @FindBy(className = "sp-progress-bar")
    WebElement statusBar;

    @FindBy(id = "modalUsername")
    WebElement modalUsernameInput;

    @FindBy(id = "modalPassword")
    WebElement modalPasswordInput;

    @FindBy(id = "logout")
    WebElement logout;

    @FindBy(className = "user-actions")
    WebElement userActionDropdown;

    public SciencePortalPage(WebDriver driver) throws Exception {
        super(driver);
        PageFactory.initElements(driver, this);
    }

    protected void pageLoadLogin() throws Exception {
        // timing here is bad. By the time the modal is rendered, the sendKeys
//        // can sometimes be already run (or partially run?), and for whatever reason only some of
//        // the values get sent. :(
//        // This first wait for seems the most stable answer to the problem...
//
//        waitForElementClickable(SP_MODAL_LOGIN);
//
//        // TODO in CADC-9211: pull username/pwd from the system environment as they
//        // are already in the build.gradle file. -
//        //sendKeys(modalUsernameInput,"CADCtest");
//        //sendKeys(modalPasswordInput, "sywymUL4");
//        modalPasswordInput.submit();
//
//        waitForElementNotPresent(SP_MODAL_LOGIN);
    }

    protected void logout() throws Exception {
//        waitForElementClickable(userActionDropdown);
//        click(userActionDropdown);
//        waitForElementPresent(SP_LOGOUT_BY);
//        click(logout);
    }

    protected boolean isStateOkay() {
        return statusBar.getAttribute("class").contains("progress-bar-success");
    }

}
