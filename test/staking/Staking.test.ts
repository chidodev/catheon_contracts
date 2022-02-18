import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import chai, { expect } from "chai";
import { ethers } from "hardhat";
const { BigNumber } = ethers;
import { FakeContract, smock } from "@defi-wonderland/smock";
import {
    IxCatheon,
    ICatheon,
    CatheonStaking,
    CatheonStaking__factory,
    CatheonAuthority,
    CatheonAuthority__factory,
} from "../../types";

chai.use(smock.matchers);

const ZERO_ADDRESS = ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

describe("CatheonStaking", () => {
    let owner: SignerWithAddress;
    let governor: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let other: SignerWithAddress;
    let catheonFake: FakeContract<ICatheon>;
    let xCatheonFake: FakeContract<IxCatheon>;
    let staking: CatheonStaking;
    let authority: CatheonAuthority;

    beforeEach(async () => {
        [owner, governor, alice, bob, other] = await ethers.getSigners();
        catheonFake = await smock.fake<ICatheon>("ICatheon");
        
        // need to be specific because IxCatheon is also defined in OLD
        xCatheonFake = await smock.fake<IxCatheon>("contracts/interfaces/IxCatheon.sol:IxCatheon");
        
        authority = await new CatheonAuthority__factory(owner).deploy(
            governor.address,
            owner.address,
            owner.address
        );
    });

    describe("constructor", () => {
        it("can be constructed", async () => {
            staking = await new CatheonStaking__factory(owner).deploy(
                catheonFake.address,
                xCatheonFake.address,
                authority.address
            );

            expect(await staking.Catheon()).to.equal(catheonFake.address);
            expect(await staking.xCatheon()).to.equal(xCatheonFake.address);
            expect(await authority.governor()).to.equal(governor.address);
        });

        it("will not allow a 0x0 Catheon address", async () => {
            await expect(
                new CatheonStaking__factory(owner).deploy(
                    ZERO_ADDRESS,
                    xCatheonFake.address,
                    authority.address
                )
            ).to.be.reverted;
        });

        it("will not allow a 0x0 xCatheon address", async () => {
            await expect(
                new CatheonStaking__factory(owner).deploy(
                    catheonFake.address,
                    ZERO_ADDRESS,
                    authority.address
                )
            ).to.be.reverted;
        });

    });

    describe("initialization", () => {
        beforeEach(async () => {
            staking = await new CatheonStaking__factory(owner).deploy(
                catheonFake.address,
                xCatheonFake.address,
                authority.address
            );
        });

        describe("setWarmupLength", () => {
            it("sets the number of warmup are required", async () => {
                expect(await staking.warmupPeriod()).to.equal(4838400);
                await staking.connect(governor).setWarmupLength(2);
                expect(await staking.warmupPeriod()).to.equal(2);
            });

            it("emits a WarmupSet event", async () => {
                await expect(staking.connect(governor).setWarmupLength(2))
                    .to.emit(staking, "WarmupSet")
                    .withArgs(2);
            });

            it("can only be set by the governor", async () => {
                await expect(staking.connect(other).setWarmupLength(2)).to.be.reverted;
            });
        });
    });

    describe("post-initialization", () => {
        async function deployStaking() {
            staking = await new CatheonStaking__factory(owner).deploy(
                catheonFake.address,
                xCatheonFake.address,
                authority.address
            );
            await staking.connect(governor);
        }

        beforeEach(async () => {
            await deployStaking();
        });

        describe("stake", () => {
            it("adds amount to staking contract and update warmup(deposit) info", async () => {
               
                const amount = 1000;                        

                catheonFake.transferFrom
                    .whenCalledWith(alice.address, staking.address, amount)
                    .returns(true);
                catheonFake.connect(alice).approve(staking.address, amount);
                await staking.connect(alice).stake(alice.address, amount);

                expect(await staking.warmupPeriod()).to.equal(56*24*60*60);
                const warmupInfo = await staking.warmupInfo(alice.address);
                
                expect(warmupInfo.deposit).to.not.be.above(amount);
                
            });

    
        });


        describe("unstake", () => {
            it("can redeem xCatheon for Catheon", async () => {
                const amount = 1000;
                catheonFake.connect(alice).approve(staking.address, amount);
                
                await staking.connect(alice).stake(bob.address, amount);

                xCatheonFake.connect(bob).approve(staking.address, amount);
                xCatheonFake.transferFrom.returns(true);
                catheonFake.transfer.returns(true);

                catheonFake.connect(alice).approve(staking.address, amount);                
             

                xCatheonFake.connect(bob).approve(staking.address, amount);
                xCatheonFake.connect(bob).mint(bob.address, amount);

                xCatheonFake.transferFrom
                .whenCalledWith(bob.address, staking.address, amount)
                .returns(true);    
                catheonFake.transferFrom
                .whenCalledWith(bob.address, staking.address, amount)
                .returns(true);               

                await staking.connect(bob).unstake(bob.address, 50);

               
            });

        
        });

    });
});
