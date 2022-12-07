// lang
import useLocales from 'hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  coral: getIcon('ic_coral'),
  coralArea: getIcon('ic_coral_area'),
  garden: getIcon('ic_garden'),
  diver: getIcon('ic_diver'),
  area: getIcon('ic_area'),
  phases: getIcon('ic_phases'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban'),
  service: getIcon('ic_ecommerce')
};

export default function SidebarConfig() {
  const { translate } = useLocales();
  const sidebarConfig = [
    // GENERAL
    // ----------------------------------------------------------------------
    // {
    //   subheader: 'general',
    //   items: [
    //     {
    //       title: 'app',
    //       path: PATH_DASHBOARD.general.app,
    //       icon: ICONS.dashboard
    //     },
    //     { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
    //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }
    //   ]
    // },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: translate('menu.sideBar.title'),
      items: [
        {
          title: translate('menu.sideBar.item.product'),
          path: PATH_DASHBOARD.service.list,
          icon: ICONS.service
        },
        // {
        //   title: translate('menu.sideBar.item.partner'),
        //   path: PATH_DASHBOARD.partner.root,
        //   icon: ICONS.user,
        //   children: [
        //     {
        //       title: 'List',
        //       path: PATH_DASHBOARD.partner.list
        //     },
        //     {
        //       title: 'Report',
        //       path: PATH_DASHBOARD.report.reportDetail
        //     }
        //   ]
        // },
        {
          title: translate('menu.sideBar.item.partner'),
          path: PATH_DASHBOARD.partner.list,
          icon: ICONS.user
        },

        {
          title: translate('menu.sideBar.item.order'),
          path: PATH_DASHBOARD.order.list,
          icon: ICONS.kanban
        },
        {
          title: translate('menu.sideBar.item.report'),
          path: PATH_DASHBOARD.report.reportDetail,
          icon: ICONS.analytics
        }
      ]
    }
  ];
  return sidebarConfig;
}
