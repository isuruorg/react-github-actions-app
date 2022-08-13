import { useState } from 'react';

import { capitalCase } from 'change-case';
import { Container, Tab, Box, Tabs, Stack } from '@material-ui/core';
import { Icon } from '@iconify/react';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';

import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import PolygonMarkingSummaryReport from './admin/PolygonMarkingSummaryReport';
import PolygonMarkingDetailReport from './dataEntry/PolygonMarkingDetailReport';

const TAB_TYPES = ['admin', 'data_entry'];

export default function Reports() {
  const [currentTab, setCurrentTab] = useState(TAB_TYPES[0]);
  const REPORT_TABS = [
    {
      value: TAB_TYPES[0],
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <PolygonMarkingSummaryReport />
    },
    {
      value: TAB_TYPES[1],
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <PolygonMarkingDetailReport />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="TraceClaw: Reports">
      <Container>
        <HeaderBreadcrumbs
          heading="Reports"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Reports' }]}
        />

        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {REPORT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {REPORT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}
