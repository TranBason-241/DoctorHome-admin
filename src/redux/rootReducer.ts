import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import gardenReducer from './slices/garden';
import diverReducer from './slices/diver';
import orderReducer from './slices/order';
import serviceReducer from './slices/service';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import groupRoleReducer from './slices/groupRole';
import groupReducer from './slices/group';
import partnerReducer from './slices/partner';
import exerciseTypeReducer from './slices/exerciseType';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  diver: diverReducer,
  service: serviceReducer,
  order: orderReducer,
  groupRole: groupRoleReducer,
  group: groupReducer,
  garden: gardenReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  partner: partnerReducer,
  exerciseType: exerciseTypeReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
