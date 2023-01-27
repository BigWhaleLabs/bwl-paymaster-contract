import {
  GSN_FORWARDER_CONTRACT_ADDRESS,
  GSN_RELAY_HUB_CONTRACT_ADDRESS,
  SC_EMAIL_LEDGER_CONTRACT_ADDRESS,
  SC_EMAIL_POSTS_CONTRACT_ADDRESS,
  SC_ERC721_LEDGER_CONTRACT_ADDRESS,
  SC_ERC721_POSTS_CONTRACT_ADDRESS,
  SC_EXTERNAL_ERC721_LEDGER_CONTRACT_ADDRESS,
  SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { ethers, run } from 'hardhat'
import { utils } from 'ethers'

const { formatEther } = utils
const TARGETS = [
  '0xf6605a714d18f55687f8b50683b2ed054425a5db',
  '0x69249cc5bef51041248107135c89e2f0db08bf9f',
  '0x558fff0c9e265f807b05f7ff5da33c8e2031fe6e',
]

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with the account:', deployer.address)
  console.log('Account balance:', formatEther(await deployer.getBalance()))
  const provider = ethers.provider
  const { chainId } = await provider.getNetwork()
  const chains = {
    1: 'mainnet',
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
  } as { [chainId: number]: string }
  const chainName = chains[chainId]

  const contractName = 'SealCredPaymaster'
  console.log(`Deploying ${contractName}...`)
  const Contract = await ethers.getContractFactory(contractName)
  const targets = [
    SC_EMAIL_LEDGER_CONTRACT_ADDRESS,
    SC_EMAIL_POSTS_CONTRACT_ADDRESS,
    SC_ERC721_LEDGER_CONTRACT_ADDRESS,
    SC_ERC721_POSTS_CONTRACT_ADDRESS,
    SC_EXTERNAL_ERC721_LEDGER_CONTRACT_ADDRESS,
    SC_EXTERNAL_ERC721_POSTS_CONTRACT_ADDRESS,
  ]
  const contract = await Contract.deploy(targets)
  const {
    address,
    setRelayHub,
    setTrustedForwarder,
    deployTransaction,
    addTargets,
  } = contract
  console.log(`Deploying to ${address} on ${chainName}...`)
  console.log(
    'Deploy tx gas price:',
    formatEther(deployTransaction.gasPrice || 0)
  )
  console.log('Deploy tx gas limit:', formatEther(deployTransaction.gasLimit))
  await contract.deployed()

  console.log('Contract deployed to:', address)
  console.log('Wait for 1 minute to make sure blockchain is updated')
  await new Promise((resolve) => setTimeout(resolve, 60 * 1000))

  console.log('Verifying contract on Etherscan')
  try {
    await run('verify:verify', {
      address,
      constructorArguments: [targets],
    })
  } catch (err) {
    console.log(
      'Error verifying contract on Etherscan:',
      err instanceof Error ? err.message : err
    )
  }

  console.log('Setting relay hub and trusted forwarder...')
  try {
    await setRelayHub(GSN_RELAY_HUB_CONTRACT_ADDRESS)
    await setTrustedForwarder(GSN_FORWARDER_CONTRACT_ADDRESS)
    await addTargets(TARGETS)
  } catch (err) {
    console.log(
      'Error setting relay hub or trusted forwarder for contract, check the RelayHub version:',
      err instanceof Error ? err.message : err
    )
  }

  console.log(`${contractName} deployed and verified on Etherscan!`)
  console.log('Contract address:', address)
  console.log(
    'Etherscan URL:',
    `https://${
      chainName !== 'mainnet' ? `${chainName}.` : ''
    }etherscan.io/address/${address}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
