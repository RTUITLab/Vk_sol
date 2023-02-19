import { atom } from '@mntm/precoil'
import { UserInfo } from '@vkontakte/vk-bridge'
import { Snackbar } from '../types'

export const vkUserAtom = atom<UserInfo>({} as UserInfo, 'vkUser')

export const userAtom = atom<StoreData>({ isAdmin: false, walletAddress: '' }, 'user')

export const eventIdAtom = atom<string>('', 'eventID')

export const snackbarAtom = atom<Snackbar | undefined>(undefined, 'snackbar')
