import { useEffect, useState } from 'react'

import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import type { Web3ReactHooks } from '@web3-react/core'

function useBalances(
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined {
    const [balances, setBalances] = useState<BigNumber[] | undefined>()

    useEffect(() => {
        if(provider && accounts?.length){
            let stale = false

            void Promise.all(accounts.map((accounts) => provider.getBalance(accounts))).then((balances) => {
                if(!stale){
                    setBalances(balances)
                }
            })

            return () => {
                stale = true
                setBalances(undefined)
            }
        }
    }, [provider, accounts])

    return balances
}

export function AccountsComponent({
    accounts,
    provider,
    ENSNames,
} : {
    accounts: ReturnType<Web3ReactHooks['useAccounts']>
    provider: ReturnType<Web3ReactHooks['useProvider']>
    ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
}) {
    const balances = useBalances(provider, accounts)

    if(accounts === undefined) return null

    return (
        <div>
            Accounts:{' '}
            <b>
                {accounts.length === 0
                    ? 'None'
                    : accounts?.map((account, i) => (
                        <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <li>{ENSNames?.[i] ?? account}</li>
                            <li>{balances?.[i] ? `(${formatEther(balances[i])} Matic)` : null}</li>
                        </ul>
                    ))
                }
            </b>
        </div>
    )
}