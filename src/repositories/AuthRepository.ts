import { IStorage } from '../interfaces/IStorage';
import { AsyncStorageService } from '../services/StorageService';

export interface IAuthRepository {
  saveAuthSetup(isSetup: boolean): Promise<void>;
  loadAuthSetup(): Promise<boolean>;
}

export class AuthRepository implements IAuthRepository {
  private readonly AUTH_SETUP_KEY = '@auth_setup';
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
      return isSetup ?? true;
    } catch (error) {
      console.error('Error loading auth setup from repository:', error);
      return true;
    }
  }
}
