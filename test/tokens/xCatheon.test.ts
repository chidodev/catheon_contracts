import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { FakeContract, smock } from "@defi-wonderland/smock";
import {
    CatheonStaking,
    XCatheon,
    XCatheon__factory,
    CatheonBEP20Token,
    CatheonBEP20Token__factory,
    CatheonAuthority__factory,
} from "../../types";

describe("xCatheon Test", () => {
    let deployer: SignerWithAddress;
    let vault: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let catheon: CatheonBEP20Token;
    let xCatheon: XCatheon;
    let stakingFake: FakeContract<CatheonStaking>;

    beforeEach(async () => {
        [deployer, vault, bob, alice] = await ethers.getSigners();
        stakingFake = await smock.fake<CatheonStaking>("CatheonStaking");
        const authority = await new CatheonAuthority__factory(deployer).deploy(
            deployer.address,
            deployer.address,
            vault.address
        );
        await authority.deployed();

        xCatheon = await new XCatheon__factory(deployer).deploy();
    });

    it("correctly constructs an ERC20", async () => {
        expect(await xCatheon.name()).to.equal("xCatheon");
        expect(await xCatheon.symbol()).to.equal("xCHN");
        expect(await xCatheon.decimals()).to.equal(9);
    });

    describe("initialization", () => {
        
        describe("initialize", () => {
           
            it("emits LogStakingContractUpdated event", async () => {
                await expect(
                    xCatheon.connect(deployer).initialize(alice.address)
                )
                    .to.emit(xCatheon, "LogStakingContractUpdated")
                    .withArgs(alice.address);
            });

        });
    });

    describe("mint", () => {
        beforeEach(async () => {
            await xCatheon.connect(deployer).initialize(alice.address);
            
            
        });

        it("must be done by smart contract", async () => {
            await expect(xCatheon.connect(bob).mint(alice.address, 100)).to.be.revertedWith(
                "StakingContract:  call is not staking contract"
            );
        });

        it("increases total supply", async () => {
            const supplyBefore = await xCatheon.totalSupply();
            await xCatheon.connect(alice).mint(alice.address, 100);
            expect(supplyBefore.add(100)).to.equal(await xCatheon.totalSupply());
        });
    });

    describe("burn", () => {
        beforeEach(async () => {
            await xCatheon.connect(deployer).initialize(bob.address);
            await xCatheon.connect(bob).mint(bob.address, 100);
            
        });

        it("reduces the total supply", async () => {
            const supplyBefore = await xCatheon.totalSupply();
            await xCatheon.connect(bob).burn(10);
            expect(supplyBefore.sub(10)).to.equal(await xCatheon.totalSupply());
        });


    });
});
