// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  coral: {
    root: path(ROOTS_DASHBOARD, '/coral'),
    list: path(ROOTS_DASHBOARD, '/coral/list'),
    new: path(ROOTS_DASHBOARD, '/coral/new'),
    type: path(ROOTS_DASHBOARD, '/coral/type'),
    listType: path(ROOTS_DASHBOARD, '/coral/coral-type-list')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, '/user/ada-lindgren/edit'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  phases: {
    root: path(ROOTS_DASHBOARD, '/phases'),
    new: path(ROOTS_DASHBOARD, '/phases/new'),
    typeNew: path(ROOTS_DASHBOARD, '/phases/type/new')
  },
  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    shop: path(ROOTS_DASHBOARD, '/area/shop'),
    product: path(ROOTS_DASHBOARD, '/area/:name'),
    productById: path(ROOTS_DASHBOARD, '/area/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/area/list'),
    new: path(ROOTS_DASHBOARD, '/area/new'),
    newProvince: path(ROOTS_DASHBOARD, '/area/product/province'),
    editById: path(ROOTS_DASHBOARD, '/area/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/area/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/area/invoice')
  },
  coralArea: {
    root: path(ROOTS_DASHBOARD, '/coralarea'),
    list: path(ROOTS_DASHBOARD, '/coralarea/list'),
    new: path(ROOTS_DASHBOARD, '/coralarea/new'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/portfolio-review-is-this-portfolio-too-creative'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
  },
  site: {
    root: path(ROOTS_DASHBOARD, '/site'),
    list: path(ROOTS_DASHBOARD, '/site/list'),
    newSite: path(ROOTS_DASHBOARD, '/site/new'),
    editByIdSite: path(ROOTS_DASHBOARD, '/site/:name/edit')
  },
  garden: {
    root: path(ROOTS_DASHBOARD, '/garden'),
    list: path(ROOTS_DASHBOARD, '/garden/list'),
    typesList: path(ROOTS_DASHBOARD, '/garden/types'),
    newGarden: path(ROOTS_DASHBOARD, '/garden/new'),
    newGardenType: path(ROOTS_DASHBOARD, '/garden/type-new'),
    editByIdGarden: path(ROOTS_DASHBOARD, '/garden/:name/edit'),
    editByIdGardenType: path(ROOTS_DASHBOARD, '/garden/types/:name/edit')
  },
  diver: {
    root: path(ROOTS_DASHBOARD, '/diver'),
    list: path(ROOTS_DASHBOARD, '/diver/list'),
    newDiver: path(ROOTS_DASHBOARD, '/diver/new')
  },
  service: {
    root: path(ROOTS_DASHBOARD, '/service'),
    list: path(ROOTS_DASHBOARD, '/service/list'),
    newService: path(ROOTS_DASHBOARD, '/service/new'),
    editByIdService: path(ROOTS_DASHBOARD, '/service/:name/edit')
  },
  partner: {
    root: path(ROOTS_DASHBOARD, '/partner'),
    list: path(ROOTS_DASHBOARD, '/partner/list'),
    newPartner: path(ROOTS_DASHBOARD, '/partner/new'),
    editByIdPartner: path(ROOTS_DASHBOARD, '/partner/:name/edit'),
    manageOrderPartner: path(ROOTS_DASHBOARD, '/partner/:name/manageOrderPartner')
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/order'),
    list: path(ROOTS_DASHBOARD, '/order/list'),
    detailOrder: path(ROOTS_DASHBOARD, '/order/:name/detail')
    // editByIdOrder: path(ROOTS_DASHBOARD, '/order/:name/edit')
  },
  groupRole: {
    root: path(ROOTS_DASHBOARD, '/groupRole'),
    list: path(ROOTS_DASHBOARD, '/groupRole/list'),
    newGroupRole: path(ROOTS_DASHBOARD, '/groupRole/new'),
    editByIdGroupRole: path(ROOTS_DASHBOARD, '/groupRole/:name/edit')
  },
  group: {
    root: path(ROOTS_DASHBOARD, '/group'),
    list: path(ROOTS_DASHBOARD, '/group/list'),
    newGroup: path(ROOTS_DASHBOARD, '/group/new'),
    editByIdGroup: path(ROOTS_DASHBOARD, '/group/:name/edit')
  },
  siteInfo: {
    root: path(ROOTS_DASHBOARD, '/siteInfo/information'),
    information: path(ROOTS_DASHBOARD, '/siteInfo/information'),
    editByIdInformation: path(ROOTS_DASHBOARD, '/siteInfo/:name/edit')
  },
  report: {
    root: path(ROOTS_DASHBOARD, '/report/'),
    reportDetail: path(ROOTS_DASHBOARD, '/report/reportDetail')
  },
  exerciseType: {
    root: path(ROOTS_DASHBOARD, '/exercisetype'),
    list: path(ROOTS_DASHBOARD, '/exercisetype/list'),
    newExerciseType: path(ROOTS_DASHBOARD, '/exercisetype/new'),
    editByExerciseTypeId: path(ROOTS_DASHBOARD, '/exercisetype/:name/edit')
  },
  excercise: {
    root: path(ROOTS_DASHBOARD, '/excercise'),
    list: path(ROOTS_DASHBOARD, '/excercise/exercisetype/:name/list'),
    newExerciseType: path(ROOTS_DASHBOARD, '/exercisetype/new'),
    editByExerciseTypeId: path(ROOTS_DASHBOARD, '/:name/edit')
  },
  patient: {
    root: path(ROOTS_DASHBOARD, '/patient'),
    list: path(ROOTS_DASHBOARD, '/patient/list'),
    newPatient: path(ROOTS_DASHBOARD, '/patient/new')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
