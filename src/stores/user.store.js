import { observable, action } from 'mobx';

export default class UserStore {
  @observable username = null;
  @observable userPreferences = null;

  constructor(authService, userPreferencesService) {
    this.authService = authService;
    this.userPreferencesService = userPreferencesService;
  }

  @action
  async signin(username, password) {
    this.username = await this.authService.signin(username, password);
  }

  @action
  async signup(formData) {
    return await this.authService.signup(formData);
  }

  @action
  async updateUserPreferences(formData) {
    return await this.userPreferencesService.updateUserPreferences(formData);
  }

  @action
  async getUserPreferences() {
    const result = await this.userPreferencesService.getUserPreferences();

    if (result){
      this.userPreferences = result.data;
    }
    return result.data;
  }

  @action
  signout() {
    this.username = null;
    this.authService.removeToken();
  }
}
