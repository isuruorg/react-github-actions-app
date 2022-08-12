// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban')
};

const DataEntrySideBarConfig = [
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      { title: 'polygon marker', path: PATH_DASHBOARD.general.map, icon: ICONS.ecommerce }
    ]
  }
];

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      { title: 'polygon marker', path: PATH_DASHBOARD.general.map, icon: ICONS.ecommerce }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'users',
        path: PATH_DASHBOARD.users.root,
        icon: ICONS.user
      },

      // MANAGEMENT : E-COMMERCE
      {
        title: 'companies',
        path: PATH_DASHBOARD.companies.root,
        icon: ICONS.blog
      },
      {
        title: 'chains',
        path: PATH_DASHBOARD.general.chains,
        icon: ICONS.cart
      },
      {
        title: 'brands',
        path: '403',
        icon: ICONS.mail
      },
      {
        title: 'jobs',
        path: '402',
        icon: ICONS.ecommerce
      },
      {
        title: 'labels',
        path: '401',
        icon: ICONS.kanban
      },
      {
        title: 'reports',
        path: PATH_DASHBOARD.general.reports,
        icon: ICONS.kanban
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'data mart',
    items: [
      { title: 'import', path: PATH_DASHBOARD.mail.root, icon: ICONS.mail },
      { title: 'update', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      { title: 'compare', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      { title: 'extraction', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban }
    ]
  }
];

export default sidebarConfig;
export { DataEntrySideBarConfig };
