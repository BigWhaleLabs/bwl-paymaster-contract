import { ethers } from 'hardhat'
import { expect } from 'chai'

const targets = [
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
  '0x0000000000000000000000000000000000000004',
]

describe('SealCredPaymaster', () => {
  before(async function () {
    this.accounts = await ethers.getSigners()
    this.owner = this.accounts[0]
    this.user = this.accounts[1]
    this.targets = targets
    this.sealCredPaymasterFactory = await ethers.getContractFactory(
      'SealCredPaymaster'
    )
  })

  beforeEach(async function () {
    this.sealCredPaymaster = await this.sealCredPaymasterFactory.deploy(
      this.targets
    )
    await this.sealCredPaymaster.connect(this.owner)
    await this.sealCredPaymaster.deployed()
  })

  describe('Constructor', function () {
    beforeEach(async function () {
      this.sealCredPaymaster = await this.sealCredPaymasterFactory.deploy(
        this.targets
      )
      await this.sealCredPaymaster.connect(this.owner)
      await this.sealCredPaymaster.deployed()
    })
    it('should deploy the contract with the correct fields', async function () {
      for (let i = 0; i < 5; i++) {
        expect(await this.sealCredPaymaster.targets(this.targets[i])).to.be.true
      }
    })
  })
  describe('Owner-only calls from non-owner', function () {
    before(function () {
      this.contractWithIncorrectOwner = this.sealCredPaymaster.connect(
        this.user
      )
    })
    it('should not be able to call addTargets', async function () {
      await expect(
        this.contractWithIncorrectOwner.addTargets(this.targets)
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
    it('should not be able to call removeTargets', async function () {
      await expect(
        this.contractWithIncorrectOwner.removeTargets(this.targets)
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })
})
