import { AuthRepository, IAuthRepository } from '../repositories/AuthRepository';

const authRepository: IAuthRepository = new AuthRepository();

export const saveAuthSetup = async (isSetup: boolean): Promise<void> => {
  await authRepository.saveAuthSetup(isSetup);
};

export const loadAuthSetup = async (): Promise<boolean> => {
  return await authRepository.loadAuthSetup();
};

export const saveAuthEnabled = async (enabled: boolean): Promise<void> => {
  await authRepository.saveAuthEnabled(enabled);
};

export const loadAuthEnabled = async (): Promise<boolean> => {
  return await authRepository.loadAuthEnabled();
};
