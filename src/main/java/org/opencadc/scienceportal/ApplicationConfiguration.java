package org.opencadc.scienceportal;


import ca.nrc.cadc.reg.client.RegistryClient;
import ca.nrc.cadc.util.StringUtil;

import java.net.URI;
import java.net.URL;
import java.util.Arrays;
import java.util.Date;

import org.apache.commons.configuration2.CombinedConfiguration;
import org.apache.commons.configuration2.Configuration;
import org.apache.commons.configuration2.PropertiesConfiguration;
import org.apache.commons.configuration2.SystemConfiguration;
import org.apache.commons.configuration2.builder.FileBasedConfigurationBuilder;
import org.apache.commons.configuration2.builder.fluent.Parameters;
import org.apache.commons.configuration2.ex.ConfigurationException;
import org.apache.commons.configuration2.tree.MergeCombiner;
import org.apache.log4j.Logger;
import org.json.JSONObject;


public class ApplicationConfiguration {

    // Included in the JSP
    public static final long BUILD_TIME_MS = new Date().getTime();

    private static final Logger LOGGER = Logger.getLogger(ApplicationConfiguration.class);

    public static final String DEFAULT_CONFIG_FILE_PATH = System.getProperty("user.home")
                                                          + "/config/org.opencadc.science-portal.properties";
    public static final String PROPERTY_NAME_PREFIX = "org.opencadc.science-portal";
    public static final String RESOURCE_ID_PROPERTY_KEY =
            String.format("%s.sessions.resourceID", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    public static final String STANDARD_ID_PROPERTY_KEY =
            String.format("%s.sessions.standard", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    public static final String LOGO_URL_PROPERTY_KEY =
            String.format("%s.logoURL", ApplicationConfiguration.PROPERTY_NAME_PREFIX);
    public static final String BANNER_MESSAGE_PROPERTY_KEY =
            String.format("%s.sessions.bannerText", ApplicationConfiguration.PROPERTY_NAME_PREFIX);

    private final Configuration configuration;
    private final String filePath;


    public ApplicationConfiguration() {
        this.filePath = ApplicationConfiguration.DEFAULT_CONFIG_FILE_PATH;

        final CombinedConfiguration combinedConfiguration = new CombinedConfiguration(new MergeCombiner());

        // Prefer System properties.
        combinedConfiguration.addConfiguration(new SystemConfiguration());

        final Parameters parameters = new Parameters();
        final FileBasedConfigurationBuilder<PropertiesConfiguration> builder =
                new FileBasedConfigurationBuilder<>(PropertiesConfiguration.class)
                        .configure(parameters.properties().setFileName(filePath));

        try {
            combinedConfiguration.addConfiguration(builder.getConfiguration());
        } catch (ConfigurationException exception) {
            LOGGER.warn(String.format("No configuration found at %s.\nUsing defaults.", filePath));
        }

        this.configuration = combinedConfiguration;
    }

    public String getResourceID() {
        return getStringValue(ApplicationConfiguration.RESOURCE_ID_PROPERTY_KEY, true);
    }

    public String getStandardID() {
        return getStringValue(ApplicationConfiguration.STANDARD_ID_PROPERTY_KEY, true);
    }

    public String getBannerMessage() {
        return getStringValue(ApplicationConfiguration.BANNER_MESSAGE_PROPERTY_KEY, false);
    }

    public String getLogoURL() {
        return getStringValue(ApplicationConfiguration.LOGO_URL_PROPERTY_KEY, true);
    }

    /**
     * Pull the /applications header URLs.
     * @return  JSONObject of header URIs to URLs.
     */
    public JSONObject getHeaderURLs() {
        final RegistryClient registryClient = new RegistryClient();
        final JSONObject jsonObject = new JSONObject();

        Arrays.stream(ApplicationStandards.values()).forEach(applicationStandard -> {
            try {
                jsonObject.put(applicationStandard.standardID.toString(),
                               registryClient.getAccessURL(RegistryClient.Query.APPLICATIONS,
                                                           applicationStandard.standardID));
            } catch (Exception e) {
                LOGGER.warn("Unable to get Applications URL for " + applicationStandard.standardID, e);
            }
        });

        return jsonObject;
    }

    protected String getStringValue(final String key, final boolean required) {
        final String val = this.configuration.getString(key);

        if (required && !StringUtil.hasText(val)) {
            throw new IllegalStateException("Configuration property " + key + " is missing or invalid at "
                                            + this.filePath);
        } else {
            return val;
        }
    }

    /**
     */
    private enum ApplicationStandards {
        PASSWORD_CHANGE(URI.create("ivo://cadc.nrc.ca/passchg")),
        PASSWORD_RESET(URI.create("ivo://cadc.nrc.ca/passreset")),
        ACCOUNT_REQUEST(URI.create("ivo://cadc.nrc.ca/acctrequest")),
        ACCOUNT_UPDATE(URI.create("ivo://cadc.nrc.ca/acctupdate")),
        GMUI(URI.create("ivo://cadc.nrc.ca/groups")),
        SEARCH(URI.create("ivo://cadc.nrc.ca/search"));

        final URI standardID;

        ApplicationStandards(URI standardID) {
            this.standardID = standardID;
        }
    }
}
