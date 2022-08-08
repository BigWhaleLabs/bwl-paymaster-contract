import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'

import type {
  SealCredPaymaster,
  SealCredPaymaster__factory,
} from '../typechain'

declare module 'mocha' {
  export interface Context {
    // Facoriries for contracts
    sealCredPaymaster: SealCredPaymaster
    contractWithIncorrectOwner: SealCredPaymaster
    sealCredPaymasterFactory: SealCredPaymaster__factory
    // Signers
    accounts: SignerWithAddress[]
    owner: SignerWithAddress
    user: SignerWithAddress
    targets: string[]
  }
}
