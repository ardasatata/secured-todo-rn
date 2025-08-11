import { AuthRepository, IAuthRepository } from '../repositories/AuthRepository';

const authRepository: IAuthRepository = new AuthRepository();

export const saveAuthSetup = async (isSetup: boolean): Promise<void> => {
  await authRepository.saveAuthSetup(isSetup);
};

export const loadAuthSetup = async (): Promise<boolean> => {
  return await authRepository.loadAuthSetup();
};
