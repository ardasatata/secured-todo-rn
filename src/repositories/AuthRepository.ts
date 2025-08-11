import { IStorage } from '../interfaces/IStorage';
import { AsyncStorageService } from '../services/StorageService';

export interface IAuthRepository {
  saveAuthSetup(isSetup: boolean): Promise<void>;
  loadAuthSetup(): Promise<boolean>;
  saveAuthEnabled(enabled: boolean): Promise<void>;
  loadAuthEnabled(): Promise<boolean>;
}

export class AuthRepository implements IAuthRepository {
  private readonly AUTH_SETUP_KEY = '@auth_setup';
  private readonly AUTH_ENABLED_KEY = '@auth_enabled';
  private storage: IStorage;

  constructor(storage: IStorage = new AsyncStorageService()) {
    this.storage = storage;
  }

  async saveAuthSetup(isSetup: boolean): Promise<void> {
    await this.storage.setItem(this.AUTH_SETUP_KEY, isSetup);
  }

  async loadAuthSetup(): Promise<boolean> {
    try {
      const isSetup = await this.storage.getItem<boolean>(this.AUTH_SETUP_KEY);
      return isSetup ?? false;
    } catch (error) {
      console.error('Error loading auth setup from repository:', error);
      return false;
    }
  }

  async saveAuthEnabled(enabled: boolean): Promise<void> {
    await this.storage.setItem(this.AUTH_ENABLED_KEY, enabled);
  }

  async loadAuthEnabled(): Promise<boolean> {
    try {
      const enabled = await this.storage.getItem<boolean>(this.AUTH_ENABLED_KEY);
      return enabled ?? true; // Default to enabled for backward compatibility
    } catch (error) {
      console.error('Error loading auth enabled from repository:', error);
      return true;
    }
  }
}
