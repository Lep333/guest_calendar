import GuestCalendar from './GuestCalendar.vue';
import type { App } from 'vue';

export default {
  install(app: App) {
    app.component('MyComponent', GuestCalendar);
  }
};

export { GuestCalendar };
