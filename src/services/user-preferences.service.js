import BaseHttpService from './base-http.service';

export default class UserPreferencesService extends BaseHttpService {
    async updateUserPreferences(formData) {
        await this.patch(`userpreferences/update`, formData);
    }

    async getUserPreferences() {
        const result = await this.get('userpreferences');

        if(result)
            return result;
    }
}
