import React from 'react';

import { Map } from 'immutable';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';

import { useNotification } from '@strapi/helper-plugin';
import { Text, H3 } from '@strapi/design-system/Text';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Link } from '@strapi/design-system/Link';

import { generateSitemap } from '../../state/actions/Sitemap';
import { formatTime } from '../../helpers/timeFormat';

const Info = () => {
  const hasHostname = useSelector((state) => state.getIn(['sitemap', 'initialData', 'hostname'], Map()));
  const sitemapInfo = useSelector((state) => state.getIn(['sitemap', 'info'], Map()));
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();

  const updateDate = new Date(sitemapInfo.get('updateTime'));

  // Format month, day and time.
  const month = updateDate.toLocaleString('en', { month: 'numeric' });
  const day = updateDate.toLocaleString('en', { day: 'numeric' });
  const year = updateDate.getFullYear().toString().substr(-2);
  const time = formatTime(updateDate, true);

  const content = () => {
    if (!hasHostname) {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoHostname.Title' })}
          </H3>
          <div>
            <Text>
              {formatMessage({ id: 'sitemap.Info.NoHostname.Description' })}
            </Text>
            <Button
              onClick={() => {
                document.getElementById('tabs-2-tab').click();
                setTimeout(() => document.querySelector('input[name="hostname"]').focus(), 0);
              }}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.GoToSettings' })}
            </Button>
          </div>
        </div>
      );
    } else if (sitemapInfo.size === 0) {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoSitemap.Title' })}
          </H3>
          <div>
            <Text>
              {formatMessage({ id: 'sitemap.Info.NoSitemap.Description' })}
            </Text>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification))}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate' })}
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <H3 style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.Title' })}
          </H3>
          <div>
            <Text>
              {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.LastUpdatedAt' })}
            </Text>
            <Text bold style={{ marginLeft: '5px' }}>
              {`${month}/${day}/${year} - ${time}`}
            </Text>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <Text>
              {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.AmountOfURLs' })}
            </Text>
            <Text bold style={{ marginLeft: '5px' }}>
              {sitemapInfo.get('urls')}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification))}
              variant="secondary"
              style={{ marginRight: '10px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate' })}
            </Button>
            <Link
              href={sitemapInfo.get('location')}
              target="_blank"
            >
              {formatMessage({ id: 'sitemap.Header.Button.SitemapLink' })}
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <Box paddingLeft={8} paddingRight={8}>
      <Box
        background="neutral0"
        hasRadius
        paddingTop={4}
        paddingBottom={4}
        paddingLeft={5}
        paddingRight={5}
        shadow="filterShadow"
      >
        {content()}
      </Box>
    </Box>
  );
};

export default Info;
