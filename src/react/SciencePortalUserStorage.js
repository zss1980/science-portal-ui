import React, { useEffect, useState, useMemo } from "react";
import { Col, Row, Card, Placeholder, ProgressBar, Alert, OverlayTrigger, Popover, Tooltip, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./css/index.css";
import "./sp-session-list.css";
import { parseVospaceXML } from "./utilities/parseVospaceXML";

const END_POINT = `https://ws-uv.canfar.net/arc/nodes/home/`;

const TEST_DATA = {
    size: 11281596360,
    quota: 200000000000,
    date: "Jun 11, 2025, 11:27:58 PM PDT",
    usage: 5.64079818
};

// Optimized file size formatter
const humanFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) return `${bytes} B`;

    const units = ["KB", "MB", "GB", "TB", "PB"];
    let u = -1;
    let size = bytes;

    do {
        size /= thresh;
        ++u;
    } while (Math.abs(size) >= thresh && u < units.length - 1);

    return `${size.toFixed(size < 10 ? 2 : 1)} ${units[u]}`;
};

// Format date for UTC display
const formatDateUTC = (dateString) => {
    if (!dateString) return "Unknown";
    try {
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
    } catch {
        return "Unknown";
    }
};

// Storage Card Component
const StorageCard = ({ label, value, isLoading }) => (
    <Col md={4} xs={6} className="mb-3">
        <Card className="h-100 shadow-sm rounded-4 text-center">
            <Card.Body>
                <div className="text-dark fw-bold mb-2">{label}</div>
                <div className="fs-5 text-primary fw-bold">
                    {isLoading || !value ? (
                        <Placeholder as="div" animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                    ) : (
                        value
                    )}
                </div>
            </Card.Body>
        </Card>
    </Col>
);

function SciencePortalUserStorage({ isAuthenticated, name }) {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    // Card configuration mapped to data keys
    const cardConfigs = [
        { key: 'size', label: 'Total Size', formatter: humanFileSize },
        { key: 'quota', label: 'Quota', formatter: humanFileSize },
        { key: 'usage', label: 'Usage', formatter: (val) => `${(val || 0).toFixed(1)}%` },
    ];

    // Memoized calculations
    const cardData = useMemo(() => {
        return cardConfigs.map(config => ({
            label: config.label,
            value: config.formatter(data?.[config.key])
        }));
    }, [data]);

    const lastUpdate = useMemo(() => {
        return data?.date ? formatDateUTC(data.date) : null;
    }, [data?.date]);

    const fetchStorageData = async () => {
        setFetching(true);

        try {
            const response = await fetch(`${END_POINT}${name}`, {
                headers: { Accept: "application/xml" },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const xmlString = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlString, "text/xml");

            const parsedData = parseVospaceXML(xml);
            setData(parsedData);
        } catch (err) {
            console.error('Storage data fetch error:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleRefresh = () => {
        if (name && name !== 'Login') {
            fetchStorageData();
        }
    };

    useEffect(() => {
        if (!isAuthenticated || name === 'Login') return;
        fetchStorageData();
    }, [isAuthenticated, name]);

    return (
        <>
            {/* Header with title and controls */}
            <div className="sp-title sp-panel-heading">
                User Storage

                <OverlayTrigger
                    trigger="click"
                    key="info"
                    placement="top"
                    rootClose={true}
                    overlay={
                        <Popover id="popover-user-storage-info">
                            <Popover.Header as="h3">User Storage</Popover.Header>
                            <Popover.Body className="sp-form">
                                You won't be able to run a session if your storage is full.
                            </Popover.Body>
                        </Popover>
                    }
                >
                    <FontAwesomeIcon
                        className="sp-form-cursor popover-blue"
                        icon={faQuestionCircle}
                    />
                </OverlayTrigger>

                <span className="sp-header-button">
          <OverlayTrigger
              key="refresh"
              placement="top"
              className="sp-b-tooltip"
              overlay={
                  <Tooltip className="sp-b-tooltip">
                      Refresh storage
                  </Tooltip>
              }
          >
            <Button
                size="sm"
                variant="outline-primary"
                className="sp-e-usage-reload sp-session-usage"
                onClick={handleRefresh}
                disabled={fetching}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </Button>
          </OverlayTrigger>
        </span>
            </div>

            {/* Progress bar */}
            <Row>
                <Col>
                    <ProgressBar
                        variant={fetching ? 'info' : 'success'}
                        now={100}
                        animated={fetching}
                        className="sp-progress-bar"
                    />
                </Col>
            </Row>

            {/* Storage cards */}
            <div>
                <Row className="justify-content-center" style={{ maxWidth: 900, margin: "0 auto" }}>
                    {cardData.map((card, index) => (
                        <StorageCard
                            key={index}
                            label={card.label}
                            value={card.value}
                            isLoading={fetching}
                        />
                    ))}
                </Row>

                {/* Last update timestamp */}
                {lastUpdate && (
                    <Row className="sp-usage-pie-row">
                        <Col>
                            <div className="sp-usage-text-date">
                                last update: <span className="sp-usage-text">{lastUpdate}</span>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </>
    );
}

export default SciencePortalUserStorage;