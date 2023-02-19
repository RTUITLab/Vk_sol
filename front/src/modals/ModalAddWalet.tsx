import { back, useParams } from '@cteamdev/router';
import { useAtomValue } from '@mntm/precoil';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Icon24Done, Icon24Error } from '@vkontakte/icons';
import { Button, FormItem, FormLayout, Input, ModalCard, ModalCardBaseProps, ModalCardProps, Snackbar } from '@vkontakte/vkui';
import React, { useState } from 'react';
import { api } from '../api';
import { eventIdAtom } from '../store';

export const ModalAddWalet: React.FC<ModalCardProps> = ({ nav }: ModalCardProps) => {

    const [walletId, setWalletId] = useState('')
    const eventId = useParams().id

    const { mutate, error } = useMutation({ mutationKey: ['add_to_whitelist'], mutationFn: () => api.addToWhiteList(eventId, walletId), onSuccess: handleSuccess, onError: handleError })


    const [snackbar, setSnackbar] = useState<JSX.Element | null>(null)
    const successSnackbar = <Snackbar
        onClose={() => setSnackbar(null)}
        before={<Icon24Done />}
    >
        Пользователь успешно добавлен
    </Snackbar>
    const errorSnackbar = <Snackbar
        onClose={() => setSnackbar(null)}
        before={<Icon24Error />}
    >
        Ошбка при добавлении в вайтлист
    </Snackbar>

    function handleError() {
        console.log('error', error);
        setSnackbar(errorSnackbar)
    }
    function handleSuccess() {
        setSnackbar(successSnackbar)
        back()
    }

    function handleAddWallet() {
        mutate()
    }
    return (
        <ModalCard
            nav={nav}
            onClose={back}
            header='Добавить в вайтлист'
            actions={
                <Button size='l' onClick={handleAddWallet}>
                    Добавить
                </Button>
            }

        >
            <FormLayout>
                <FormItem top='Идентификатор кошелька'>
                    <Input
                        value={walletId}
                        onChange={e => setWalletId(e.target.value)}
                        type={'text'}
                        placeholder='Введите название'
                    />
                </FormItem>

            </FormLayout>
            {snackbar}
        </ModalCard>
    );
}

export default ModalAddWalet;