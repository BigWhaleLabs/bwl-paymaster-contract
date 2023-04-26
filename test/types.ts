import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import type { BWLPaymaster, BWLPaymaster__factory } from '../typechain'

declare module 'mocha' {
  export interface Context {
    // Facoriries for contracts
    bwlPaymaster: BWLPaymaster
    contractWithIncorrectOwner: BWLPaymaster
    bwlPaymasterFactory: BWLPaymaster__factory
    // Signers
    accounts: SignerWithAddress[]
    owner: SignerWithAddress
    user: SignerWithAddress
    targets: string[]
  }
}
